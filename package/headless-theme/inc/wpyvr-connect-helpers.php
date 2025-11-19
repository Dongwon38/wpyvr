<?php

if (!defined('ABSPATH')) {
    exit;
}

function wpyvr_hub_get_pending_posts(): array {
    global $wpdb;
    $table = wpyvr_hub_get_incoming_table_name();

    if (!wpyvr_hub_table_exists($table)) {
        return array();
    }

    $results = $wpdb->get_results(
        "SELECT * FROM {$table}
         WHERE status IN ('pending','mapped')
         ORDER BY received_at DESC
         LIMIT 50",
        ARRAY_A
    );

    return $results ?: array();
}

function wpyvr_hub_get_incoming_post(int $incoming_id): ?array {
    global $wpdb;
    $table = wpyvr_hub_get_incoming_table_name();

    if ($incoming_id <= 0 || !wpyvr_hub_table_exists($table)) {
        return null;
    }

    $row = $wpdb->get_row(
        $wpdb->prepare("SELECT * FROM {$table} WHERE id = %d LIMIT 1", $incoming_id),
        ARRAY_A
    );

    return $row ?: null;
}

function wpyvr_hub_find_incoming_post(string $source_site, string $source_slug): ?array {
    global $wpdb;
    $table = wpyvr_hub_get_incoming_table_name();

    if (empty($source_site) || empty($source_slug) || !wpyvr_hub_table_exists($table)) {
        return null;
    }

    $row = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * FROM {$table}
             WHERE source_site = %s AND source_slug = %s AND status != %s
             ORDER BY id DESC
             LIMIT 1",
            $source_site,
            $source_slug,
            'published'
        ),
        ARRAY_A
    );

    return $row ?: null;
}

function wpyvr_hub_decode_json_column($value): array {
    if (empty($value)) {
        return array();
    }

    $decoded = json_decode($value, true);
    if (!is_array($decoded)) {
        return array();
    }

    return array_values(array_filter($decoded, static function ($item) {
        return '' !== trim((string) $item);
    }));
}

function wpyvr_hub_normalize_term_ids(array $ids): array {
    $normalized = array();
    foreach ($ids as $id) {
        $id = absint($id);
        if ($id > 0) {
            $normalized[] = $id;
        }
    }

    return array_values(array_unique($normalized));
}

