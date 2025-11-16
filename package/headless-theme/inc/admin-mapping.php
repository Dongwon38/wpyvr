<?php

if (!defined('ABSPATH')) {
    exit;
}

add_action('admin_menu', 'bitebuddy_hub_register_incoming_menu');
function bitebuddy_hub_register_incoming_menu(): void {
    add_menu_page(
        __('Hub Dashboard', 'bitebuddy'),
        __('Hub', 'bitebuddy'),
        'manage_options',
        'bitebuddy-hub',
        'bitebuddy_hub_render_incoming_posts',
        'dashicons-networking',
        58
    );

    add_submenu_page(
        'bitebuddy-hub',
        __('Incoming Posts', 'bitebuddy'),
        __('Incoming Posts', 'bitebuddy'),
        'manage_options',
        'bitebuddy-hub',
        'bitebuddy_hub_render_incoming_posts'
    );
}

function bitebuddy_hub_render_incoming_posts(): void {
    if (!current_user_can('manage_options')) {
        wp_die(__('권한이 없습니다.', 'bitebuddy'));
    }

    $pending_posts = bitebuddy_hub_get_pending_posts();
    $category_terms = bitebuddy_hub_get_term_options('category');
    $tag_terms = bitebuddy_hub_get_term_options('post_tag');
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('허브 검수 대기 글', 'bitebuddy'); ?></h1>
        <p><?php esc_html_e('원본 사이트에서 전달된 글의 카테고리/태그를 허브 표준 분류에 맵핑한 뒤 퍼블리시하세요.', 'bitebuddy'); ?></p>
        <?php if (empty($pending_posts)) : ?>
            <div class="notice notice-success"><p><?php esc_html_e('현재 검수 대기 글이 없습니다.', 'bitebuddy'); ?></p></div>
        <?php else : ?>
            <?php foreach ($pending_posts as $post) : ?>
                <?php
                $raw_categories = bitebuddy_hub_get_raw_terms($post->ID, 'category');
                $raw_tags = bitebuddy_hub_get_raw_terms($post->ID, 'tag');
                $source_site = bitebuddy_hub_get_source_site($post->ID);
                $category_suggestions = bitebuddy_hub_suggest_terms($raw_categories, 'category');
                $tag_suggestions = bitebuddy_hub_suggest_terms($raw_tags, 'post_tag');
                ?>
                <div class="postbox">
                    <h2 class="hndle">
                        <?php echo esc_html(get_the_title($post)); ?>
                        <span class="dashicons dashicons-external"></span>
                        <small><?php echo esc_html($source_site); ?></small>
                    </h2>
                    <div class="inside">
                        <p><strong><?php esc_html_e('Raw Categories', 'bitebuddy'); ?>:</strong>
                            <?php echo $raw_categories ? esc_html(implode(', ', $raw_categories)) : esc_html__('(없음)', 'bitebuddy'); ?>
                        </p>
                        <p><strong><?php esc_html_e('Raw Tags', 'bitebuddy'); ?>:</strong>
                            <?php echo $raw_tags ? esc_html(implode(', ', $raw_tags)) : esc_html__('(없음)', 'bitebuddy'); ?>
                        </p>

                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <?php wp_nonce_field('bitebuddy_hub_map_' . $post->ID); ?>
                            <input type="hidden" name="action" value="bitebuddy_hub_map_terms" />
                            <input type="hidden" name="post_id" value="<?php echo esc_attr($post->ID); ?>" />

                            <?php bitebuddy_hub_render_mapping_table($post->ID, $raw_categories, $category_terms, $category_suggestions, 'category'); ?>
                            <?php bitebuddy_hub_render_mapping_table($post->ID, $raw_tags, $tag_terms, $tag_suggestions, 'post_tag'); ?>

                            <p>
                                <button type="submit" class="button button-primary"><?php esc_html_e('맵핑 저장', 'bitebuddy'); ?></button>
                                <button type="submit" name="publish_now" value="1" class="button button-secondary">
                                    <?php esc_html_e('Publish Now', 'bitebuddy'); ?>
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

function bitebuddy_hub_render_mapping_table(int $post_id, array $raw_terms, array $options, array $suggestions, string $taxonomy): void {
    $label = 'category' === $taxonomy ? __('카테고리 맵핑', 'bitebuddy') : __('태그 맵핑', 'bitebuddy');
    ?>
    <h3><?php echo esc_html($label); ?></h3>
    <?php if (empty($raw_terms)) : ?>
        <p><?php esc_html_e('원본에서 전달된 항목이 없습니다.', 'bitebuddy'); ?></p>
        <?php return; ?>
    <?php endif; ?>
    <table class="widefat striped">
        <thead>
            <tr>
                <th><?php esc_html_e('원본 값', 'bitebuddy'); ?></th>
                <th><?php esc_html_e('허브 분류 선택', 'bitebuddy'); ?></th>
                <th><?php esc_html_e('추천', 'bitebuddy'); ?></th>
                <th><?php esc_html_e('신규 생성', 'bitebuddy'); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($raw_terms as $raw_term) : ?>
                <?php
                $field_key = base64_encode($raw_term);
                $mapped_id = bitebuddy_hub_get_mapped_term_id(bitebuddy_hub_get_source_site($post_id), $taxonomy, $raw_term);
                $suggestion = $suggestions[$raw_term] ?? null;
                $selected = $mapped_id ?: ($suggestion['id'] ?? 0);
                ?>
                <tr>
                    <td><strong><?php echo esc_html($raw_term); ?></strong></td>
                    <td>
                        <select name="mapped_<?php echo esc_attr($taxonomy); ?>[<?php echo esc_attr($field_key); ?>]" class="regular-text">
                            <option value=""><?php esc_html_e('— 선택 —', 'bitebuddy'); ?></option>
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
                            esc_html_e('추천 없음', 'bitebuddy');
                        }
                        ?>
                    </td>
                    <td>
                        <input type="text" class="regular-text" name="new_<?php echo esc_attr($taxonomy); ?>[<?php echo esc_attr($field_key); ?>]" placeholder="<?php esc_attr_e('새 분류명', 'bitebuddy'); ?>" />
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <?php
}

