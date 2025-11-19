<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'wpyvr_hub_register_incoming_menu');
function wpyvr_hub_register_incoming_menu(): void {
    add_menu_page(
        __('Hub Dashboard', 'wpyvr'),
        __('Hub', 'wpyvr'),
        'manage_options',
        'wpyvr-hub',
        'wpyvr_hub_render_incoming_posts',
        'dashicons-networking',
        58
    );

    add_submenu_page(
        'wpyvr-hub',
        __('Incoming Posts', 'wpyvr'),
        __('Incoming Posts', 'wpyvr'),
        'manage_options',
        'wpyvr-hub',
        'wpyvr_hub_render_incoming_posts'
    );
}

function wpyvr_hub_render_incoming_posts(): void {
    if (!current_user_can('manage_options')) {
        wp_die(__('권한이 없습니다.', 'wpyvr'));
    }

    $incoming_posts = wpyvr_hub_get_pending_posts();
    $category_terms = wpyvr_hub_get_term_options('category');
    $tag_terms = wpyvr_hub_get_term_options('post_tag');
    $error_param = isset($_GET['hub_error']) ? wp_unslash($_GET['hub_error']) : '';
    $notice_param = isset($_GET['hub_notice']) ? wp_unslash($_GET['hub_notice']) : '';
    $error_message = $error_param ? sanitize_text_field(rawurldecode($error_param)) : '';
    $notice_message = $notice_param ? sanitize_text_field(rawurldecode($notice_param)) : '';
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('허브 검수 대기 글', 'wpyvr'); ?></h1>
        <p><?php esc_html_e('원본 사이트에서 전달된 글의 카테고리/태그를 허브 표준 분류에 맵핑한 뒤 퍼블리시하세요.', 'wpyvr'); ?></p>
        <?php if (!empty($error_message)) : ?>
            <div class="notice notice-error"><p><?php echo esc_html($error_message); ?></p></div>
        <?php endif; ?>
        <?php if (!empty($notice_message)) : ?>
            <div class="notice notice-success"><p><?php echo esc_html($notice_message); ?></p></div>
        <?php endif; ?>
        <?php if (empty($incoming_posts)) : ?>
            <div class="notice notice-success"><p><?php esc_html_e('현재 검수 대기 글이 없습니다.', 'wpyvr'); ?></p></div>
        <?php else : ?>
            <?php foreach ($incoming_posts as $incoming) : ?>
                <?php
                $incoming_id = (int) ($incoming['id'] ?? 0);
                $raw_categories = wpyvr_hub_decode_json_column($incoming['original_categories'] ?? '');
                $raw_tags = wpyvr_hub_decode_json_column($incoming['original_tags'] ?? '');
                $source_site = esc_url($incoming['source_site'] ?? '');
                $category_suggestions = wpyvr_hub_suggest_terms($raw_categories, 'category');
                $tag_suggestions = wpyvr_hub_suggest_terms($raw_tags, 'post_tag');
                $excerpt = !empty($incoming['original_excerpt']) ? $incoming['original_excerpt'] : wp_trim_words(wp_strip_all_tags($incoming['original_content'] ?? ''), 40);
                ?>
                <div class="postbox" id="<?php echo esc_attr('incoming-' . $incoming_id); ?>">
                    <h2 class="hndle">
                        <?php echo esc_html($incoming['original_title'] ?? __('(untitled)', 'wpyvr')); ?>
                        <span class="dashicons dashicons-external"></span>
                        <small><?php echo esc_html($source_site); ?></small>
                    </h2>
                    <div class="inside">
                        <p><em><?php echo esc_html($excerpt); ?></em></p>
                        <p><strong><?php esc_html_e('Raw Categories', 'wpyvr'); ?>:</strong>
                            <?php echo !empty($raw_categories) ? esc_html(implode(', ', $raw_categories)) : esc_html__('(없음)', 'wpyvr'); ?>
                        </p>
                        <p><strong><?php esc_html_e('Raw Tags', 'wpyvr'); ?>:</strong>
                            <?php echo !empty($raw_tags) ? esc_html(implode(', ', $raw_tags)) : esc_html__('(없음)', 'wpyvr'); ?>
                        </p>

                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <?php wp_nonce_field('wpyvr_hub_map_' . $incoming_id); ?>
                            <input type="hidden" name="action" value="wpyvr_hub_map_terms" />
                            <input type="hidden" name="incoming_id" value="<?php echo esc_attr($incoming_id); ?>" />

                            <?php wpyvr_hub_render_mapping_table($incoming_id, $source_site, $raw_categories, $category_terms, $category_suggestions, 'category'); ?>
                            <?php wpyvr_hub_render_mapping_table($incoming_id, $source_site, $raw_tags, $tag_terms, $tag_suggestions, 'post_tag'); ?>

                            <p>
                                <button type="submit" class="button button-primary"><?php esc_html_e('맵핑 저장', 'wpyvr'); ?></button>
                                <button type="submit" name="publish_now" value="1" class="button button-secondary">
                                    <?php esc_html_e('Publish Now', 'wpyvr'); ?>
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    <?php
}

