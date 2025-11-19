<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', 'wpyvr_hub_register_routes');
function wpyvr_hub_register_routes(): void {
    register_rest_route(
        'hub/v1',
        '/receive-post',
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'wpyvr_hub_receive_post',
            'permission_callback' => '__return_true',
        )
    );

}

function wpyvr_hub_receive_post(WP_REST_Request $request) {
    $auth = wpyvr_hub_validate_request_token($request);
    if (is_wp_error($auth)) {
        wpyvr_hub_log_event(
            array(
                'status'  => 'failed',
                'message' => $auth->get_error_message(),
                'payload' => array('request_headers' => $request->get_headers()),
            )
        );

        return $auth;
    }

    $payload = $request->get_json_params();
    if (empty($payload) || !is_array($payload)) {
        $error = new WP_Error('invalid_payload', __('JSON payload is missing or malformed.', 'wpyvr'), array('status' => 400));
        wpyvr_hub_log_event(
            array(
                'status'  => 'failed',
                'message' => $error->get_error_message(),
                'payload' => array('raw' => $request->get_body()),
            )
        );

        return $error;
    }

    $postarr = wpyvr_hub_prepare_post_array($payload, $auth['user_id']);
    if (is_wp_error($postarr)) {
        wpyvr_hub_log_event(
            array(
                'status'      => 'failed',
                'message'     => $postarr->get_error_message(),
                'source_site' => esc_url_raw($payload['source'] ?? ''),
                'source_slug' => sanitize_title($payload['slug'] ?? ''),
                'payload'     => $payload,
            )
        );

        return $postarr;
    }

    $post_id = wpyvr_hub_upsert_post($postarr, $payload);
    if (is_wp_error($post_id)) {
        wpyvr_hub_log_event(
            array(
                'status'      => 'failed',
                'message'     => $post_id->get_error_message(),
                'source_site' => esc_url_raw($payload['source'] ?? ''),
                'source_slug' => sanitize_title($payload['slug'] ?? ''),
                'payload'     => $payload,
            )
        );

        return $post_id;
    }

    wpyvr_hub_store_meta($post_id, $payload, $auth['firebase_uid']);
    wpyvr_hub_assign_terms($post_id, $payload);
    wpyvr_hub_mark_profile_connected($auth['user_id']);
    wpyvr_hub_notify_admin($post_id, $payload);

    wpyvr_hub_log_event(
        array(
            'post_id'     => $post_id,
            'source_site' => esc_url_raw($payload['source'] ?? ''),
            'source_slug' => sanitize_title($payload['slug'] ?? ''),
            'status'      => 'pending',
            'message'     => 'Post stored and awaiting moderation.',
            'payload'     => $payload,
        )
    );

    return new WP_REST_Response(
        array(
            'post_id' => $post_id,
            'status'  => get_post_status($post_id),
            'message' => __('Post saved as pending and logged.', 'wpyvr'),
        ),
        201
    );
}

function wpyvr_hub_validate_request_token(WP_REST_Request $request) {
    $auth_header = $request->get_header('authorization');
    if (empty($auth_header) || stripos($auth_header, 'bearer ') !== 0) {
        return new WP_Error('missing_token', __('Authorization header is missing.', 'wpyvr'), array('status' => 401));
    }

    $token = trim(substr($auth_header, 7));
    if (empty($token)) {
        return new WP_Error('invalid_token', __('Bearer token is empty.', 'wpyvr'), array('status' => 401));
    }

    $profile = wpyvr_hub_get_profile_by_push_token($token);
    if ($profile) {
        $firebase_uid = $profile['firebase_uid'];
        if (empty($firebase_uid)) {
            $firebase_uid = sanitize_text_field(get_user_meta($profile['user_id'], 'firebase_uid', true));
        }

        return array(
            'firebase_uid' => $firebase_uid,
            'user_id'      => $profile['user_id'],
        );
    }

    $firebase = wpyvr_hub_verify_token_with_firebase($token);
    if (is_wp_error($firebase)) {
        return $firebase;
    }

    $user_id = wpyvr_hub_get_user_id_by_firebase_uid($firebase['firebase_uid']);
    if (!$user_id) {
        return new WP_Error('user_not_mapped', __('Firebase UID is not linked to any WordPress user.', 'wpyvr'), array('status' => 403));
    }

    return array(
        'firebase_uid' => $firebase['firebase_uid'],
        'user_id'      => $user_id,
    );
}

