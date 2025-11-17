-- WPYVR Hub Integration schema changes
START TRANSACTION;

ALTER TABLE `wp_user_profiles`
    ADD COLUMN `firebase_uid` VARCHAR(128) NULL UNIQUE AFTER `user_id`,
    ADD COLUMN `push_token` VARCHAR(255) NULL AFTER `firebase_uid`,
    ADD COLUMN `hub_connected` TINYINT(1) NOT NULL DEFAULT 0 AFTER `push_token`,
    ADD COLUMN `origin_site_url` VARCHAR(255) NULL AFTER `hub_connected`,
    ADD COLUMN `last_push_at` DATETIME NULL AFTER `origin_site_url`;

CREATE TABLE IF NOT EXISTS `wp_hub_term_map` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `source_site` VARCHAR(255) NOT NULL,
    `source_tax` ENUM('category','tag') NOT NULL,
    `source_term` VARCHAR(255) NOT NULL,
    `hub_term_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_map` (`source_site`, `source_tax`, `source_term`),
    KEY `idx_term` (`hub_term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_hub_likes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `ip_hash` CHAR(64) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_like_user` (`post_id`, `user_id`),
    UNIQUE KEY `unique_like_ip` (`post_id`, `ip_hash`),
    KEY `idx_post` (`post_id`, `created_at`),
    CONSTRAINT `fk_hub_likes_post` FOREIGN KEY (`post_id`) REFERENCES `wp_posts` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wp_hub_push_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NULL,
    `source_site` VARCHAR(255) NOT NULL,
    `source_slug` VARCHAR(255) NOT NULL,
    `status` ENUM('received','pending','published','failed') NOT NULL DEFAULT 'received',
    `message` TEXT NULL,
    `payload` LONGTEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_site_slug` (`source_site`, `source_slug`),
    KEY `idx_post_id` (`post_id`),
    CONSTRAINT `fk_hub_push_logs_post` FOREIGN KEY (`post_id`) REFERENCES `wp_posts` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