function wpyvr_hub_render_mapping_table(int $incoming_id, string $source_site, array $raw_terms, array $options, array $suggestions, string $taxonomy): void {
    $label = 'category' === $taxonomy ? __('카테고리 맵핑', 'wpyvr') : __('태그 맵핑', 'wpyvr');
    ?>
    <h3><?php echo esc_html($label); ?></h3>
    <?php if (empty($raw_terms)) : ?>
        <p><?php esc_html_e('원본에서 전달된 항목이 없습니다.', 'wpyvr'); ?></p>
        <?php return; ?>
    <?php endif; ?>
    <table class="widefat striped">
        <thead>
            <tr>
                <th><?php esc_html_e('원본 값', 'wpyvr'); ?></th>
                <th><?php esc_html_e('허브 분류 선택', 'wpyvr'); ?></th>
                <th><?php esc_html_e('추천', 'wpyvr'); ?></th>
                <th><?php esc_html_e('신규 생성', 'wpyvr'); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($raw_terms as $raw_term) : ?>
                <?php
                $field_key = base64_encode($raw_term);
                $mapped_id = wpyvr_hub_get_mapped_term_id($source_site, $taxonomy, $raw_term);
                $suggestion = $suggestions[$raw_term] ?? null;
                $selected = $mapped_id ?: ($suggestion['id'] ?? 0);
                ?>
                <tr>
                    <td><strong><?php echo esc_html($raw_term); ?></strong></td>
                    <td>
                        <select name="mapped_<?php echo esc_attr($taxonomy); ?>[<?php echo esc_attr($field_key); ?>]" class="regular-text">
                            <option value=""><?php esc_html_e('— 선택 —', 'wpyvr'); ?></option>
                            <?php foreach ($options as $term) : ?>
                                <option value="<?php echo esc_attr($term->term_id); ?>" <?php selected($selected, $term->term_id); ?>>
                                    <?php echo esc_html($term->name); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                    <td>
                        <?php
                        if ($suggestion) {
                            printf(
                                '<span class="dashicons dashicons-yes"></span> %1$s (%2$.0f%%)',
                                esc_html($suggestion['name']),
                                $suggestion['score']
                            );
                        } else {
                            esc_html_e('추천 없음', 'wpyvr');
                        }
                        ?>
                    </td>
                    <td>
                        <input type="text" class="regular-text" name="new_<?php echo esc_attr($taxonomy); ?>[<?php echo esc_attr($field_key); ?>]" placeholder="<?php esc_attr_e('새 분류명', 'wpyvr'); ?>" />
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <?php
}

