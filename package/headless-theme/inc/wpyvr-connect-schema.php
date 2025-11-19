<?php

if (!defined('ABSPATH')) {
    exit;
}

function wpyvr_hub_get_incoming_table_name(): string {
    global $wpdb;
    return $wpdb->prefix . 'hub_incoming_posts';
}

function wpyvr_hub_install_tables(): void {
    global $wpdb;

    if (!function_exists('dbDelta')) {
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    }

    $charset_collate = $wpdb->get_charset_collate();
    $incoming_table = wpyvr_hub_get_incoming_table_name();

    $incoming_sql = "CREATE TABLE {$incoming_table} (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        firebase_uid VARCHAR(128) NOT NULL DEFAULT '',
        user_id BIGINT UNSIGNED NULL,
        source_site VARCHAR(255) NOT NULL DEFAULT '',
        source_site_host VARCHAR(191) NOT NULL DEFAULT '',
        source_slug VARCHAR(255) NOT NULL DEFAULT '',
        source_post_id VARCHAR(64) NULL,
        source_permalink TEXT NULL,
        original_title TEXT NOT NULL,
        original_content LONGTEXT NOT NULL,
        original_excerpt TEXT NULL,
        original_author VARCHAR(255) NULL,
        original_featured_image TEXT NULL,
        original_categories LONGTEXT NULL,
        original_tags LONGTEXT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        mapped_category_ids LONGTEXT NULL,
        mapped_tag_ids LONGTEXT NULL,
        editor_user_id BIGINT UNSIGNED NULL,
        published_post_id BIGINT UNSIGNED NULL,
        received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        published_at DATETIME NULL,
        raw_payload LONGTEXT NULL,
        PRIMARY KEY  (id),
        KEY idx_source_lookup (source_site, source_slug),
        KEY idx_status_received (status, received_at),
        KEY idx_published_post (published_post_id)
    ) {$charset_collate};";

    dbDelta($incoming_sql);
}

function wpyvr_hub_maybe_install_tables(): void {
    static $checked = false;
    if ($checked) {
        return;
    }
    $checked = true;

    global $wpdb;
    $incoming_table = wpyvr_hub_get_incoming_table_name();
    $table_exists = ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $incoming_table)) === $incoming_table);

    if (!$table_exists) {
        wpyvr_hub_install_tables();
    }
}

add_action('after_switch_theme', 'wpyvr_hub_install_tables');
add_action('init', 'wpyvr_hub_maybe_install_tables', 5);