function wpyvr_hub_verify_token_with_firebase(string $token) {
    $api_key = defined('WPYVR_FIREBASE_API_KEY') ? WPYVR_FIREBASE_API_KEY : getenv('WPYVR_FIREBASE_API_KEY');
    if (empty($api_key)) {
        return new WP_Error('missing_api_key', __('Firebase API key is not configured.', 'wpyvr'), array('status' => 500));
    }

    $response = wp_remote_post(
        'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' . $api_key,
        array(
            'headers' => array('Content-Type' => 'application/json'),
            'body'    => wp_json_encode(array('idToken' => $token)),
            'timeout' => 15,
        )
    );

    if (is_wp_error($response)) {
        return $response;
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (empty($body['users'][0]['localId'])) {
        return new WP_Error('firebase_rejected', __('Firebase token verification failed.', 'wpyvr'), array('status' => 403));
    }

    return array(
        'firebase_uid' => sanitize_text_field($body['users'][0]['localId']),
        'email'        => sanitize_email($body['users'][0]['email'] ?? ''),
    );
}

function wpyvr_hub_get_user_id_by_firebase_uid(string $firebase_uid): int {
    global $wpdb;
    $table = $wpdb->prefix . 'user_profiles';
    $user_id = (int) $wpdb->get_var(
        $wpdb->prepare(
            "SELECT user_id FROM {$table} WHERE firebase_uid = %s LIMIT 1",
            $firebase_uid
        )
    );

    if ($user_id) {
        return $user_id;
    }

    return (int) get_option('default_post_user', 0);
}

function wpyvr_hub_prepare_post_array(array $payload, int $user_id) {
    $title_raw = $payload['title'] ?? '';
    $content_raw = $payload['content'] ?? '';
    $slug_raw = $payload['slug'] ?? '';

    $title = sanitize_text_field($title_raw);
    $content = wp_kses_post($content_raw);
    $excerpt = isset($payload['excerpt']) ? wp_kses_post($payload['excerpt']) : wp_trim_words(wp_strip_all_tags($content), 55);
    $slug = sanitize_title($slug_raw ?: $title);

    if (empty($title) || empty($content) || empty($slug)) {
        return new WP_Error('missing_fields', __('title, content, and slug are required.', 'wpyvr'), array('status' => 422));
    }

    return array(
        'post_type'    => 'post',
        'post_status'  => 'pending',
        'post_author'  => $user_id,
        'post_title'   => $title,
        'post_content' => $content,
        'post_excerpt' => wp_strip_all_tags($excerpt),
        'post_name'    => $slug,
    );
}

function wpyvr_hub_upsert_post(array $postarr, array $payload) {
    $source_site = esc_url_raw($payload['source'] ?? ($payload['origin_site'] ?? ''));
    $source_slug = sanitize_title($payload['slug'] ?? $postarr['post_name']);
    $existing_id = wpyvr_hub_find_existing_post($source_site, $source_slug);

    if ($existing_id) {
        $postarr['ID'] = $existing_id;
        $postarr['post_name'] = wpyvr_hub_resolve_unique_slug($postarr['post_name'], $existing_id);
        $result = wp_update_post($postarr, true);
    } else {
        $postarr['post_name'] = wpyvr_hub_resolve_unique_slug($postarr['post_name']);
        $result = wp_insert_post($postarr, true);
        $existing_id = is_wp_error($result) ? 0 : $result;
    }

    if (is_wp_error($result)) {
        return $result;
    }

    return $existing_id;
}

function wpyvr_hub_find_existing_post(string $source_site, string $source_slug): int {
    if (empty($source_site) || empty($source_slug)) {
        return 0;
    }

    $query = new WP_Query(
        array(
            'post_type'      => 'post',
            'post_status'    => array('pending', 'draft', 'publish', 'future'),
            'posts_per_page' => 1,
            'fields'         => 'ids',
            'meta_query'     => array(
                'relation' => 'AND',
                array(
                    'key'   => 'hub_source_site',
                    'value' => $source_site,
                ),
                array(
                    'key'   => 'hub_source_slug',
                    'value' => $source_slug,
                ),
            ),
        )
    );

    $post_id = $query->have_posts() ? (int) $query->posts[0] : 0;
    wp_reset_postdata();

    return $post_id;
}

function wpyvr_hub_resolve_unique_slug(string $desired_slug, int $post_id = 0): string {
    $unique = wp_unique_post_slug($desired_slug, $post_id, 'pending', 'post', 0);
    return $unique ?: sanitize_title($desired_slug . '-' . wp_generate_password(4, false));
}

function wpyvr_hub_store_meta(int $post_id, array $payload, string $firebase_uid): void {
    $source_site = esc_url_raw($payload['source'] ?? ($payload['origin_site'] ?? ''));
    $source_slug = sanitize_title($payload['slug'] ?? '');
    $source_author = sanitize_text_field($payload['author'] ?? '');
    $featured_image = esc_url_raw($payload['featured_image'] ?? '');
    $raw_categories = wp_json_encode($payload['categories'] ?? array(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $raw_tags = wp_json_encode($payload['tags'] ?? array(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    update_post_meta($post_id, 'hub_source_site', $source_site);
    update_post_meta($post_id, 'hub_source_slug', $source_slug);
    update_post_meta($post_id, 'hub_source_author', $source_author);
    update_post_meta($post_id, 'hub_featured_image_url', $featured_image);
    update_post_meta($post_id, 'hub_raw_categories', $raw_categories);
    update_post_meta($post_id, 'hub_raw_tags', $raw_tags);
    update_post_meta($post_id, 'hub_firebase_uid', $firebase_uid);

    if (!metadata_exists('post', $post_id, '_hub_likes_count')) {
        add_post_meta($post_id, '_hub_likes_count', 0, true);
    }

    if (!metadata_exists('post', $post_id, '_hub_comments_count')) {
        add_post_meta($post_id, '_hub_comments_count', 0, true);
    }

    if (!metadata_exists('post', $post_id, '_hub_hot_score')) {
        add_post_meta($post_id, '_hub_hot_score', 0, true);
    }
}

function wpyvr_hub_assign_terms(int $post_id, array $payload): void {
    if (!empty($payload['categories']) && is_array($payload['categories'])) {
        $category_ids = wpyvr_hub_map_terms($payload['categories'], 'category', $payload['source'] ?? '');
        if (!empty($category_ids)) {
            wp_set_post_terms($post_id, $category_ids, 'category');
        }
    }

    if (!empty($payload['tags']) && is_array($payload['tags'])) {
        $tag_ids = wpyvr_hub_map_terms($payload['tags'], 'post_tag', $payload['source'] ?? '');
        if (!empty($tag_ids)) {
            wp_set_post_terms($post_id, $tag_ids, 'post_tag');
        }
    }
}

function wpyvr_hub_notify_admin(int $post_id, array $payload): void {
    $admin_email = get_option('admin_email');
    if (empty($admin_email)) {
        return;
    }

    $title = get_the_title($post_id);
    $source_site = esc_url_raw($payload['source'] ?? '');
    $author = sanitize_text_field($payload['author'] ?? '');
    $edit_link = get_edit_post_link($post_id, '');

    $subject = sprintf('[WPYVR Hub] New submission awaiting review – %s', $title);
    $body_lines = array(
        'A new post has arrived on the hub and is waiting for moderation.',
        '',
        'Title: ' . $title,
        'Source site: ' . $source_site,
        'Author: ' . $author,
        'Review link: ' . $edit_link,
    );

    wp_mail($admin_email, $subject, implode("\n", $body_lines));
}

