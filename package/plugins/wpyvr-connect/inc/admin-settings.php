<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'wpyvr_connect_register_admin_page');
function wpyvr_connect_register_admin_page(): void {
    add_menu_page(
        __('WPYVR Connect', 'wpyvr-connect'),
        __('WPYVR Connect', 'wpyvr-connect'),
        'manage_options',
        'wpyvr-connect',
        'wpyvr_connect_render_admin_page',
        'dashicons-share',
        82
    );
}

add_action('admin_init', 'wpyvr_connect_register_settings');
function wpyvr_connect_register_settings(): void {
    register_setting(
        'wpyvr_connect_settings_group',
        WPYVR_CONNECT_OPTION_KEY,
        'wpyvr_connect_sanitize_settings'
    );
}

function wpyvr_connect_sanitize_settings(array $settings): array {
    $current = wpyvr_connect_get_settings();

    $clean = array(
        'hub_api_url'   => !empty($settings['hub_api_url']) ? esc_url_raw($settings['hub_api_url']) : '',
        'push_token'    => !empty($settings['push_token']) ? sanitize_text_field($settings['push_token']) : '',
        'origin_site'   => !empty($settings['origin_site']) ? esc_url_raw($settings['origin_site']) : home_url(),
        'auto_push'     => !empty($settings['auto_push']) ? 1 : 0,
        'last_push_log' => $current['last_push_log'] ?? array(),
    );

    return wp_parse_args($clean, wpyvr_connect_default_settings());
}

