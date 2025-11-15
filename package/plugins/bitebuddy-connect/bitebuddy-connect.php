<?php
/**
 * Plugin Name: BiteBuddy Connect
 * Plugin URI: https://example.com
 * Description: Pushes published posts from member sites to the BiteBuddy Hub WordPress instance.
 * Version: 0.1.0
 * Author: BiteBuddy Team
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit;
}

const BITEBUDDY_CONNECT_OPTION_KEY = 'bitebuddy_connect_settings';

register_activation_hook(__FILE__, 'bitebuddy_connect_activate');
function bitebuddy_connect_activate(): void {
    if (!get_option(BITEBUDDY_CONNECT_OPTION_KEY)) {
        add_option(
            BITEBUDDY_CONNECT_OPTION_KEY,
            array(
                'hub_api_url'   => '',
                'push_token'    => '',
                'origin_site'   => home_url(),
                'last_push_log' => array(),
            )
        );
    }
}

add_action('admin_menu', 'bitebuddy_connect_register_menu');
function bitebuddy_connect_register_menu(): void {
    add_options_page(
        __('BiteBuddy Connect', 'bitebuddy-connect'),
        __('BiteBuddy Connect', 'bitebuddy-connect'),
        'manage_options',
        'bitebuddy-connect',
        'bitebuddy_connect_render_settings_page'
    );
}

add_action('admin_init', 'bitebuddy_connect_register_settings');
function bitebuddy_connect_register_settings(): void {
    register_setting(
        'bitebuddy_connect_settings_group',
        BITEBUDDY_CONNECT_OPTION_KEY,
        'bitebuddy_connect_sanitize_settings'
    );

    add_settings_section(
        'bitebuddy_connect_main',
        __('Hub Connection Settings', 'bitebuddy-connect'),
        '__return_false',
        'bitebuddy-connect'
    );

    add_settings_field(
        'hub_api_url',
        __('Hub API URL', 'bitebuddy-connect'),
        'bitebuddy_connect_render_field_hub_url',
        'bitebuddy-connect',
        'bitebuddy_connect_main'
    );

    add_settings_field(
        'push_token',
        __('Push Token', 'bitebuddy-connect'),
        'bitebuddy_connect_render_field_push_token',
        'bitebuddy-connect',
        'bitebuddy_connect_main'
    );

    add_settings_field(
        'origin_site',
        __('Origin Site URL', 'bitebuddy-connect'),
        'bitebuddy_connect_render_field_origin_site',
        'bitebuddy-connect',
        'bitebuddy_connect_main'
    );
}

function bitebuddy_connect_sanitize_settings(array $settings): array {
    return array(
        'hub_api_url'   => !empty($settings['hub_api_url']) ? esc_url_raw($settings['hub_api_url']) : '',
        'push_token'    => !empty($settings['push_token']) ? sanitize_text_field($settings['push_token']) : '',
        'origin_site'   => !empty($settings['origin_site']) ? esc_url_raw($settings['origin_site']) : home_url(),
        'last_push_log' => array(),
    );
}

function bitebuddy_connect_get_settings(): array {
    $defaults = array(
        'hub_api_url'   => '',
        'push_token'    => '',
        'origin_site'   => home_url(),
        'last_push_log' => array(),
    );

    $stored = get_option(BITEBUDDY_CONNECT_OPTION_KEY, array());
    return wp_parse_args($stored, $defaults);
}

function bitebuddy_connect_render_settings_page(): void {
    if (!current_user_can('manage_options')) {
        return;
    }

    $settings = bitebuddy_connect_get_settings();
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('BiteBuddy Connect', 'bitebuddy-connect'); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('bitebuddy_connect_settings_group');
            do_settings_sections('bitebuddy-connect');
            submit_button();
            ?>
        </form>
        <?php if (!empty($settings['last_push_log'])) : ?>
            <h2><?php esc_html_e('Last Push Result', 'bitebuddy-connect'); ?></h2>
            <pre><?php echo esc_html(wp_json_encode($settings['last_push_log'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)); ?></pre>
        <?php endif; ?>
    </div>
    <?php
}

function bitebuddy_connect_render_field_hub_url(): void {
    $settings = bitebuddy_connect_get_settings();
    ?>
    <input type="url" name="<?php echo esc_attr(BITEBUDDY_CONNECT_OPTION_KEY); ?>[hub_api_url]" value="<?php echo esc_attr($settings['hub_api_url']); ?>" class="regular-text" placeholder="https://hub.example.com/wp-json/hub/v1/receive-post" />
    <?php
}

function bitebuddy_connect_render_field_push_token(): void {
    $settings = bitebuddy_connect_get_settings();
    ?>
    <input type="text" name="<?php echo esc_attr(BITEBUDDY_CONNECT_OPTION_KEY); ?>[push_token]" value="<?php echo esc_attr($settings['push_token']); ?>" class="regular-text" placeholder="Firebase issued push token" />
    <?php
}

function bitebuddy_connect_render_field_origin_site(): void {
    $settings = bitebuddy_connect_get_settings();
    ?>
    <input type="url" name="<?php echo esc_attr(BITEBUDDY_CONNECT_OPTION_KEY); ?>[origin_site]" value="<?php echo esc_attr($settings['origin_site']); ?>" class="regular-text" placeholder="<?php echo esc_attr(home_url()); ?>" />
    <?php
}

add_action('transition_post_status', 'bitebuddy_connect_push_on_publish', 10, 3);
function bitebuddy_connect_push_on_publish(string $new_status, string $old_status, WP_Post $post): void {
    if ('publish' !== $new_status || 'publish' === $old_status) {
        return;
    }

    if ('post' !== $post->post_type) {
        return;
    }

    $settings = bitebuddy_connect_get_settings();
    if (empty($settings['hub_api_url']) || empty($settings['push_token'])) {
        return;
    }

    $payload = bitebuddy_connect_build_payload($post, $settings['origin_site']);
    $response = wp_remote_post(
        $settings['hub_api_url'],
        array(
            'headers' => array(
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . $settings['push_token'],
            ),
            'body'    => wp_json_encode($payload),
            'timeout' => 20,
        )
    );

    $log = array(
        'post_id'   => $post->ID,
        'timestamp' => current_time('mysql'),
    );

    if (is_wp_error($response)) {
        $log['status'] = 'error';
        $log['message'] = $response->get_error_message();
        update_post_meta($post->ID, '_bitebuddy_push_status', 'error');
        update_post_meta($post->ID, '_bitebuddy_push_message', $response->get_error_message());
    } else {
        $body = wp_remote_retrieve_body($response);
        $decoded = json_decode($body, true);
        $log['status'] = wp_remote_retrieve_response_code($response);
        $log['body'] = $decoded ?: $body;
        update_post_meta($post->ID, '_bitebuddy_push_status', 'success');
        update_post_meta($post->ID, '_bitebuddy_push_message', $body);
    }

    $settings['last_push_log'] = $log;
    update_option(BITEBUDDY_CONNECT_OPTION_KEY, $settings);
}

function bitebuddy_connect_build_payload(WP_Post $post, string $origin_site): array {
    $categories = wp_get_post_terms($post->ID, 'category', array('fields' => 'names'));
    $tags = wp_get_post_terms($post->ID, 'post_tag', array('fields' => 'names'));

    return array(
        'title'         => wp_strip_all_tags($post->post_title),
        'content'       => apply_filters('the_content', $post->post_content),
        'excerpt'       => wp_trim_words($post->post_excerpt ?: wp_strip_all_tags($post->post_content), 55),
        'slug'          => $post->post_name,
        'thumbnail_url' => get_the_post_thumbnail_url($post->ID, 'full'),
        'categories'    => $categories ?: array(),
        'tags'          => $tags ?: array(),
        'author_name'   => get_the_author_meta('display_name', $post->post_author),
        'origin_url'    => get_permalink($post),
        'origin_site'   => $origin_site,
        'pushed_at'     => current_time('mysql'),
    );
}
