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

    $incoming_id = wpyvr_hub_save_incoming_post($payload, $auth);
    if (is_wp_error($incoming_id)) {
        wpyvr_hub_log_event(
            array(
                'status'      => 'failed',
                'message'     => $incoming_id->get_error_message(),
                'source_site' => esc_url_raw($payload['source'] ?? ''),
                'source_slug' => sanitize_title($payload['slug'] ?? ''),
                'payload'     => $payload,
            )
        );

        return $incoming_id;
    }

    wpyvr_hub_mark_profile_connected($auth['user_id']);
    wpyvr_hub_notify_admin($incoming_id, $payload);

    wpyvr_hub_log_event(
        array(
            'post_id'     => null,
            'source_site' => esc_url_raw($payload['source'] ?? ''),
            'source_slug' => sanitize_title($payload['slug'] ?? ''),
            'status'      => 'pending',
            'message'     => 'Incoming post stored for moderation.',
            'payload'     => $payload,
        )
    );

    return new WP_REST_Response(
        array(
            'incoming_id' => $incoming_id,
            'status'      => 'pending',
            'message'     => __('Incoming post stored for moderation.', 'wpyvr'),
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

function wpyvr_hub_notify_admin(int $incoming_id, array $payload): void {
    $admin_email = get_option('admin_email');
    if (empty($admin_email)) {
        return;
    }

    $title = sanitize_text_field($payload['title'] ?? '');
    $source_site = esc_url_raw($payload['source'] ?? '');
    $author = sanitize_text_field($payload['author'] ?? '');
    $review_link = add_query_arg('incoming', $incoming_id, admin_url('admin.php?page=wpyvr-hub'));

    $subject = sprintf('[WPYVR Hub] New submission awaiting review – %s', $title ?: __('Untitled', 'wpyvr'));
    $body_lines = array(
        'A new post has arrived on the hub and is waiting for moderation.',
        '',
        'Title: ' . ($title ?: __('(untitled)', 'wpyvr')),
        'Source site: ' . $source_site,
        'Author: ' . $author,
        'Review link: ' . $review_link,
    );

    wp_mail($admin_email, $subject, implode("\n", $body_lines));
}

