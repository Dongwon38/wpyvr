<?php
/**
 * Custom Authentication Integration
 * Handles Firebase to WordPress user sync and JWT generation
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register REST API endpoint for user sync
 */
add_action('rest_api_init', function () {
    register_rest_route('custom-auth/v1', '/sync', [
        'methods' => 'POST',
        'callback' => 'custom_auth_sync_user',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('custom-auth/v1', '/verify', [
        'methods' => 'POST',
        'callback' => 'custom_auth_verify_jwt',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Verify Firebase ID token
 * 
 * @param string $auth_header Authorization header value
 * @return array|false Decoded token data or false on failure
 */
function verify_firebase_token($auth_header) {
    if (!$auth_header || !str_starts_with($auth_header, 'Bearer ')) {
        return false;
    }

    $token = substr($auth_header, 7);
    
    try {
        // Fetch Google's public keys
        $keys_url = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
        $keys_json = wp_remote_get($keys_url, ['timeout' => 10]);
        
        if (is_wp_error($keys_json)) {
            error_log('Firebase keys fetch error: ' . $keys_json->get_error_message());
            return false;
        }

        $keys = json_decode(wp_remote_retrieve_body($keys_json), true);
        if (!$keys) {
            error_log('Firebase keys parse error');
            return false;
        }

        // Decode JWT header to get the key ID
        $token_parts = explode('.', $token);
        if (count($token_parts) !== 3) {
            return false;
        }

        $header = json_decode(base64_decode(strtr($token_parts[0], '-_', '+/')), true);
        if (!isset($header['kid']) || !isset($keys[$header['kid']])) {
            return false;
        }

        // Verify the signature using the public key
        $public_key = $keys[$header['kid']];
        $public_key_resource = openssl_pkey_get_public($public_key);
        
        if (!$public_key_resource) {
            return false;
        }

        // Verify signature
        $signature = base64_decode(strtr($token_parts[2], '-_', '+/'));
        $data = $token_parts[0] . '.' . $token_parts[1];
        
        $verified = openssl_verify($data, $signature, $public_key_resource, OPENSSL_ALGO_SHA256);
        openssl_free_key($public_key_resource);

        if ($verified !== 1) {
            return false;
        }

        // Decode and validate payload
        $payload = json_decode(base64_decode(strtr($token_parts[1], '-_', '+/')), true);
        
        // Validate token claims
        if (!$payload || 
            !isset($payload['exp']) || 
            !isset($payload['iat']) || 
            !isset($payload['email']) ||
            !isset($payload['user_id'])) {
            return false;
        }

        // Check expiration
        if ($payload['exp'] < time()) {
            return false;
        }

        // Validate issuer
        $project_id = defined('FIREBASE_PROJECT_ID') ? FIREBASE_PROJECT_ID : 'wpyvr-9c1f5';
        if (!isset($payload['iss']) || $payload['iss'] !== "https://securetoken.google.com/{$project_id}") {
            return false;
        }

        return $payload;

    } catch (Exception $e) {
        error_log('Firebase token verification error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Sync Firebase user to WordPress
 * 
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function custom_auth_sync_user(WP_REST_Request $request) {
    $auth_header = $request->get_header('authorization');
    $decoded = verify_firebase_token($auth_header);

    if (!$decoded || !isset($decoded['email'])) {
        return new WP_Error('invalid_token', 'Firebase token invalid or expired', ['status' => 403]);
    }

    // Sanitize inputs
    $email = sanitize_email($decoded['email']);
    $firebase_uid = sanitize_text_field($decoded['user_id']);
    $name = sanitize_text_field($request->get_param('name') ?? '');
    $photo = esc_url_raw($request->get_param('photoURL') ?? '');
    $website = esc_url_raw($request->get_param('website') ?? '');
    $job_title = sanitize_text_field($request->get_param('job') ?? '');
    $social_links = $request->get_param('social_links') ?? [];

    // Validate email
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', ['status' => 400]);
    }

    // Find or create WordPress user
    $user = get_user_by('email', $email);
    
    if (!$user) {
        // Create new user
        $username = sanitize_user(explode('@', $email)[0] . '_' . wp_generate_password(4, false));
        $user_id = wp_insert_user([
            'user_login' => $username,
            'user_email' => $email,
            'display_name' => $name ?: $email,
            'user_pass' => wp_generate_password(24, true, true),
            'role' => 'subscriber',
        ]);

        if (is_wp_error($user_id)) {
            return new WP_Error('user_creation_failed', $user_id->get_error_message(), ['status' => 500]);
        }
    } else {
        $user_id = $user->ID;
        
        // Update display name if provided and different
        if ($name && $name !== $user->display_name) {
            wp_update_user([
                'ID' => $user_id,
                'display_name' => $name,
            ]);
        }
    }

    // Update user meta
    update_user_meta($user_id, 'firebase_uid', $firebase_uid);
    if ($photo) {
        update_user_meta($user_id, 'profile_photo', $photo);
    }

    // Sync to custom user profiles table
    global $wpdb;
    $table = $wpdb->prefix . 'user_profiles';
    
    // Check if table exists
    $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table'") === $table;
    
    if ($table_exists) {
        $wpdb->replace($table, [
            'user_id' => $user_id,
            'website' => $website,
            'job_title' => $job_title,
            'social_links' => maybe_serialize($social_links),
            'updated_at' => current_time('mysql'),
        ]);
    }

    // Get user data
    $user_data = get_userdata($user_id);
    
    // Generate WordPress JWT
    $jwt = custom_generate_jwt_for_user($user_id);

    return new WP_REST_Response([
        'success' => true,
        'wp_user_id' => $user_id,
        'email' => $user_data->user_email,
        'display_name' => $user_data->display_name,
        'roles' => $user_data->roles,
        'jwt' => $jwt,
    ], 200);
}

/**
 * Generate JWT token for WordPress user
 * 
 * @param int $user_id WordPress user ID
 * @return string JWT token
 */
function custom_generate_jwt_for_user($user_id) {
    $secret = defined('AUTH_KEY') ? AUTH_KEY : 'fallback-secret-key-please-define-in-wp-config';
    $issuedAt = time();
    $expire = $issuedAt + (7 * DAY_IN_SECONDS); // 7 days

    $payload = [
        'iss' => get_bloginfo('url'),
        'iat' => $issuedAt,
        'exp' => $expire,
        'data' => [
            'user' => [
                'id' => $user_id,
            ],
        ],
    ];

    return custom_jwt_encode($payload, $secret);
}

/**
 * Simple JWT encode using HS256
 * 
 * @param array $payload
 * @param string $secret
 * @return string
 */
function custom_jwt_encode($payload, $secret) {
    $header = [
        'typ' => 'JWT',
        'alg' => 'HS256',
    ];

    $header_encoded = custom_base64url_encode(json_encode($header));
    $payload_encoded = custom_base64url_encode(json_encode($payload));
    
    $signature = hash_hmac('sha256', $header_encoded . '.' . $payload_encoded, $secret, true);
    $signature_encoded = custom_base64url_encode($signature);

    return $header_encoded . '.' . $payload_encoded . '.' . $signature_encoded;
}

/**
 * Decode and verify WordPress JWT
 * 
 * @param string $token
 * @param string $secret
 * @return array|false
 */
function custom_jwt_decode($token, $secret) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }

    list($header_encoded, $payload_encoded, $signature_encoded) = $parts;

    // Verify signature
    $signature = custom_base64url_decode($signature_encoded);
    $expected_signature = hash_hmac('sha256', $header_encoded . '.' . $payload_encoded, $secret, true);

    if (!hash_equals($expected_signature, $signature)) {
        return false;
    }

    // Decode payload
    $payload = json_decode(custom_base64url_decode($payload_encoded), true);

    // Validate expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false;
    }

    return $payload;
}

/**
 * Base64 URL encode
 */
function custom_base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Base64 URL decode
 */
function custom_base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

/**
 * Verify WordPress JWT endpoint
 * 
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function custom_auth_verify_jwt(WP_REST_Request $request) {
    $auth_header = $request->get_header('authorization');
    
    if (!$auth_header || !str_starts_with($auth_header, 'Bearer ')) {
        return new WP_Error('missing_token', 'Authorization token missing', ['status' => 401]);
    }

    $token = substr($auth_header, 7);
    $secret = defined('AUTH_KEY') ? AUTH_KEY : 'fallback-secret-key-please-define-in-wp-config';
    
    $decoded = custom_jwt_decode($token, $secret);

    if (!$decoded || !isset($decoded['data']['user']['id'])) {
        return new WP_Error('invalid_token', 'Invalid or expired token', ['status' => 403]);
    }

    $user_id = $decoded['data']['user']['id'];
    $user_data = get_userdata($user_id);

    if (!$user_data) {
        return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
    }

    return new WP_REST_Response([
        'valid' => true,
        'user_id' => $user_id,
        'email' => $user_data->user_email,
        'display_name' => $user_data->display_name,
        'roles' => $user_data->roles,
    ], 200);
}

/**
 * Add CORS headers for REST API
 */
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit;
        }
        
        return $value;
    });
}, 15);
