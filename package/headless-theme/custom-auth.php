<?php
/**
 * Custom Authentication Integration
 * Firebase → WordPress Sync + JWT Auth + CORS Handling
 */

if (!defined('ABSPATH')) {
    exit;
}

// ========================
// 🚀 1. REST API ROUTES
// ========================
add_action('rest_api_init', function () {
    register_rest_route('custom-auth/v1', '/sync', [
        'methods'  => 'POST',
        'callback' => 'custom_auth_sync_user',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('custom-auth/v1', '/verify', [
        'methods'  => 'POST',
        'callback' => 'custom_auth_verify_jwt',
        'permission_callback' => '__return_true',
    ]);
});

// ========================
// ⚙️ 2. FIREBASE TOKEN VERIFY
// ========================
function verify_firebase_token($auth_header) {
    if (!$auth_header || !str_starts_with($auth_header, 'Bearer ')) {
        error_log('❌ Missing Authorization header');
        return false;
    }

    $token = substr($auth_header, 7);

    // ✅ (1) Try Firebase Admin SDK (kreait/firebase-php)
    if (class_exists('\Kreait\Firebase\Factory')) {
        try {
            $serviceAccountPath = __DIR__ . '/firebase-service-account.json';
            if (!file_exists($serviceAccountPath)) {
                throw new Exception('Service account file missing');
            }

            $factory = (new \Kreait\Firebase\Factory())->withServiceAccount($serviceAccountPath);
            $auth = $factory->createAuth();
            $verified = $auth->verifyIdToken($token);
            $claims = $verified->claims()->all();
            return $claims;

        } catch (\Kreait\Firebase\Exception\Auth\FailedToVerifyToken $e) {
            error_log('❌ Firebase token verification failed (SDK): ' . $e->getMessage());
            return false;
        } catch (Exception $e) {
            error_log('❌ General Firebase verification error: ' . $e->getMessage());
            return false;
        }
    }

    // ✅ (2) Fallback mode (Base64 decode only, for local dev)
    try {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;

        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        if (!$payload || empty($payload['email'])) {
            error_log('❌ Invalid Firebase payload');
            return false;
        }

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            error_log('❌ Token expired');
            return false;
        }

        return $payload;
    } catch (Exception $e) {
        error_log('❌ Token parse fallback error: ' . $e->getMessage());
        return false;
    }
}

// ========================
// 👥 3. SYNC FIREBASE → WORDPRESS
// ========================
function custom_auth_sync_user(WP_REST_Request $request) {
    $auth_header = $request->get_header('authorization');
    $decoded = verify_firebase_token($auth_header);

    if (!$decoded || !isset($decoded['email'])) {
        return new WP_Error('invalid_token', 'Firebase token invalid or expired', ['status' => 403]);
    }

    $email        = sanitize_email($decoded['email']);
    $firebase_uid = sanitize_text_field($decoded['user_id'] ?? '');
    $name         = sanitize_text_field($request->get_param('name') ?? '');
    $photo        = esc_url_raw($request->get_param('photoURL') ?? '');
    $website      = esc_url_raw($request->get_param('website') ?? '');
    $job_title    = sanitize_text_field($request->get_param('job') ?? '');
    $social_links = $request->get_param('social_links') ?? [];

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', ['status' => 400]);
    }

    // ✅ Find or create WP user
    $user = get_user_by('email', $email);

    if (!$user) {
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

        error_log("✅ Created new WP user for {$email}");
    } else {
        $user_id = $user->ID;
        if ($name && $name !== $user->display_name) {
            wp_update_user(['ID' => $user_id, 'display_name' => $name]);
        }
        error_log("🔁 Updated WP user for {$email}");
    }

    // ✅ Update metadata
    update_user_meta($user_id, 'firebase_uid', $firebase_uid);
    if ($photo) update_user_meta($user_id, 'profile_photo', $photo);

    // ✅ Custom profile table sync
    global $wpdb;
    $table = $wpdb->prefix . 'user_profiles';
    if ($wpdb->get_var("SHOW TABLES LIKE '$table'") === $table) {
        $wpdb->replace($table, [
            'user_id' => $user_id,
            'website' => $website,
            'job_title' => $job_title,
            'social_links' => maybe_serialize($social_links),
            'updated_at' => current_time('mysql'),
        ]);
    }

    $user_data = get_userdata($user_id);
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

// ========================
// 🔐 4. JWT GENERATION & VALIDATION
// ========================
function custom_generate_jwt_for_user($user_id) {
    $secret = defined('AUTH_KEY') ? AUTH_KEY : 'fallback-secret-key';
    $issuedAt = time();
    $expire = $issuedAt + (7 * DAY_IN_SECONDS);

    $payload = [
        'iss' => get_bloginfo('url'),
        'iat' => $issuedAt,
        'exp' => $expire,
        'data' => ['user' => ['id' => $user_id]],
    ];

    return custom_jwt_encode($payload, $secret);
}

function custom_jwt_encode($payload, $secret) {
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $header_encoded = custom_base64url_encode(json_encode($header));
    $payload_encoded = custom_base64url_encode(json_encode($payload));
    $signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", $secret, true);
    return "$header_encoded.$payload_encoded." . custom_base64url_encode($signature);
}

function custom_jwt_decode($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    [$h, $p, $s] = $parts;

    $expected = hash_hmac('sha256', "$h.$p", $secret, true);
    if (!hash_equals($expected, custom_base64url_decode($s))) return false;

    $payload = json_decode(custom_base64url_decode($p), true);
    if (isset($payload['exp']) && $payload['exp'] < time()) return false;
    return $payload;
}

function custom_base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function custom_base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

function custom_auth_verify_jwt(WP_REST_Request $request) {
    $auth_header = $request->get_header('authorization');
    if (!$auth_header || !str_starts_with($auth_header, 'Bearer ')) {
        return new WP_Error('missing_token', 'Authorization token missing', ['status' => 401]);
    }

    $token = substr($auth_header, 7);
    $secret = defined('AUTH_KEY') ? AUTH_KEY : 'fallback-secret-key';
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

// ========================
// 🌐 5. CORS HEADERS
// ========================
add_action('init', function () {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed_origins = ['http://localhost:3000', 'https://wpyvr.bitebuddy.ca'];

    if (in_array($origin, $allowed_origins, true)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit;
    }
});