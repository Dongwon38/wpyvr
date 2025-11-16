<?php

if (!defined('ABSPATH')) {
    exit;
}

function wpyvr_connect_get_settings(): array {
    $defaults = wpyvr_connect_default_settings();
    $stored = get_option(WPYVR_CONNECT_OPTION_KEY, array());
    return wp_parse_args($stored, $defaults);
}

function wpyvr_connect_prepare_payload(WP_Post $post, array $settings): array {
    $content = apply_filters('the_content', $post->post_content);
    $excerpt_source = $post->post_excerpt ?: wp_strip_all_tags($post->post_content);

    $categories = wp_get_post_terms(
        $post->ID,
        'category',
        array('fields' => 'names')
    );

    $tags = wp_get_post_terms(
        $post->ID,
        'post_tag',
        array('fields' => 'names')
    );

    $featured = get_the_post_thumbnail_url($post->ID, 'full');
    $origin_site = !empty($settings['origin_site']) ? esc_url_raw($settings['origin_site']) : home_url();

    return array(
        'title'          => wp_strip_all_tags(get_the_title($post)),
        'content'        => $content,
        'excerpt'        => wp_trim_words($excerpt_source, 55, '...'),
        'slug'           => $post->post_name,
        'featured_image' => $featured ?: '',
        'categories'     => $categories ?: array(),
        'tags'           => $tags ?: array(),
        'author'         => get_the_author_meta('display_name', $post->post_author),
        'source'         => get_permalink($post) ?: $origin_site,
    );
}

function wpyvr_connect_send_payload(array $payload, string $endpoint, string $token) {
    if (empty($endpoint) || empty($token)) {
        return new WP_Error(
            'missing_settings',
            __('Hub API URL 또는 Push Token이 비어 있습니다.', 'wpyvr-connect')
        );
    }

    $response = wp_remote_post(
        $endpoint,
        array(
            'headers' => array(
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . $token,
            ),
            'body'    => wp_json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'timeout' => 20,
        )
    );

    if (is_wp_error($response)) {
        return $response;
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    $decoded = json_decode($body, true);

    return array(
        'code'     => (int) $code,
        'body'     => $decoded ?: $body,
        'raw_body' => $body,
        'headers'  => wp_remote_retrieve_headers($response),
    );
}

function wpyvr_connect_push_post(int $post_id) {
    $post = get_post($post_id);
    if (!$post instanceof WP_Post) {
        return new WP_Error('invalid_post', __('선택한 콘텐츠를 찾을 수 없습니다.', 'wpyvr-connect'));
    }

    $settings = wpyvr_connect_get_settings();
    $payload = wpyvr_connect_prepare_payload($post, $settings);
    $result = wpyvr_connect_send_payload($payload, $settings['hub_api_url'], $settings['push_token']);

    wpyvr_connect_store_push_log($post_id, $payload, $result);

    return $result;
}

function wpyvr_connect_store_push_log(int $post_id, array $payload, $result): void {
    $log = array(
        'post_id'   => $post_id,
        'title'     => get_the_title($post_id),
        'timestamp' => current_time('mysql'),
        'payload'   => $payload,
    );

    if (is_wp_error($result)) {
        $log['status'] = 'error';
        $log['message'] = $result->get_error_message();
        update_post_meta($post_id, '_wpyvr_last_push_status', 'error');
        update_post_meta($post_id, '_wpyvr_last_push_message', $result->get_error_message());
    } else {
        $log['status'] = 'success';
        $log['code'] = $result['code'];
        $log['response'] = $result['body'];
        update_post_meta($post_id, '_wpyvr_last_push_status', 'success');
        update_post_meta($post_id, '_wpyvr_last_push_message', $result['raw_body']);
    }

    update_post_meta($post_id, '_wpyvr_last_push_log', $log);

    $settings = wpyvr_connect_get_settings();
    $settings['last_push_log'] = $log;
    update_option(WPYVR_CONNECT_OPTION_KEY, $settings);
}

function wpyvr_connect_get_pushable_posts(): array {
    $posts = get_posts(
        array(
            'post_type'      => array('post', 'page'),
            'posts_per_page' => -1,
            'post_status'    => array('publish', 'draft', 'pending', 'future'),
            'orderby'        => 'date',
            'order'          => 'DESC',
        )
    );

    return $posts ?: array();
}

function wpyvr_connect_get_admin_url(): string {
    return admin_url('admin.php?page=wpyvr-connect');
}
