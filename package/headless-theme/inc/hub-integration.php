<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route(
        'hub/v1',
        '/receive-post',
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'bitebuddy_hub_receive_post',
            'permission_callback' => '__return_true',
        )
    );

    register_rest_route(
        'hub/v1',
        '/posts/(?P<id>\d+)/like',
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'bitebuddy_hub_handle_like',
            'permission_callback' => '__return_true',
            'args'                => array(
                'like'    => array(
                    'type'     => 'boolean',
                    'required' => false,
                ),
                'user_id' => array(
                    'type'     => 'integer',
                    'required' => false,
                ),
            ),
        )
    );

    register_rest_route(
        'hub/v1',
        '/posts/(?P<id>\d+)/stats',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'bitebuddy_hub_get_stats',
            'permission_callback' => '__return_true',
        )
    );
});

function bitebuddy_hub_receive_post(WP_REST_Request $request) {
    $auth = bitebuddy_hub_validate_request_token($request);
    if (is_wp_error($auth)) {
        return $auth;
    }

    $payload = $request->get_json_params();
    if (empty($payload) || !is_array($payload)) {
        return new WP_Error('invalid_payload', 'Payload is missing or malformed.', array('status' => 400));
    }

    $prepared = bitebuddy_hub_prepare_post_array($payload, $auth['user_id']);
    if (is_wp_error($prepared)) {
        return $prepared;
    }

    $post_id = bitebuddy_hub_upsert_post($prepared, $payload, $auth);
    if (is_wp_error($post_id)) {
        return $post_id;
    }

    bitebuddy_hub_store_raw_meta($post_id, $payload, $auth['firebase_uid']);
    bitebuddy_hub_assign_terms($post_id, $payload);

    $response = array(
        'post_id' => $post_id,
        'status'  => get_post_status($post_id),
        'message' => 'Post stored as pending for review.',
    );

    return new WP_REST_Response($response, 201);
}

function bitebuddy_hub_validate_request_token(WP_REST_Request $request) {
    $auth_header = $request->get_header('authorization');
    if (empty($auth_header) || stripos($auth_header, 'bearer ') !== 0) {
        return new WP_Error('missing_token', 'Authorization header is missing.', array('status' => 401));
    }

    $token = trim(substr($auth_header, 7));
    if (empty($token)) {
        return new WP_Error('invalid_token', 'Token is empty.', array('status' => 401));
    }

    $firebase = bitebuddy_hub_verify_token_with_firebase($token);
    if (is_wp_error($firebase)) {
        return $firebase;
    }

    $user_id = bitebuddy_hub_get_user_id_by_firebase_uid($firebase['firebase_uid']);
    if (!$user_id) {
        return new WP_Error('user_not_mapped', 'No WordPress user is linked to the Firebase UID.', array('status' => 403));
    }

    return array(
        'firebase_uid' => $firebase['firebase_uid'],
        'user_id'      => $user_id,
    );
}

function bitebuddy_hub_verify_token_with_firebase(string $token) {
    $api_key = defined('BITEBUDDY_FIREBASE_API_KEY') ? BITEBUDDY_FIREBASE_API_KEY : getenv('BITEBUDDY_FIREBASE_API_KEY');
    if (empty($api_key)) {
        return new WP_Error('missing_api_key', 'Firebase API key is not configured.', array('status' => 500));
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
        return new WP_Error('invalid_token', 'Firebase token verification failed.', array('status' => 401));
    }

    return array(
        'firebase_uid' => sanitize_text_field($body['users'][0]['localId']),
        'email'        => sanitize_email($body['users'][0]['email'] ?? ''),
    );
}

function bitebuddy_hub_get_user_id_by_firebase_uid(string $firebase_uid): int {
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

    $fallback = get_option('default_post_user', get_current_user_id());
    return (int) $fallback;
}