add_action('admin_post_bitebuddy_hub_map_terms', 'bitebuddy_hub_handle_mapping_submission');
function bitebuddy_hub_handle_mapping_submission(): void {
    if (!current_user_can('manage_options')) {
        wp_die(__('권한이 없습니다.', 'bitebuddy'));
    }

    $post_id = isset($_POST['post_id']) ? absint($_POST['post_id']) : 0;
    if (!$post_id) {
        wp_die(__('포스트가 유효하지 않습니다.', 'bitebuddy'));
    }

    check_admin_referer('bitebuddy_hub_map_' . $post_id);

    $source_site = bitebuddy_hub_get_source_site($post_id);
    $mapped_categories = bitebuddy_hub_process_term_submission($source_site, 'category', $_POST['mapped_category'] ?? array(), $_POST['new_category'] ?? array());
    $mapped_tags = bitebuddy_hub_process_term_submission($source_site, 'tag', $_POST['mapped_post_tag'] ?? array(), $_POST['new_post_tag'] ?? array());

    if (!empty($mapped_categories)) {
        wp_set_post_terms($post_id, $mapped_categories, 'category', false);
    }

    if (!empty($mapped_tags)) {
        wp_set_post_terms($post_id, $mapped_tags, 'post_tag', false);
    }

    if (!empty($_POST['publish_now'])) {
        wp_update_post(
            array(
                'ID'          => $post_id,
                'post_status' => 'publish',
            )
        );
        bitebuddy_hub_reset_post_interactions($post_id);
    }

    bitebuddy_hub_log_event(
        array(
            'post_id'     => $post_id,
            'source_site' => $source_site,
            'status'      => empty($_POST['publish_now']) ? 'mapped' : 'published',
            'message'     => empty($_POST['publish_now']) ? 'Terms mapped' : 'Mapped and published',
        )
    );

    wp_safe_redirect(add_query_arg('updated', 'true', menu_page_url('bitebuddy-hub', false)));
    exit;
}

function bitebuddy_hub_process_term_submission(string $source_site, string $taxonomy, array $mapped, array $new_terms): array {
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
            bitebuddy_hub_store_term_mapping($source_site, $taxonomy, $raw_name, $term_id);
            $final_terms[] = $term_id;
        }
    }

    return array_unique(array_filter($final_terms));
}
