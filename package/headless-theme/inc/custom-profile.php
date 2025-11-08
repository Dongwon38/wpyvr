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

    // Check if table already exists (dbDelta below will handle schema diffs)
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name) {
        // Intentionally fall through so dbDelta can update schema when needed
    }

    $sql = "CREATE TABLE $table_name (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT(20) UNSIGNED NOT NULL,
        nickname VARCHAR(100) DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        avatar_url TEXT DEFAULT NULL,
        position VARCHAR(255) DEFAULT NULL,
        specialties JSON DEFAULT NULL,
        company VARCHAR(255) DEFAULT NULL,
        website VARCHAR(255) DEFAULT NULL,
        profile_visibility ENUM('public', 'private') DEFAULT 'private',
        custom_email VARCHAR(255) DEFAULT NULL,
        social_links JSON DEFAULT NULL,
        privacy_settings JSON DEFAULT NULL,
        last_active_at DATETIME DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY user_id_unique (user_id),
        FOREIGN KEY (user_id) REFERENCES {$wpdb->prefix}users(ID) ON DELETE CASCADE,
        INDEX idx_last_active (last_active_at),
        INDEX idx_profile_visibility (profile_visibility)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    error_log("✅ wp_user_profiles table created or updated");
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

    // Get all members (for members page)
    register_rest_route('custom-profile/v1', '/members', [
        'methods'  => 'GET',
        'callback' => 'custom_profile_get_all_members',
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

    $requested_user_id = intval($request->get_param('user_id'));

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
    $profile['specialties'] = !empty($profile['specialties']) 
        ? json_decode($profile['specialties'], true) 
        : [];
    $profile['social_links'] = !empty($profile['social_links']) 
        ? json_decode($profile['social_links'], true) 
        : [];
    $profile['privacy_settings'] = !empty($profile['privacy_settings']) 
        ? json_decode($profile['privacy_settings'], true) 
        : [];

    // Ensure arrays
    if (!is_array($profile['specialties'])) $profile['specialties'] = [];
    if (!is_array($profile['social_links'])) $profile['social_links'] = [];
    if (!is_array($profile['privacy_settings'])) $profile['privacy_settings'] = [];

    // Add WordPress user data
    $profile['email'] = $user_data->user_email;
    $profile['role'] = !empty($user_data->roles) ? $user_data->roles[0] : 'subscriber';
    
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
    $bio = sanitize_textarea_field($request->get_param('bio'));
    $position = sanitize_text_field($request->get_param('position'));
    $specialties = $request->get_param('specialties') ?? [];
    $company = sanitize_text_field($request->get_param('company'));
    $website = sanitize_text_field($request->get_param('website'));
    $avatar_raw = $request->get_param('avatar_url');
    $avatar_url = $avatar_raw ? esc_url_raw($avatar_raw) : '';
    if (empty($avatar_url)) {
        $avatar_url = null;
    }
    $profile_visibility = sanitize_text_field($request->get_param('profile_visibility')) ?: 'private';
    $custom_email = sanitize_email($request->get_param('custom_email'));
    $social_links = $request->get_param('social_links') ?? [];
    $privacy_settings = $request->get_param('privacy_settings') ?? [];

    // Users can only update their own profile
    if ($authenticated_user_id !== $user_id) {
        return new WP_Error('forbidden', 'You can only update your own profile', ['status' => 403]);
    }

    // Validate required fields
    if (empty($nickname)) {
        return new WP_Error('validation_error', 'Nickname is required', ['status' => 400]);
    }

    // Validate profile_visibility
    if (!in_array($profile_visibility, ['public', 'private'])) {
        $profile_visibility = 'private';
    }

    // Check if WP user exists
    $user_data = get_userdata($user_id);
    if (!$user_data) {
        return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
    }

    // Sanitize specialties array
    $sanitized_specialties = [];
    if (is_array($specialties)) {
        foreach ($specialties as $specialty) {
            $clean = sanitize_text_field($specialty);
            if (!empty($clean)) {
                $sanitized_specialties[] = $clean;
            }
        }
    }

    // Sanitize social links
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

    // Sanitize privacy settings
    $sanitized_privacy = [];
    if (is_array($privacy_settings)) {
        $allowed_keys = ['show_email', 'show_position', 'show_company', 'show_website', 'show_specialties'];
        foreach ($allowed_keys as $key) {
            if (isset($privacy_settings[$key])) {
                $sanitized_privacy[$key] = (bool) $privacy_settings[$key];
            }
        }
    }

    // Convert to JSON
    $specialties_json = !empty($sanitized_specialties) ? json_encode($sanitized_specialties) : null;
    $social_links_json = !empty($sanitized_social_links) ? json_encode($sanitized_social_links) : null;
    $privacy_json = !empty($sanitized_privacy) ? json_encode($sanitized_privacy) : null;

    // Insert or update profile in database
    $table_name = $wpdb->prefix . 'user_profiles';
    $current_time = current_time('mysql');

    $data = [
        'user_id' => $user_id,
        'nickname' => $nickname,
        'bio' => $bio,
        'position' => $position,
        'specialties' => $specialties_json,
        'company' => $company,
        'website' => $website,
        'avatar_url' => $avatar_url,
        'profile_visibility' => $profile_visibility,
        'custom_email' => $custom_email,
        'social_links' => $social_links_json,
        'privacy_settings' => $privacy_json,
        'last_active_at' => $current_time,
        'updated_at' => $current_time,
    ];

    $format = ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'];

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
        $data['created_at'] = $current_time;
        $format[] = '%s';
        
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
            'bio' => $bio,
            'position' => $position,
            'specialties' => $sanitized_specialties,
            'company' => $company,
            'website' => $website,
            'avatar_url' => $avatar_url,
            'profile_visibility' => $profile_visibility,
            'custom_email' => $custom_email,
            'social_links' => $sanitized_social_links,
            'privacy_settings' => $sanitized_privacy,
            'updated_at' => $current_time
        ]
    ], 200);
}