function bitebuddy_hub_prepare_post_array(array $payload, int $user_id) {
    if (empty($payload['title']) || empty($payload['content']) || empty($payload['slug'])) {
        return new WP_Error('missing_fields', 'title, content, and slug are required.', array('status' => 422));
    }

    $content = wp_kses_post($payload['content']);
    $excerpt = isset($payload['excerpt']) ? wp_kses_post($payload['excerpt']) : wp_trim_words(wp_strip_all_tags($content), 55);

    return array(
        'post_type'    => 'post',
        'post_status'  => 'pending',
        'post_author'  => $user_id,
        'post_title'   => sanitize_text_field($payload['title']),
        'post_content' => $content,
        'post_excerpt' => $excerpt,
        'post_name'    => sanitize_title($payload['slug']),
    );
}

function bitebuddy_hub_upsert_post(array $postarr, array $payload, array $auth) {
    $origin_site = !empty($payload['origin_site']) ? esc_url_raw($payload['origin_site']) : '';
    $source_slug = sanitize_title($payload['slug']);
    $existing_id = bitebuddy_hub_find_existing_post($origin_site, $source_slug);

    if ($existing_id) {
        $postarr['ID'] = $existing_id;
        $result = wp_update_post($postarr, true);
    } else {
        $result = wp_insert_post($postarr, true);
        $existing_id = is_wp_error($result) ? 0 : $result;
    }

    if (is_wp_error($result)) {
        return $result;
    }

    update_post_meta($existing_id, '_hub_origin_site', $origin_site);
    update_post_meta($existing_id, '_hub_source_slug', $source_slug);
    update_post_meta($existing_id, '_hub_origin_firebase_uid', $auth['firebase_uid']);
    update_post_meta($existing_id, '_hub_origin_author', sanitize_text_field($payload['author_name'] ?? ''));

    return $existing_id;
}

function bitebuddy_hub_find_existing_post(string $origin_site, string $source_slug): int {
    if (empty($origin_site) || empty($source_slug)) {
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
                    'key'   => '_hub_origin_site',
                    'value' => $origin_site,
                ),
                array(
                    'key'   => '_hub_source_slug',
                    'value' => $source_slug,
                ),
            ),
        )
    );

    $post_id = $query->have_posts() ? (int) $query->posts[0] : 0;
    wp_reset_postdata();

    return $post_id;
}

function bitebuddy_hub_store_raw_meta(int $post_id, array $payload, string $firebase_uid): void {
    update_post_meta($post_id, '_hub_origin_url', esc_url_raw($payload['origin_url'] ?? ''));
    update_post_meta($post_id, '_hub_thumbnail_url', esc_url_raw($payload['thumbnail_url'] ?? ''));
    update_post_meta($post_id, '_hub_raw_categories', wp_json_encode($payload['categories'] ?? array()));
    update_post_meta($post_id, '_hub_raw_tags', wp_json_encode($payload['tags'] ?? array()));
    update_post_meta($post_id, '_hub_push_payload', wp_json_encode($payload));
    update_post_meta($post_id, '_hub_author_display_name', sanitize_text_field($payload['author_name'] ?? ''));
    update_post_meta($post_id, '_hub_origin_firebase_uid', sanitize_text_field($firebase_uid));

    if (!metadata_exists('post', $post_id, '_hub_likes_count')) {
        add_post_meta($post_id, '_hub_likes_count', 0, true);
    }

    if (!metadata_exists('post', $post_id, '_hub_comments_count')) {
        add_post_meta($post_id, '_hub_comments_count', 0, true);
    }

    if (!metadata_exists('post', $post_id, '_hub_hot_score')) {
        add_post_meta($post_id, '_hub_hot_score', 0, true);
    }

    bitebuddy_hub_append_push_log($post_id, array(
        'received_at' => current_time('mysql'),
        'origin_site' => $payload['origin_site'] ?? '',
        'status'      => 'pending',
    ));
}

function bitebuddy_hub_append_push_log(int $post_id, array $entry): void {
    $log = get_post_meta($post_id, '_hub_push_log', true);
    if (empty($log) || !is_array($log)) {
        $log = array();
    }

    $log[] = $entry;
    update_post_meta($post_id, '_hub_push_log', $log);
}

