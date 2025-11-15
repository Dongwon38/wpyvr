<?php
/**
 * Headless Theme Functions
 * Lightweight theme for REST API only
 */

if (!defined('ABSPATH')) exit;

// ------------------------------
// 🔹 1. 프론트엔드 렌더링 관련 기능 제거
// ------------------------------
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('template_redirect', 'redirect_canonical');

// RSS/Feed 완전 제거
add_action('do_feed', '__return_false', 1);
add_action('do_feed_rdf', '__return_false', 1);
add_action('do_feed_rss', '__return_false', 1);
add_action('do_feed_rss2', '__return_false', 1);
add_action('do_feed_atom', '__return_false', 1);

// ------------------------------
// 🔹 2. Gutenberg 및 블록 관련 CSS 제거
// ------------------------------
add_action('wp_enqueue_scripts', function() {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
}, 100);

// ------------------------------
// 🔹 3. REST API 활성화 (필요 시 CORS 설정)
// ------------------------------
add_action('rest_api_init', function() {
    // Custom endpoints 등 여기 추가 가능
});

add_action('init', function() {
    // CORS 허용 (React, Next.js 등에서 호출 가능)
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Authorization, Content-Type");
});

// ------------------------------
// 🔹 4. 관리자 툴바 및 에디터 CSS 제거
// ------------------------------
add_filter('show_admin_bar', '__return_false');

// TESTING

// Include custom authentication integration
require_once get_template_directory() . '/inc/custom-auth.php';

// Include custom profile management
require_once get_template_directory() . '/inc/custom-profile.php';

// Include custom post type registration
require_once get_template_directory() . '/inc/register-cpt.php';

// Include taxonomy registration
require_once get_template_directory() . '/inc/register-taxonomies.php';

// Include ACF fields registration
require_once get_template_directory() . '/inc/register-acf.php';

// Include contact form functionality
require_once get_template_directory() . '/inc/functions-contact.php';

// Include hub integration endpoints
require_once get_template_directory() . '/inc/hub-integration.php';