// ========================
// 👥 6. GET ALL MEMBERS ENDPOINT
// ========================
function custom_profile_get_all_members(WP_REST_Request $request) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'user_profiles';
    $users_table = $wpdb->prefix . 'users';

    // Fetch only public profiles with user data
    $profiles = $wpdb->get_results("
        SELECT 
            p.*,
            u.user_email,
            u.display_name
        FROM $table_name p
        INNER JOIN $users_table u ON p.user_id = u.ID
        WHERE p.profile_visibility = 'public'
        ORDER BY p.last_active_at DESC
    ", ARRAY_A);

    $members = [];
    foreach ($profiles as $profile) {
        // Parse JSON fields
        $profile['specialties'] = !empty($profile['specialties']) 
            ? json_decode($profile['specialties'], true) 
            : [];
        $profile['social_links'] = !empty($profile['social_links']) 
            ? json_decode($profile['social_links'], true) 
            : [];
        $profile['privacy_settings'] = !empty($profile['privacy_settings']) 
            ? json_decode($profile['privacy_settings'], true) 
            : [];

        // Get user role
        $user_data = get_userdata($profile['user_id']);
        $profile['role'] = !empty($user_data->roles) ? $user_data->roles[0] : 'subscriber';
        
        // Apply privacy settings
        $privacy = $profile['privacy_settings'];
        if (!empty($privacy)) {
            if (isset($privacy['show_email']) && !$privacy['show_email']) {
                $profile['user_email'] = null;
                $profile['custom_email'] = null;
            }
            if (isset($privacy['show_position']) && !$privacy['show_position']) {
                $profile['position'] = null;
            }
            if (isset($privacy['show_company']) && !$privacy['show_company']) {
                $profile['company'] = null;
            }
            if (isset($privacy['show_website']) && !$privacy['show_website']) {
                $profile['website'] = null;
            }
            if (isset($privacy['show_specialties']) && !$privacy['show_specialties']) {
                $profile['specialties'] = [];
            }
        }

        // Remove privacy_settings from response
        unset($profile['privacy_settings']);

        $profile['user_id'] = intval($profile['user_id']);
        $members[] = $profile;
    }

    return new WP_REST_Response($members, 200);
}

// ========================
// 🕐 7. UPDATE LAST ACTIVE
// ========================
function update_user_last_active($user_id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'user_profiles';
    
    // Check if profile exists
    $exists = $wpdb->get_var(
        $wpdb->prepare("SELECT id FROM $table_name WHERE user_id = %d", $user_id)
    );

    $current_time = current_time('mysql');

    if ($exists) {
        // Update last_active_at
        $wpdb->update(
            $table_name,
            ['last_active_at' => $current_time],
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
                'last_active_at' => $current_time,
                'created_at' => $current_time,
                'updated_at' => $current_time
            ],
            ['%d', '%s', '%s', '%s']
        );
    }
}

// Hook to update last active on login
add_action('wp_login', function($user_login, $user) {
    update_user_last_active($user->ID);
}, 10, 2);
