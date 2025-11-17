<?php
/**
 * Plugin Name: WPYVR Connect
 * Plugin URI: https://example.com
 * Description: Push member site content to the WPYVR Hub with manual review controls.
 * Version: 0.2.0
 * Author: WPYVR Team
 * Text Domain: wpyvr-connect
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('WPYVR_CONNECT_VERSION', '0.2.0');
define('WPYVR_CONNECT_OPTION_KEY', 'wpyvr_connect_settings');
define('WPYVR_CONNECT_DIR', plugin_dir_path(__FILE__));
define('WPYVR_CONNECT_URL', plugin_dir_url(__FILE__));

register_activation_hook(__FILE__, 'wpyvr_connect_activate');
function wpyvr_connect_activate(): void {
    $defaults = wpyvr_connect_default_settings();
    $stored = get_option(WPYVR_CONNECT_OPTION_KEY, array());
    update_option(WPYVR_CONNECT_OPTION_KEY, wp_parse_args($stored, $defaults));
}

add_action('plugins_loaded', 'wpyvr_connect_load_textdomain');
function wpyvr_connect_load_textdomain(): void {
    load_plugin_textdomain('wpyvr-connect', false, dirname(plugin_basename(__FILE__)) . '/languages/');
}

function wpyvr_connect_default_settings(): array {
    return array(
        'hub_api_url'   => '',
        'push_token'    => '',
        'origin_site'   => home_url(),
        'auto_push'     => 0,
        'last_push_log' => array(),
    );
}

require_once WPYVR_CONNECT_DIR . 'inc/push-handler.php';
require_once WPYVR_CONNECT_DIR . 'inc/admin-settings.php';

add_action('publish_post', 'wpyvr_connect_publish_hook', 10, 2);
function wpyvr_connect_publish_hook(int $post_id, WP_Post $post): void {
    if (wp_is_post_revision($post_id)) {
        return;
    }

    $settings = wpyvr_connect_get_settings();
    if (empty($settings['auto_push'])) {
        return;
    }

    wpyvr_connect_push_post($post_id);
}

add_action('admin_enqueue_scripts', 'wpyvr_connect_admin_assets');
function wpyvr_connect_admin_assets(string $hook): void {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    $is_plugin_page = $screen && 'toplevel_page_wpyvr-connect' === $screen->id;

    if (!$is_plugin_page && 'toplevel_page_wpyvr-connect' !== $hook) {
        return;
    }

    wp_enqueue_style(
        'wpyvr-connect-admin',
        WPYVR_CONNECT_URL . 'assets/admin.css',
        array(),
        WPYVR_CONNECT_VERSION
    );
}
