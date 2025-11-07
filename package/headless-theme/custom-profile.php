<?php
/**
 * Custom Profile Management
 * User Profile REST API Endpoints + Database Management
 */

if (!defined('ABSPATH')) {
    exit;
}

// ========================
// 🗄️ 1. DATABASE TABLE SETUP
// ========================
function custom_profile_create_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'user_profiles';
    $charset_collate = $wpdb->get_charset_collate();

    // Check if table already exists
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name) {
        return;
    }

    $sql = "CREATE TABLE $table_name (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT(20) UNSIGNED NOT NULL,
        nickname VARCHAR(100) DEFAULT NULL,
        greeting VARCHAR(255) DEFAULT NULL,
        avatar_url VARCHAR(255) DEFAULT NULL,
        website VARCHAR(255) DEFAULT NULL,
        job_title VARCHAR(255) DEFAULT NULL,
        social_links JSON DEFAULT NULL,
        last_seen_at DATETIME DEFAULT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY user_id_unique (user_id),
        FOREIGN KEY (user_id) REFERENCES {$wpdb->prefix}users(ID) ON DELETE CASCADE
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    error_log("✅ wp_user_profiles table created or already exists");
}

// Run table creation on theme activation
add_action('after_switch_theme', 'custom_profile_create_table');
// Also run on init for safety (idempotent)
add_action('init', 'custom_profile_create_table');

// ========================
// 🚀 2. REST API ROUTES
// ========================
add_action('rest_api_init', function () {
    // Get user profile
    register_rest_route('custom-profile/v1', '/get', [
        'methods'  => 'GET',
        'callback' => 'custom_profile_get',
        'permission_callback' => '__return_true',
        'args' => [
            'user_id' => [
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                }
            ]
        ]
    ]);

    // Update/create user profile
    register_rest_route('custom-profile/v1', '/update', [
        'methods'  => 'POST',
        'callback' => 'custom_profile_update',
        'permission_callback' => '__return_true',
    ]);
});

// ========================
// 🔐 3. JWT VERIFICATION HELPER
// ========================
function verify_jwt_token($auth_header) {
    if (!$auth_header || !str_starts_with($auth_header, 'Bearer ')) {
        error_log('❌ Missing Authorization header');
        return false;
    }

    $token = substr($auth_header, 7);
    $secret = defined('AUTH_KEY') ? AUTH_KEY : 'fallback-secret-key';
    
    // Use existing JWT decode function from custom-auth.php
    $decoded = custom_jwt_decode($token, $secret);

    if (!$decoded || !isset($decoded['data']['user']['id'])) {
        error_log('❌ Invalid JWT token');
        return false;
    }

    return $decoded['data']['user']['id'];
}

// ========================
// 📖 4. GET PROFILE ENDPOINT
// ========================
function custom_profile_get(WP_REST_Request $request) {
    global $wpdb;

    // Verify JWT
    $auth_header = $request->get_header('authorization');
    $authenticated_user_id = verify_jwt_token($auth_header);

    if (!$authenticated_user_id) {
        return new WP_Error('unauthorized', 'Invalid or missing authentication token', ['status' => 401]);
    }

    $requested_user_id = intval($request->get_param('user_id'));

    // For now, users can only view their own profile
    // In future, you can add logic to allow viewing other profiles
    if ($authenticated_user_id !== $requested_user_id) {
        return new WP_Error('forbidden', 'You can only view your own profile', ['status' => 403]);
    }

    // Check if WP user exists
    $user_data = get_userdata($requested_user_id);
    if (!$user_data) {
        return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
    }

    // Fetch profile from custom table
    $table_name = $wpdb->prefix . 'user_profiles';
    $profile = $wpdb->get_row(
        $wpdb->prepare("SELECT * FROM $table_name WHERE user_id = %d", $requested_user_id),
        ARRAY_A
    );

    if (!$profile) {
        return new WP_Error('profile_not_found', 'Profile not found', ['status' => 404]);
    }

    // Parse JSON fields
    $profile['social_links'] = !empty($profile['social_links']) 
        ? json_decode($profile['social_links'], true) 
        : [];

    // Ensure social_links is an array
    if (!is_array($profile['social_links'])) {
        $profile['social_links'] = [];
    }

    // Convert user_id to integer
    $profile['user_id'] = intval($profile['user_id']);

    return new WP_REST_Response($profile, 200);
}

