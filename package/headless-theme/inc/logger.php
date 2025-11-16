<?php

if (!defined('ABSPATH')) {
    exit;
}

define('BITEBUDDY_HUB_LOG_DIR', WP_CONTENT_DIR . '/logs');
define('BITEBUDDY_HUB_LOG_FILE', BITEBUDDY_HUB_LOG_DIR . '/hub.log');
define('BITEBUDDY_HUB_FAILURE_TRANSIENT', 'bitebuddy_hub_failure_counter');

function bitebuddy_hub_ensure_log_dir(): void {
    if (!file_exists(BITEBUDDY_HUB_LOG_DIR)) {
        wp_mkdir_p(BITEBUDDY_HUB_LOG_DIR);
    }
}

function bitebuddy_hub_log_file(string $level, string $message, array $context = array()): void {
    bitebuddy_hub_ensure_log_dir();

    $line = sprintf(
        "[%s] %s: %s %s%s",
        current_time('mysql'),
        strtoupper($level),
        $message,
        !empty($context) ? json_encode($context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : '',
        PHP_EOL
    );

    error_log($line, 3, BITEBUDDY_HUB_LOG_FILE);

    if ('error' === strtolower($level)) {
        bitebuddy_hub_register_failure($message);
    } else {
        bitebuddy_hub_reset_failure_counter();
    }
}

function bitebuddy_hub_register_failure(string $last_message): void {
    $count = (int) get_transient(BITEBUDDY_HUB_FAILURE_TRANSIENT);
    $count++;
    set_transient(BITEBUDDY_HUB_FAILURE_TRANSIENT, $count, MINUTE_IN_SECONDS * 30);

    if ($count >= 3) {
        bitebuddy_hub_notify_admin_failures($count, $last_message);
        bitebuddy_hub_reset_failure_counter();
    }
}

function bitebuddy_hub_reset_failure_counter(): void {
    delete_transient(BITEBUDDY_HUB_FAILURE_TRANSIENT);
}

function bitebuddy_hub_notify_admin_failures(int $count, string $last_message): void {
    $admin_email = get_option('admin_email');
    if (empty($admin_email)) {
        return;
    }

    $subject = sprintf('[BiteBuddy Hub] API failures detected (%d)', $count);
    $body = implode(
        "\n",
        array(
            '허브 API에서 연속적인 실패가 감지되었습니다.',
            sprintf('누적 횟수: %d', $count),
            sprintf('마지막 오류: %s', $last_message),
            'wp-content/logs/hub.log 파일을 확인하세요.',
        )
    );

    wp_mail($admin_email, $subject, $body);
}