add_action('admin_post_wpyvr_hub_map_terms', 'wpyvr_hub_handle_mapping_submission');
function wpyvr_hub_handle_mapping_submission(): void {
    if (!current_user_can('manage_options')) {
        wp_die(__('권한이 없습니다.', 'wpyvr'));
    }

    $incoming_id = isset($_POST['incoming_id']) ? absint($_POST['incoming_id']) : 0;
    if (!$incoming_id) {
        wp_die(__('Incoming 포스트가 유효하지 않습니다.', 'wpyvr'));
    }

    check_admin_referer('wpyvr_hub_map_' . $incoming_id);

    $incoming = wpyvr_hub_get_incoming_post($incoming_id);
    if (empty($incoming)) {
        wp_die(__('대상 레코드를 찾을 수 없습니다.', 'wpyvr'));
    }

    $source_site = $incoming['source_site'] ?? '';
    $mapped_categories = wpyvr_hub_process_term_submission($source_site, 'category', $_POST['mapped_category'] ?? array(), $_POST['new_category'] ?? array());
    $mapped_tags = wpyvr_hub_process_term_submission($source_site, 'tag', $_POST['mapped_post_tag'] ?? array(), $_POST['new_post_tag'] ?? array());

    $update_payload = array(
        'mapped_category_ids' => wp_json_encode($mapped_categories, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'mapped_tag_ids'      => wp_json_encode($mapped_tags, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    );

    $publish_now = !empty($_POST['publish_now']);
    if (!$publish_now) {
        $update_payload['status'] = 'mapped';
    }

    wpyvr_hub_update_incoming_post($incoming_id, $update_payload);

    if ($publish_now) {
        $post_id = wpyvr_hub_publish_incoming_post($incoming, $mapped_categories, $mapped_tags);
        if (is_wp_error($post_id)) {
            wp_safe_redirect(add_query_arg('hub_error', rawurlencode($post_id->get_error_message()), menu_page_url('wpyvr-hub', false)));
            exit;
        }

        wpyvr_hub_update_incoming_post(
            $incoming_id,
            array(
                'status'           => 'published',
                'published_post_id'=> $post_id,
                'published_at'     => current_time('mysql'),
                'editor_user_id'   => get_current_user_id(),
            )
        );

        wpyvr_hub_log_event(
            array(
                'post_id'     => $post_id,
                'source_site' => $source_site,
                'source_slug' => sanitize_title($incoming['source_slug'] ?? ''),
                'status'      => 'published',
                'message'     => 'Incoming post published',
            )
        );

        wp_safe_redirect(add_query_arg('hub_notice', rawurlencode(__('포스트가 발행되었습니다.', 'wpyvr')), menu_page_url('wpyvr-hub', false)));
        exit;
    }

    wpyvr_hub_log_event(
        array(
            'post_id'     => null,
            'source_site' => $source_site,
            'source_slug' => sanitize_title($incoming['source_slug'] ?? ''),
            'status'      => 'mapped',
            'message'     => 'Terms mapped for incoming post',
        )
    );

    wp_safe_redirect(add_query_arg('hub_notice', rawurlencode(__('맵핑이 저장되었습니다.', 'wpyvr')), menu_page_url('wpyvr-hub', false)));
    exit;
}

function wpyvr_hub_process_term_submission(string $source_site, string $taxonomy, array $mapped, array $new_terms): array {
    $final_terms = array();
    foreach ($mapped as $encoded => $term_id) {
        $raw_name = sanitize_text_field(base64_decode($encoded));
        $term_id = absint($term_id);
        $manual_label = isset($new_terms[$encoded]) ? sanitize_text_field($new_terms[$encoded]) : '';

        if (!$term_id && $manual_label) {
            $created = wp_insert_term($manual_label, 'category' === $taxonomy ? 'category' : 'post_tag');
            if (!is_wp_error($created)) {
                $term_id = (int) $created['term_id'];
            }
        }

        if ($term_id) {
            wpyvr_hub_store_term_mapping($source_site, $taxonomy, $raw_name, $term_id);
            $final_terms[] = $term_id;
        }
    }

    return array_unique(array_filter($final_terms));
}
