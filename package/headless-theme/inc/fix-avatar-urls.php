<?php
/**
 * Fix corrupted avatar URLs in database
 * 
 * This script fixes avatar URLs that were corrupted by sanitize_text_field()
 * which decoded %2F to / in Firebase Storage URLs.
 * 
 * Run once: Add this to functions.php temporarily:
 * require_once get_template_directory() . '/inc/fix-avatar-urls.php';
 * add_action('init', 'fix_corrupted_avatar_urls_once');
 */

if (!defined('ABSPATH')) {
    exit;
}

function fix_corrupted_avatar_urls_once() {
    // Only run once - check if already fixed
    $fixed_flag = get_option('avatar_urls_fixed_20250108');
    if ($fixed_flag) {
        error_log("✅ Avatar URLs already fixed. Skipping.");
        return;
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'user_profiles';
    
    error_log("🔧 Starting avatar URL fix...");
    
    // Get all profiles with avatar URLs
    $profiles = $wpdb->get_results(
        "SELECT id, user_id, avatar_url FROM $table_name WHERE avatar_url IS NOT NULL AND avatar_url != ''",
        ARRAY_A
    );
    
    if (empty($profiles)) {
        error_log("⚠️ No profiles with avatar URLs found.");
        update_option('avatar_urls_fixed_20250108', true);
        return;
    }
    
    $fixed_count = 0;
    $already_ok_count = 0;
    
    foreach ($profiles as $profile) {
        $old_url = $profile['avatar_url'];
        
        // Check if URL is corrupted (missing %2F encoding)
        // Firebase URLs should have %2F in the path part
        if (strpos($old_url, 'firebasestorage') !== false && strpos($old_url, '%2F') === false) {
            // URL is likely corrupted - try to fix it
            
            // Pattern: /o/avatarsUSERIDfilename.png should be /o/avatars%2FUSERID%2Ffilename.png
            // Extract the part after /o/
            if (preg_match('/\/o\/([^?]+)/', $old_url, $matches)) {
                $path_part = $matches[1];
                
                // Check if it looks like: avatars{uid}{filename}
                if (preg_match('/^avatars([A-Za-z0-9]+)(avatar_\d+\.[a-z]+)/', $path_part, $path_matches)) {
                    $uid = $path_matches[1];
                    $filename = $path_matches[2];
                    
                    // Reconstruct the correct encoded path
                    $correct_path = 'avatars%2F' . $uid . '%2F' . $filename;
                    $fixed_url = str_replace('/o/' . $path_part, '/o/' . $correct_path, $old_url);
                    
                    // Update the database
                    $result = $wpdb->update(
                        $table_name,
                        ['avatar_url' => $fixed_url],
                        ['id' => $profile['id']],
                        ['%s'],
                        ['%d']
                    );
                    
                    if ($result !== false) {
                        $fixed_count++;
                        error_log("✅ Fixed avatar URL for user {$profile['user_id']}");
                        error_log("   Old: $old_url");
                        error_log("   New: $fixed_url");
                    } else {
                        error_log("❌ Failed to fix avatar URL for user {$profile['user_id']}: " . $wpdb->last_error);
                    }
                } else {
                    error_log("⚠️ Could not parse corrupted URL pattern for user {$profile['user_id']}: $old_url");
                }
            }
        } else {
            // URL looks OK
            $already_ok_count++;
        }
    }
    
    error_log("🎉 Avatar URL fix complete!");
    error_log("   Fixed: $fixed_count");
    error_log("   Already OK: $already_ok_count");
    error_log("   Total: " . count($profiles));
    
    // Mark as fixed
    update_option('avatar_urls_fixed_20250108', true);
}