function wpyvr_hub_save_incoming_post(array $payload, array $auth) {
    global $wpdb;

    wpyvr_hub_maybe_install_tables();
    $table = wpyvr_hub_get_incoming_table_name();

    if (!wpyvr_hub_table_exists($table)) {
        return new WP_Error('missing_table', __('Incoming posts table is not available.', 'wpyvr'), array('status' => 500));
    }

    $title = sanitize_text_field($payload['title'] ?? '');
    $content = wp_kses_post($payload['content'] ?? '');
    $slug = sanitize_title($payload['slug'] ?? $title);
    $excerpt_source = $payload['excerpt'] ?? wp_trim_words(wp_strip_all_tags($content), 55);
    $excerpt = wp_strip_all_tags($excerpt_source);
    $source_site = esc_url_raw($payload['source'] ?? ($payload['origin_site'] ?? ''));

    if (empty($title) || empty($content) || empty($slug)) {
        return new WP_Error('missing_fields', __('title, content, and slug are required.', 'wpyvr'), array('status' => 422));
    }

    $source_host = '';
    if (!empty($source_site)) {
        $parts = wp_parse_url($source_site);
        if (!empty($parts['host'])) {
            $source_host = strtolower($parts['host']);
            if (!empty($parts['port'])) {
                $source_host .= ':' . $parts['port'];
            }
        }
    }

    $categories = array();
    if (!empty($payload['categories']) && is_array($payload['categories'])) {
        $categories = array_map('sanitize_text_field', $payload['categories']);
    }

    $tags = array();
    if (!empty($payload['tags']) && is_array($payload['tags'])) {
        $tags = array_map('sanitize_text_field', $payload['tags']);
    }

    $data = array(
        'firebase_uid'           => sanitize_text_field($auth['firebase_uid'] ?? ''),
        'user_id'                => isset($auth['user_id']) ? (int) $auth['user_id'] : 0,
        'source_site'            => $source_site,
        'source_site_host'       => $source_host,
        'source_slug'            => $slug,
        'source_post_id'         => sanitize_text_field($payload['source_post_id'] ?? ''),
        'source_permalink'       => $source_site,
        'original_title'         => $title,
        'original_content'       => $content,
        'original_excerpt'       => $excerpt,
        'original_author'        => sanitize_text_field($payload['author'] ?? ''),
        'original_featured_image'=> esc_url_raw($payload['featured_image'] ?? ''),
        'original_categories'    => wp_json_encode($categories, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'original_tags'          => wp_json_encode($tags, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'status'                 => 'pending',
        'mapped_category_ids'    => wp_json_encode(array(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'mapped_tag_ids'         => wp_json_encode(array(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'editor_user_id'         => 0,
        'published_post_id'      => 0,
        'raw_payload'            => wp_json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    );

    $existing = wpyvr_hub_find_incoming_post($source_site, $slug);
    if ($existing) {
        $wpdb->update($table, $data, array('id' => (int) $existing['id']));
        return (int) $existing['id'];
    }

    $data['received_at'] = current_time('mysql');

    $result = $wpdb->insert($table, $data);
    if (false === $result) {
        return new WP_Error('db_insert_failed', __('Unable to store incoming post.', 'wpyvr'));
    }

    return (int) $wpdb->insert_id;
}

function wpyvr_hub_update_incoming_post(int $incoming_id, array $data): bool {
    global $wpdb;
    $table = wpyvr_hub_get_incoming_table_name();

    if ($incoming_id <= 0 || !wpyvr_hub_table_exists($table) || empty($data)) {
        return false;
    }

    $updated = $wpdb->update($table, $data, array('id' => $incoming_id));
    return false !== $updated;
}

function wpyvr_hub_assign_terms_to_post(int $post_id, array $category_ids, array $tag_ids): void {
    $category_ids = wpyvr_hub_normalize_term_ids($category_ids);
    $tag_ids = wpyvr_hub_normalize_term_ids($tag_ids);

    if (!empty($category_ids)) {
        wp_set_post_terms($post_id, $category_ids, 'category', false);
    }

    if (!empty($tag_ids)) {
        wp_set_post_terms($post_id, $tag_ids, 'post_tag', false);
    }
}

function wpyvr_hub_publish_incoming_post(array $incoming, array $category_ids = array(), array $tag_ids = array()) {
    $title = $incoming['original_title'] ?? '';
    $content = $incoming['original_content'] ?? '';

    if (empty($title) || empty($content)) {
        return new WP_Error('invalid_incoming', __('Incoming record is missing required fields.', 'wpyvr'), array('status' => 400));
    }

    $post_author = !empty($incoming['user_id']) ? (int) $incoming['user_id'] : (int) get_option('default_post_user', 0);
    $post_data = array(
        'post_type'    => 'post',
        'post_status'  => 'publish',
        'post_author'  => $post_author,
        'post_title'   => sanitize_text_field($title),
        'post_content' => $content,
        'post_excerpt' => wp_strip_all_tags($incoming['original_excerpt'] ?? ''),
        'post_name'    => sanitize_title($incoming['source_slug'] ?? $title),
    );

    $post_id = wp_insert_post($post_data, true);
    if (is_wp_error($post_id)) {
        return $post_id;
    }

    $raw_categories = wpyvr_hub_decode_json_column($incoming['original_categories'] ?? '');
    $raw_tags = wpyvr_hub_decode_json_column($incoming['original_tags'] ?? '');

    if (empty($category_ids)) {
        $category_ids = wpyvr_hub_map_terms($raw_categories, 'category', $incoming['source_site'] ?? '');
    }
    if (empty($tag_ids)) {
        $tag_ids = wpyvr_hub_map_terms($raw_tags, 'tag', $incoming['source_site'] ?? '');
    }

    wpyvr_hub_assign_terms_to_post($post_id, $category_ids, $tag_ids);
    wpyvr_hub_store_meta($post_id, $incoming);
    wpyvr_hub_reset_post_interactions($post_id);

    return $post_id;
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

    if (isset($cache[$table]) && true === $cache[$table]) {
        return true;
    }

    $exists = ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $table)) === $table);
    if ($exists) {
        $cache[$table] = true;
    }

    return $exists;
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