function wpyvr_connect_render_admin_page(): void {
    if (!current_user_can('manage_options')) {
        return;
    }

    $settings = wpyvr_connect_get_settings();
    $posts = wpyvr_connect_get_pushable_posts();
    ?>
    <div class="wrap wpyvr-connect">
        <h1><?php esc_html_e('WPYVR Connect', 'wpyvr-connect'); ?></h1>
        <?php wpyvr_connect_display_notices(); ?>

        <div class="wpyvr-connect__grid">
            <div class="wpyvr-card">
                <h2><?php esc_html_e('Hub Connection Settings', 'wpyvr-connect'); ?></h2>
                <form method="post" action="options.php">
                    <?php
                    settings_fields('wpyvr_connect_settings_group');
                    ?>
                    <table class="form-table" role="presentation">
                        <tr>
                            <th scope="row">
                                <label for="wpyvr_hub_api_url"><?php esc_html_e('Hub API URL', 'wpyvr-connect'); ?></label>
                            </th>
                            <td>
                                <input type="url" id="wpyvr_hub_api_url" name="<?php echo esc_attr(WPYVR_CONNECT_OPTION_KEY); ?>[hub_api_url]" class="regular-text" value="<?php echo esc_attr($settings['hub_api_url']); ?>" placeholder="https://hub.example.com/wp-json/hub/v1/receive-post" required />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="wpyvr_push_token"><?php esc_html_e('Push Token', 'wpyvr-connect'); ?></label>
                            </th>
                            <td>
                                <input type="text" id="wpyvr_push_token" name="<?php echo esc_attr(WPYVR_CONNECT_OPTION_KEY); ?>[push_token]" class="regular-text" value="<?php echo esc_attr($settings['push_token']); ?>" placeholder="xxxx.yyyy.zzzz" required />
                                <p class="description">
                                    <?php
                                    printf(
                                        wp_kses(
                                            __('Generate a long-lived token from your Hub <a href="%s" target="_blank" rel="noopener noreferrer">profile page</a>.', 'wpyvr-connect'),
                                            array(
                                                'a' => array(
                                                    'href'   => array(),
                                                    'target' => array(),
                                                    'rel'    => array(),
                                                ),
                                            )
                                        ),
                                        esc_url('https://wpyvr.bitebuddy.ca/profile')
                                    );
                                    ?>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label for="wpyvr_origin_site"><?php esc_html_e('Origin Site URL', 'wpyvr-connect'); ?></label>
                            </th>
                            <td>
                                <input type="url" id="wpyvr_origin_site" name="<?php echo esc_attr(WPYVR_CONNECT_OPTION_KEY); ?>[origin_site]" class="regular-text" value="<?php echo esc_attr($settings['origin_site']); ?>" placeholder="<?php echo esc_attr(home_url()); ?>" required />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><?php esc_html_e('Automatic Push', 'wpyvr-connect'); ?></th>
                            <td>
                                <label>
                                    <input type="checkbox" name="<?php echo esc_attr(WPYVR_CONNECT_OPTION_KEY); ?>[auto_push]" value="1" <?php checked((bool) $settings['auto_push'], true); ?> />
                                    <?php esc_html_e('Automatically push posts to the Hub when they are published.', 'wpyvr-connect'); ?>
                                </label>
                            </td>
                        </tr>
                    </table>
                    <?php submit_button(__('Save Settings', 'wpyvr-connect')); ?>
                </form>
            </div>

            <div class="wpyvr-card">
                <h2><?php esc_html_e('Connection Test', 'wpyvr-connect'); ?></h2>
                <p><?php esc_html_e('Send a sample payload to the Hub to confirm credentials and connectivity.', 'wpyvr-connect'); ?></p>
                <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                    <?php wp_nonce_field('wpyvr_connect_test_connection'); ?>
                    <input type="hidden" name="action" value="wpyvr_connect_test_connection" />
                    <?php submit_button(__('Run Test', 'wpyvr-connect'), 'secondary'); ?>
                </form>
            </div>
        </div>

        <div class="wpyvr-card">
            <h2><?php esc_html_e('Content List & Manual Push', 'wpyvr-connect'); ?></h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="wpyvr-push-form">
                <?php wp_nonce_field('wpyvr_connect_manual_push'); ?>
                <input type="hidden" name="action" value="wpyvr_connect_manual_push" />
                <div class="table-scroll">
                    <table class="widefat fixed striped">
                        <thead>
                            <tr>
                                <th class="column-select"><?php esc_html_e('Select', 'wpyvr-connect'); ?></th>
                                <th><?php esc_html_e('Title', 'wpyvr-connect'); ?></th>
                                <th><?php esc_html_e('Type', 'wpyvr-connect'); ?></th>
                                <th><?php esc_html_e('Status', 'wpyvr-connect'); ?></th>
                                <th><?php esc_html_e('Last Modified', 'wpyvr-connect'); ?></th>
                                <th><?php esc_html_e('Push Status', 'wpyvr-connect'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($posts)) : ?>
                                <tr>
                                    <td colspan="6"><?php esc_html_e('No content available.', 'wpyvr-connect'); ?></td>
                                </tr>
                            <?php else : ?>
                                <?php
                                $first = true;
                                foreach ($posts as $post) :
                                    $last_push = get_post_meta($post->ID, '_wpyvr_last_push_log', true);
                                    $type_object = get_post_type_object($post->post_type);
                                    $status_object = get_post_status_object($post->post_status);
                                    $type_label = $type_object ? $type_object->labels->singular_name : $post->post_type;
                                    $status_label = $status_object ? $status_object->label : $post->post_status;
                                    ?>
                                    <tr>
                                        <td class="column-select">
                                            <input type="radio" name="post_id" value="<?php echo esc_attr($post->ID); ?>" <?php checked($first, true); ?> />
                                        </td>
                                        <td>
                                            <strong><?php echo esc_html(get_the_title($post)); ?></strong>
                                            <div class="row-actions">
                                                <a href="<?php echo esc_url(get_edit_post_link($post->ID)); ?>">
                                                    <?php esc_html_e('Edit', 'wpyvr-connect'); ?>
                                                </a>
                                            </div>
                                        </td>
                                        <td><?php echo esc_html($type_label); ?></td>
                                        <td><?php echo esc_html($status_label); ?></td>
                                        <td><?php echo esc_html(get_post_modified_time(get_option('date_format') . ' ' . get_option('time_format'), false, $post, true)); ?></td>
                                        <td>
                                            <?php
                                            if (!empty($last_push['status'])) {
                                                $push_state_label = 'success' === $last_push['status'] ? __('Success', 'wpyvr-connect') : __('Failed', 'wpyvr-connect');
                                                printf(
                                                    '<span class="status status-%1$s">%2$s</span>',
                                                    esc_attr($last_push['status']),
                                                    esc_html($push_state_label)
                                                );
                                            } else {
                                                esc_html_e('No logs yet', 'wpyvr-connect');
                                            }
                                            ?>
                                        </td>
                                    </tr>
                                    <?php
                                    $first = false;
                                endforeach;
                                ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
                <?php submit_button(__('Push Selected Content', 'wpyvr-connect'), 'primary', 'submit', false); ?>
            </form>
        </div>

        <div class="wpyvr-card">
            <h2><?php esc_html_e('Recent Push Log', 'wpyvr-connect'); ?></h2>
            <?php if (empty($settings['last_push_log'])) : ?>
                <p><?php esc_html_e('No push logs yet.', 'wpyvr-connect'); ?></p>
            <?php else : ?>
                <pre class="wpyvr-log"><?php echo esc_html(wp_json_encode($settings['last_push_log'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)); ?></pre>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

function wpyvr_connect_display_notices(): void {
    $notices = get_transient('wpyvr_connect_notices');
    if (empty($notices) || !is_array($notices)) {
        return;
    }

    delete_transient('wpyvr_connect_notices');

    foreach ($notices as $notice) {
        $class = 'notice';
        $class .= isset($notice['type']) && 'error' === $notice['type'] ? ' notice-error' : ' notice-success';
        printf(
            '<div class="%1$s"><p>%2$s</p></div>',
            esc_attr($class),
            esc_html($notice['message'])
        );
    }
}

function wpyvr_connect_queue_notice(string $message, string $type = 'success'): void {
    $notices = get_transient('wpyvr_connect_notices');
    if (!is_array($notices)) {
        $notices = array();
    }

    $notices[] = array(
        'message' => $message,
        'type'    => $type,
    );

    set_transient('wpyvr_connect_notices', $notices, 30);
}

add_action('admin_post_wpyvr_connect_manual_push', 'wpyvr_connect_handle_manual_push');
function wpyvr_connect_handle_manual_push(): void {
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have permission to access this page.', 'wpyvr-connect'));
    }

    check_admin_referer('wpyvr_connect_manual_push');

    $post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
    if (!$post_id) {
        wpyvr_connect_queue_notice(__('Please select content to push.', 'wpyvr-connect'), 'error');
        wp_safe_redirect(wpyvr_connect_get_admin_url());
        exit;
    }

    $result = wpyvr_connect_push_post($post_id);
    if (is_wp_error($result)) {
        wpyvr_connect_queue_notice(
            sprintf(
                __('Push failed: %s', 'wpyvr-connect'),
                $result->get_error_message()
            ),
            'error'
        );
    } else {
        wpyvr_connect_queue_notice(
            sprintf(
                __('Hub response code %d – push completed', 'wpyvr-connect'),
                (int) $result['code']
            ),
            'success'
        );
    }

    wp_safe_redirect(wpyvr_connect_get_admin_url());
    exit;
}

add_action('admin_post_wpyvr_connect_test_connection', 'wpyvr_connect_handle_test_connection');
function wpyvr_connect_handle_test_connection(): void {
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have permission to access this page.', 'wpyvr-connect'));
    }

    check_admin_referer('wpyvr_connect_test_connection');

    $settings = wpyvr_connect_get_settings();
    $current_user = wp_get_current_user();

    $payload = array(
        'title'          => 'WPYVR Connect Test',
        'content'        => '<p>Test payload from ' . esc_html(get_bloginfo('name')) . '</p>',
        'excerpt'        => 'Test payload to verify WPYVR Hub connectivity.',
        'slug'           => 'wpyvr-connect-test-' . time(),
        'featured_image' => '',
        'categories'     => array('Test'),
        'tags'           => array('Connection', 'Test'),
        'author'         => $current_user ? $current_user->display_name : 'System',
        'source'         => $settings['origin_site'] ?: home_url(),
        'test_mode'      => true,
    );

    $result = wpyvr_connect_send_payload($payload, $settings['hub_api_url'], $settings['push_token']);

    if (is_wp_error($result)) {
        wpyvr_connect_queue_notice(
            sprintf(__('Test failed: %s', 'wpyvr-connect'), $result->get_error_message()),
            'error'
        );
    } else {
        wpyvr_connect_queue_notice(
            sprintf(__('Test succeeded – response code %d', 'wpyvr-connect'), (int) $result['code']),
            'success'
        );
    }

    wp_safe_redirect(wpyvr_connect_get_admin_url());
    exit;
}
