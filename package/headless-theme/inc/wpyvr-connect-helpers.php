<?php

if (!defined('ABSPATH')) {
    exit;
}

function wpyvr_hub_get_pending_posts(): array {
    return get_posts(
        array(
            'post_type'      => 'post',
            'post_status'    => 'pending',
            'orderby'        => 'date',
            'order'          => 'DESC',
            'posts_per_page' => 50,
        )
    );
}

function wpyvr_hub_decode_meta_array(int $post_id, string $meta_key): array {
    $raw = get_post_meta($post_id, $meta_key, true);
    if (empty($raw)) {
        return array();
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : array();
}

function wpyvr_hub_get_raw_terms(int $post_id, string $type = 'category'): array {
    $meta_key = 'category' === $type ? 'hub_raw_categories' : 'hub_raw_tags';
    return wpyvr_hub_decode_meta_array($post_id, $meta_key);
}

function wpyvr_hub_similarity_score(string $a, string $b): float {
    similar_text(mb_strtolower($a), mb_strtolower($b), $percent);
    return (float) $percent;
}

function wpyvr_hub_suggest_terms(array $raw_terms, string $taxonomy): array {
    $results = array();
    if (empty($raw_terms)) {
        return $results;
    }

    $terms = get_terms(
        array(
            'taxonomy'   => $taxonomy,
            'hide_empty' => false,
        )
    );

    if (is_wp_error($terms) || empty($terms)) {
        return $results;
    }

    foreach ($raw_terms as $term_name) {
        $best = null;
        $best_score = 0;
        foreach ($terms as $term) {
            $score = wpyvr_hub_similarity_score($term_name, $term->name);
            if ($score > $best_score) {
                $best_score = $score;
                $best = $term;
            }
        }

        if ($best && $best_score >= 50) {
            $results[$term_name] = array(
                'id'    => $best->term_id,
                'name'  => $best->name,
                'score' => $best_score,
            );
        }
    }

    return $results;
}

function wpyvr_hub_get_source_site(int $post_id): string {
    return esc_url_raw(get_post_meta($post_id, 'hub_source_site', true)) ?: get_site_url();
}

function wpyvr_hub_store_term_mapping(string $source_site, string $taxonomy, string $source_term, int $hub_term_id): void {
    global $wpdb;
    $table = $wpdb->prefix . 'hub_term_map';
    if (empty($source_term) || !$hub_term_id || empty($source_site)) {
        return;
    }

    $wpdb->replace(
        $table,
        array(
            'source_site' => $source_site,
            'source_tax'  => 'category' === $taxonomy ? 'category' : 'tag',
            'source_term' => $source_term,
            'hub_term_id' => $hub_term_id,
        ),
        array('%s', '%s', '%s', '%d')
    );
}

function wpyvr_hub_get_mapped_term_id(string $source_site, string $taxonomy, string $source_term): int {
    global $wpdb;
    $table = $wpdb->prefix . 'hub_term_map';

    return (int) $wpdb->get_var(
        $wpdb->prepare(
            "SELECT hub_term_id FROM {$table} WHERE source_site = %s AND source_tax = %s AND source_term = %s LIMIT 1",
            $source_site,
            'category' === $taxonomy ? 'category' : 'tag',
            $source_term
        )
    );
}

function wpyvr_hub_map_terms(array $source_terms, string $taxonomy, string $source_site): array {
    $mapped_ids = array();
    foreach ($source_terms as $term_name) {
        $term_id = wpyvr_hub_get_mapped_term_id($source_site, $taxonomy, $term_name);
        if ($term_id) {
            $mapped_ids[] = $term_id;
        }
    }

    return array_unique(array_filter($mapped_ids));
}

function wpyvr_hub_reset_post_interactions(int $post_id): void {
    update_post_meta($post_id, '_hub_likes_count', 0);
    update_post_meta($post_id, '_hub_comments_count', get_comments_number($post_id));
    update_post_meta($post_id, '_hub_hot_score', 0);
}

function wpyvr_hub_get_term_options(string $taxonomy): array {
    $terms = get_terms(
        array(
            'taxonomy'   => $taxonomy,
            'hide_empty' => false,
        )
    );

    if (is_wp_error($terms)) {
        return array();
    }

    return $terms;
}

function wpyvr_hub_table_exists(string $table): bool {
    global $wpdb;
    static $cache = array();

    if (isset($cache[$table])) {
        return $cache[$table];
    }

    $cache[$table] = ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table);
    return $cache[$table];
}

function wpyvr_hub_log_event(array $args): void {
    global $wpdb;
    $table = $wpdb->prefix . 'hub_push_logs';
    $defaults = array(
        'post_id'     => null,
        'source_site' => '',
        'source_slug' => '',
        'status'      => 'pending',
        'message'     => '',
        'payload'     => array(),
    );
    $record = wp_parse_args($args, $defaults);

    if (wpyvr_hub_table_exists($table)) {
        $wpdb->insert(
            $table,
            array(
                'post_id'     => $record['post_id'],
                'source_site' => sanitize_text_field($record['source_site']),
                'source_slug' => sanitize_title($record['source_slug']),
                'status'      => sanitize_key($record['status']),
                'message'     => sanitize_text_field($record['message']),
                'payload'     => wp_json_encode($record['payload'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ),
            array('%d', '%s', '%s', '%s', '%s', '%s')
        );
    }

    if (function_exists('wpyvr_hub_log_file')) {
        wpyvr_hub_log_file(
            in_array($record['status'], array('failed', 'error'), true) ? 'error' : 'info',
            $record['message'] ?: 'hub_event',
            array(
                'post_id' => $record['post_id'],
                'site'    => $record['source_site'],
                'slug'    => $record['source_slug'],
                'status'  => $record['status'],
            )
        );
    }
}

function wpyvr_hub_get_profile_by_push_token(string $token): ?array {
    $token = trim($token);
    if ('' === $token) {
        return null;
    }

    global $wpdb;
    $table = $wpdb->prefix . 'user_profiles';

    if (!wpyvr_hub_table_exists($table)) {
        return null;
    }

    $row = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT user_id, firebase_uid FROM {$table} WHERE push_token = %s LIMIT 1",
            $token
        ),
        ARRAY_A
    );

    if (empty($row['user_id'])) {
        return null;
    }

    return array(
        'user_id'      => (int) $row['user_id'],
        'firebase_uid' => sanitize_text_field($row['firebase_uid'] ?? ''),
    );
}

function wpyvr_hub_mark_profile_connected(int $user_id): void {
    if ($user_id <= 0) {
        return;
    }

    global $wpdb;
    $table = $wpdb->prefix . 'user_profiles';

    if (!wpyvr_hub_table_exists($table)) {
        return;
    }

    $now = current_time('mysql');

    $wpdb->update(
        $table,
        array(
            'hub_connected' => 1,
            'last_push_at'  => $now,
            'updated_at'    => $now,
        ),
        array('user_id' => $user_id),
        array('%d', '%s', '%s'),
        array('%d')
    );
}

function wpyvr_hub_hash_ip($request = null): string {
    $ip = '';
    if ($request instanceof WP_REST_Request) {
        $ip = $request->get_client_ip();
    }

    if (empty($ip)) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }

    return hash('sha256', $ip . NONCE_KEY);
}
