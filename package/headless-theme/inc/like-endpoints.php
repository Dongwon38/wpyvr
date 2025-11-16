<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', 'bitebuddy_hub_register_like_routes');
function bitebuddy_hub_register_like_routes(): void {
    register_rest_route(
        'hub/v1',
        '/like',
        array(
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'bitebuddy_hub_like_post',
            'permission_callback' => '__return_true',
            'args'                => array(
                'post_id' => array(
                    'type'     => 'integer',
                    'required' => true,
                ),
            ),
        )
    );

    register_rest_route(
        'hub/v1',
        '/like',
        array(
            'methods'             => WP_REST_Server::DELETABLE,
            'callback'            => 'bitebuddy_hub_unlike_post',
            'permission_callback' => '__return_true',
            'args'                => array(
                'post_id' => array(
                    'type'     => 'integer',
                    'required' => true,
                ),
            ),
        )
    );

    register_rest_route(
        'hub/v1',
        '/posts/(?P<id>\d+)/stats',
        array(
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'bitebuddy_hub_get_post_stats',
            'permission_callback' => '__return_true',
        )
    );
}

function bitebuddy_hub_like_post(WP_REST_Request $request) {
    return bitebuddy_hub_persist_like($request, true);
}

function bitebuddy_hub_unlike_post(WP_REST_Request $request) {
    return bitebuddy_hub_persist_like($request, false);
}

function bitebuddy_hub_persist_like(WP_REST_Request $request, bool $is_like) {
    $post_id = (int) $request->get_param('post_id');
    $post = get_post($post_id);

    if (!$post || 'post' !== $post->post_type) {
        return new WP_Error('not_found', __('Post not found.', 'bitebuddy'), array('status' => 404));
    }

    $actor = bitebuddy_hub_identify_actor($request);
    if (is_wp_error($actor)) {
        return $actor;
    }

    global $wpdb;
    $table = $wpdb->prefix . 'hub_likes';

    if ($is_like) {
        $wpdb->replace(
            $table,
            array(
                'post_id'    => $post_id,
                'user_id'    => $actor['user_id'],
                'ip_hash'    => $actor['ip_hash'],
                'created_at' => current_time('mysql', 1),
            ),
            array('%d', '%d', '%s', '%s')
        );
    } else {
        $where = array('post_id' => $post_id);
        $format = array('%d');

        if ($actor['user_id']) {
            $where['user_id'] = $actor['user_id'];
            $format[] = '%d';
        } else {
            $where['ip_hash'] = $actor['ip_hash'];
            $format[] = '%s';
        }

        $wpdb->delete($table, $where, $format);
    }

    $count = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE post_id = %d", $post_id));
    update_post_meta($post_id, '_hub_likes_count', $count);

    $hot_score = bitebuddy_hub_recalc_hot_score($post_id);

    bitebuddy_hub_log_event(
        array(
            'post_id' => $post_id,
            'status'  => $is_like ? 'liked' : 'unliked',
            'message' => $is_like ? 'Like recorded' : 'Like removed',
        )
    );

    return new WP_REST_Response(
        array(
            'post_id'     => $post_id,
            'likes_count' => $count,
            'hot_score'   => $hot_score,
        ),
        200
    );
}

function bitebuddy_hub_identify_actor(WP_REST_Request $request) {
    $auth_header = $request->get_header('authorization');
    if (!empty($auth_header)) {
        $auth = bitebuddy_hub_validate_request_token($request);
        if (is_wp_error($auth)) {
            return $auth;
        }

        $user_id = (int) $auth['user_id'];
        return array(
            'user_id' => $user_id,
            'ip_hash' => null,
        );
    }

    return array(
        'user_id' => null,
        'ip_hash' => bitebuddy_hub_hash_ip($request),
    );
}

function bitebuddy_hub_get_post_stats(WP_REST_Request $request) {
    $post_id = (int) $request['id'];
    $post = get_post($post_id);

    if (!$post) {
        return new WP_Error('not_found', __('Post not found.', 'bitebuddy'), array('status' => 404));
    }

    $stats = array(
        'post_id'        => $post_id,
        'likes_count'    => (int) get_post_meta($post_id, '_hub_likes_count', true),
        'comments_count' => (int) get_post_meta($post_id, '_hub_comments_count', true),
        'hot_score'      => (float) get_post_meta($post_id, '_hub_hot_score', true),
    );

    return new WP_REST_Response($stats, 200);
}