function bitebuddy_hub_assign_terms(int $post_id, array $payload): void {
    if (!empty($payload['categories']) && is_array($payload['categories'])) {
        $category_ids = bitebuddy_hub_map_terms($payload['categories'], 'category', $payload['origin_site'] ?? '');
        if (!empty($category_ids)) {
            wp_set_post_terms($post_id, $category_ids, 'category');
        }
    }

    if (!empty($payload['tags']) && is_array($payload['tags'])) {
        $tag_ids = bitebuddy_hub_map_terms($payload['tags'], 'post_tag', $payload['origin_site'] ?? '');
        if (!empty($tag_ids)) {
            wp_set_post_terms($post_id, $tag_ids, 'post_tag');
        }
    }
}

function bitebuddy_hub_map_terms(array $source_terms, string $taxonomy, string $origin_site): array {
    global $wpdb;
    $table = $wpdb->prefix . 'hub_term_map';
    $mapped_ids = array();

    foreach ($source_terms as $term_name) {
        $term_name = sanitize_text_field($term_name);
        $hub_term_id = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT hub_term_id FROM {$table} WHERE source_site = %s AND source_tax = %s AND source_term = %s LIMIT 1",
                $origin_site,
                $taxonomy === 'category' ? 'category' : 'tag',
                $term_name
            )
        );

        if ($hub_term_id) {
            $mapped_ids[] = $hub_term_id;
        }
    }

    return array_unique(array_filter($mapped_ids));
}

function bitebuddy_hub_handle_like(WP_REST_Request $request) {
    $post_id = (int) $request['id'];
    $post = get_post($post_id);

    if (!$post) {
        return new WP_Error('not_found', 'Post not found.', array('status' => 404));
    }

    $like = $request->get_param('like');
    $like = null === $like ? true : (bool) $like;

    $user_id = (int) $request->get_param('user_id');
    $ip_hash = bitebuddy_hub_hash_ip($request);

    global $wpdb;
    $table = $wpdb->prefix . 'hub_likes';
    $fields = array(
        'post_id'    => $post_id,
        'user_id'    => $user_id ?: null,
        'ip_hash'    => $user_id ? null : $ip_hash,
        'created_at' => current_time('mysql', 1),
    );

    if ($like) {
        $wpdb->replace($table, $fields);
    } else {
        if ($user_id) {
            $wpdb->delete($table, array('post_id' => $post_id, 'user_id' => $user_id));
        } else {
            $wpdb->delete($table, array('post_id' => $post_id, 'ip_hash' => $ip_hash));
        }
    }

    $count = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE post_id = %d", $post_id));
    update_post_meta($post_id, '_hub_likes_count', $count);
    $hot_score = bitebuddy_hub_recalculate_hot_score($post_id);

    return new WP_REST_Response(
        array(
            'post_id'     => $post_id,
            'likes_count' => $count,
            'hot_score'   => $hot_score,
        ),
        200
    );
}

function bitebuddy_hub_hash_ip(WP_REST_Request $request): string {
    $ip = $request->get_client_ip();
    if (empty($ip)) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }

    return hash('sha256', $ip . NONCE_KEY);
}

function bitebuddy_hub_recalculate_hot_score(int $post_id): float {
    $likes = (int) get_post_meta($post_id, '_hub_likes_count', true);
    $comments = (int) get_post_meta($post_id, '_hub_comments_count', true);
    $post_time = get_post_time('U', true, $post_id);
    $age_hours = max(1, (time() - $post_time) / HOUR_IN_SECONDS);

    $score = round(($likes * 2 + $comments * 3) / $age_hours, 4);
    update_post_meta($post_id, '_hub_hot_score', $score);

    return $score;
}

function bitebuddy_hub_get_stats(WP_REST_Request $request) {
    $post_id = (int) $request['id'];
    $post = get_post($post_id);

    if (!$post) {
        return new WP_Error('not_found', 'Post not found.', array('status' => 404));
    }

    $stats = array(
        'post_id'        => $post_id,
        'likes_count'    => (int) get_post_meta($post_id, '_hub_likes_count', true),
        'comments_count' => (int) get_post_meta($post_id, '_hub_comments_count', true),
        'hot_score'      => (float) get_post_meta($post_id, '_hub_hot_score', true),
    );

    return new WP_REST_Response($stats, 200);
}