// ========================
// ✏️ 5. UPDATE PROFILE ENDPOINT
// ========================
function custom_profile_update(WP_REST_Request $request) {
    global $wpdb;

    // Verify JWT
    $auth_header = $request->get_header('authorization');
    $authenticated_user_id = verify_jwt_token($auth_header);

    if (!$authenticated_user_id) {
        return new WP_Error('unauthorized', 'Invalid or missing authentication token', ['status' => 401]);
    }

    // Get request body
    $user_id = intval($request->get_param('user_id'));
    $nickname = sanitize_text_field($request->get_param('nickname'));
    $greeting = sanitize_text_field($request->get_param('greeting'));
    $job_title = sanitize_text_field($request->get_param('job_title'));
    $website = esc_url_raw($request->get_param('website'));
    $avatar_url = esc_url_raw($request->get_param('avatar_url'));
    $social_links = $request->get_param('social_links') ?? [];

    // Users can only update their own profile
    if ($authenticated_user_id !== $user_id) {
        return new WP_Error('forbidden', 'You can only update your own profile', ['status' => 403]);
    }

    // Validate required fields
    if (empty($nickname) || empty($greeting)) {
        return new WP_Error('validation_error', 'Nickname and greeting are required', ['status' => 400]);
    }

    // Check if WP user exists
    $user_data = get_userdata($user_id);
    if (!$user_data) {
        return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
    }

    // Validate and sanitize social links
    $sanitized_social_links = [];
    if (is_array($social_links)) {
        foreach ($social_links as $link) {
            if (isset($link['type']) && isset($link['url'])) {
                $sanitized_social_links[] = [
                    'type' => sanitize_text_field($link['type']),
                    'url' => esc_url_raw($link['url'])
                ];
            }
        }
    }

    // Convert social links to JSON
    $social_links_json = !empty($sanitized_social_links) 
        ? json_encode($sanitized_social_links) 
        : null;

    // Insert or update profile in database
    $table_name = $wpdb->prefix . 'user_profiles';
    $current_time = current_time('mysql');

    $data = [
        'user_id' => $user_id,
        'nickname' => $nickname,
        'greeting' => $greeting,
        'job_title' => $job_title,
        'website' => $website,
        'avatar_url' => $avatar_url,
        'social_links' => $social_links_json,
        'last_seen_at' => $current_time,
        'updated_at' => $current_time,
    ];

    $format = ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'];

    // Check if profile exists
    $existing = $wpdb->get_var(
        $wpdb->prepare("SELECT id FROM $table_name WHERE user_id = %d", $user_id)
    );

    if ($existing) {
        // Update existing profile
        $result = $wpdb->update(
            $table_name,
            $data,
            ['user_id' => $user_id],
            $format,
            ['%d']
        );

        if ($result === false) {
            error_log("❌ Failed to update profile for user $user_id: " . $wpdb->last_error);
            return new WP_Error('update_failed', 'Failed to update profile', ['status' => 500]);
        }

        error_log("✅ Updated profile for user $user_id");
    } else {
        // Insert new profile
        $result = $wpdb->insert($table_name, $data, $format);

        if ($result === false) {
            error_log("❌ Failed to create profile for user $user_id: " . $wpdb->last_error);
            return new WP_Error('create_failed', 'Failed to create profile', ['status' => 500]);
        }

        error_log("✅ Created new profile for user $user_id");
    }

    // Also update WordPress display_name if nickname is different
    if ($nickname !== $user_data->display_name) {
        wp_update_user([
            'ID' => $user_id,
            'display_name' => $nickname
        ]);
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Profile updated successfully',
        'user_id' => $user_id,
        'data' => [
            'nickname' => $nickname,
            'greeting' => $greeting,
            'job_title' => $job_title,
            'website' => $website,
            'avatar_url' => $avatar_url,
            'social_links' => $sanitized_social_links,
            'updated_at' => $current_time
        ]
    ], 200);
}

// ========================
// 🕐 6. UPDATE LAST SEEN
// ========================
function update_user_last_seen($user_id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'user_profiles';
    
    // Check if profile exists
    $exists = $wpdb->get_var(
        $wpdb->prepare("SELECT id FROM $table_name WHERE user_id = %d", $user_id)
    );

    $current_time = current_time('mysql');

    if ($exists) {
        // Update last_seen_at
        $wpdb->update(
            $table_name,
            ['last_seen_at' => $current_time],
            ['user_id' => $user_id],
            ['%s'],
            ['%d']
        );
    } else {
        // Create a minimal profile entry if it doesn't exist
        $wpdb->insert(
            $table_name,
            [
                'user_id' => $user_id,
                'last_seen_at' => $current_time,
                'updated_at' => $current_time
            ],
            ['%d', '%s', '%s']
        );
    }
}
