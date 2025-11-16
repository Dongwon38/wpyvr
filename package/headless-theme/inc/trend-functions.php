<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'bitebuddy_hub_register_meta_fields');
function bitebuddy_hub_register_meta_fields(): void {
    $meta_fields = array(
        '_hub_likes_count'    => 'integer',
        '_hub_comments_count' => 'integer',
        '_hub_hot_score'      => 'number',
        'hub_source_site'     => 'string',
        'hub_source_author'   => 'string',
        'hub_featured_image_url' => 'string',
    );

    foreach ($meta_fields as $key => $type) {
        register_post_meta(
            'post',
            $key,
            array(
                'type'              => $type,
                'single'            => true,
                'default'           => 'integer' === $type ? 0 : '',
                'show_in_rest'      => true,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback'     => '__return_true',
            )
        );
    }
}

add_action('init', 'bitebuddy_hub_schedule_trend_cron');
function bitebuddy_hub_schedule_trend_cron(): void {
    if (!wp_next_scheduled('bitebuddy_hub_trend_event')) {
        wp_schedule_event(time(), 'hourly', 'bitebuddy_hub_trend_event');
    }
}

add_action('bitebuddy_hub_trend_event', 'bitebuddy_hub_run_trend_recalc');
function bitebuddy_hub_run_trend_recalc(): void {
    $posts = get_posts(
        array(
            'post_type'      => 'post',
            'post_status'    => 'publish',
            'posts_per_page' => 50,
            'orderby'        => 'date',
            'order'          => 'DESC',
        )
    );

    foreach ($posts as $post) {
        bitebuddy_hub_recalc_hot_score($post->ID);
    }
}

function bitebuddy_hub_recalc_hot_score(int $post_id): float {
    $likes = (int) get_post_meta($post_id, '_hub_likes_count', true);
    $comments = (int) get_post_meta($post_id, '_hub_comments_count', true);
    $post_time = get_post_time('U', true, $post_id);
    $age_hours = max(1, (time() - $post_time) / HOUR_IN_SECONDS);
    $fresh_bonus = max(0, 48 - $age_hours) * 0.2;

    $score = round($likes * 2 + $comments + $fresh_bonus, 4);
    update_post_meta($post_id, '_hub_hot_score', $score);

    return $score;
}

add_action('comment_post', 'bitebuddy_hub_update_comment_count', 20, 3);
add_action('transition_comment_status', 'bitebuddy_hub_update_comment_count_on_transition', 20, 3);
add_action('delete_comment', 'bitebuddy_hub_update_comment_count_on_delete', 20, 1);

function bitebuddy_hub_update_comment_count($comment_id, $comment_approved = null, $commentdata = null): void {
    $comment = get_comment($comment_id);
    if (!$comment) {
        return;
    }

    bitebuddy_hub_sync_comment_meta((int) $comment->comment_post_ID);
}

function bitebuddy_hub_update_comment_count_on_transition($new_status, $old_status, $comment): void {
    if ($new_status === $old_status) {
        return;
    }

    bitebuddy_hub_sync_comment_meta((int) $comment->comment_post_ID);
}

function bitebuddy_hub_update_comment_count_on_delete(int $comment_id): void {
    $comment = get_comment($comment_id);
    if ($comment) {
        bitebuddy_hub_sync_comment_meta((int) $comment->comment_post_ID);
    }
}

function bitebuddy_hub_sync_comment_meta(int $post_id): void {
    $count = get_comments_number($post_id);
    update_post_meta($post_id, '_hub_comments_count', $count);
    bitebuddy_hub_recalc_hot_score($post_id);
}

add_filter('preprocess_comment', 'bitebuddy_hub_attach_comment_user');
function bitebuddy_hub_attach_comment_user(array $commentdata): array {
    $token = $_POST['firebase_token'] ?? '';
    if (!$token && isset($_SERVER['HTTP_AUTHORIZATION']) && stripos($_SERVER['HTTP_AUTHORIZATION'], 'Bearer ') === 0) {
        $token = trim(substr($_SERVER['HTTP_AUTHORIZATION'], 7));
    }

    if (!$token) {
        return $commentdata;
    }

    $fake_request = new WP_REST_Request();
    $fake_request->set_header('authorization', 'Bearer ' . $token);
    $auth = bitebuddy_hub_validate_request_token($fake_request);

    if (is_wp_error($auth)) {
        return $commentdata;
    }

    $user = get_user_by('id', $auth['user_id']);
    if ($user) {
        $commentdata['user_ID'] = $user->ID;
        $commentdata['comment_author'] = $user->display_name;
        $commentdata['comment_author_email'] = $user->user_email;
    }

    return $commentdata;
}
