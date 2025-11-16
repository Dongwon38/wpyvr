<?php
/**
 * Plugin Name: BiteBuddy Connect
 * Plugin URI: https://example.com
 * Description: Push member site content to the BiteBuddy Hub with manual review controls.
 * Version: 0.2.0
 * Author: BiteBuddy Team
 * Text Domain: bitebuddy-connect
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

define('BITEBUDDY_CONNECT_VERSION', '0.2.0');
define('BITEBUDDY_CONNECT_OPTION_KEY', 'bitebuddy_connect_settings');
define('BITEBUDDY_CONNECT_DIR', plugin_dir_path(__FILE__));
define('BITEBUDDY_CONNECT_URL', plugin_dir_url(__FILE__));

register_activation_hook(__FILE__, 'bitebuddy_connect_activate');
function bitebuddy_connect_activate(): void {
    $defaults = bitebuddy_connect_default_settings();
    $stored = get_option(BITEBUDDY_CONNECT_OPTION_KEY, array());
    update_option(BITEBUDDY_CONNECT_OPTION_KEY, wp_parse_args($stored, $defaults));
}

add_action('plugins_loaded', 'bitebuddy_connect_load_textdomain');
function bitebuddy_connect_load_textdomain(): void {
    load_plugin_textdomain('bitebuddy-connect', false, dirname(plugin_basename(__FILE__)) . '/languages/');
}

function bitebuddy_connect_default_settings(): array {
    return array(
        'hub_api_url'   => '',
        'push_token'    => '',
        'origin_site'   => home_url(),
        'auto_push'     => 0,
        'last_push_log' => array(),
    );
}

require_once BITEBUDDY_CONNECT_DIR . 'inc/push-handler.php';
require_once BITEBUDDY_CONNECT_DIR . 'inc/admin-settings.php';

add_action('publish_post', 'bitebuddy_connect_publish_hook', 10, 2);
function bitebuddy_connect_publish_hook(int $post_id, WP_Post $post): void {
    if (wp_is_post_revision($post_id)) {
        return;
    }

    $settings = bitebuddy_connect_get_settings();
    if (empty($settings['auto_push'])) {
        return;
    }

    bitebuddy_connect_push_post($post_id);
}

add_action('admin_enqueue_scripts', 'bitebuddy_connect_admin_assets');
function bitebuddy_connect_admin_assets(string $hook): void {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    $is_plugin_page = $screen && 'toplevel_page_bitebuddy-connect' === $screen->id;

    if (!$is_plugin_page && 'toplevel_page_bitebuddy-connect' !== $hook) {
        return;
    }

    wp_enqueue_style(
        'bitebuddy-connect-admin',
        BITEBUDDY_CONNECT_URL . 'assets/admin.css',
        array(),
        BITEBUDDY_CONNECT_VERSION
    );
}
