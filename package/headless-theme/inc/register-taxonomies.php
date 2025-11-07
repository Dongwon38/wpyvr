<?php
/**
 * Register all custom taxonomies
 * Aligned with Next.js frontend mock data structure
 */

if (!defined('ABSPATH')) exit;

function wpyvr_register_taxonomies() {

  // ========================
  // 1. GUIDE CATEGORIES
  // ========================
  register_taxonomy('guide_category', ['guide'], [
    'labels' => [
      'name' => __('Guide Categories', 'headless-theme'),
      'singular_name' => __('Guide Category', 'headless-theme'),
      'search_items' => __('Search Categories', 'headless-theme'),
      'all_items' => __('All Categories', 'headless-theme'),
      'parent_item' => __('Parent Category', 'headless-theme'),
      'parent_item_colon' => __('Parent Category:', 'headless-theme'),
      'edit_item' => __('Edit Category', 'headless-theme'),
      'update_item' => __('Update Category', 'headless-theme'),
      'add_new_item' => __('Add New Category', 'headless-theme'),
      'new_item_name' => __('New Category Name', 'headless-theme'),
      'menu_name' => __('Categories', 'headless-theme'),
    ],
    'hierarchical' => true, // Like categories
    'public' => true,
    'show_ui' => true,
    'show_in_rest' => true,
    'rest_base' => 'guide-categories',
    'show_admin_column' => true,
    'show_in_nav_menus' => true,
    'show_tagcloud' => false,
    'rewrite' => [
      'slug' => 'guide-category',
      'with_front' => false,
      'hierarchical' => true,
    ],
  ]);

  // ========================
  // 2. COMMUNITY POST TAGS
  // ========================
  register_taxonomy('community_tag', ['community_post'], [
    'labels' => [
      'name' => __('Community Tags', 'headless-theme'),
      'singular_name' => __('Community Tag', 'headless-theme'),
      'search_items' => __('Search Tags', 'headless-theme'),
      'popular_items' => __('Popular Tags', 'headless-theme'),
      'all_items' => __('All Tags', 'headless-theme'),
      'edit_item' => __('Edit Tag', 'headless-theme'),
      'update_item' => __('Update Tag', 'headless-theme'),
      'add_new_item' => __('Add New Tag', 'headless-theme'),
      'new_item_name' => __('New Tag Name', 'headless-theme'),
      'separate_items_with_commas' => __('Separate tags with commas', 'headless-theme'),
      'add_or_remove_items' => __('Add or remove tags', 'headless-theme'),
      'choose_from_most_used' => __('Choose from most used tags', 'headless-theme'),
      'menu_name' => __('Tags', 'headless-theme'),
    ],
    'hierarchical' => false, // Like tags
    'public' => true,
    'show_ui' => true,
    'show_in_rest' => true,
    'rest_base' => 'community-tags',
    'show_admin_column' => true,
    'show_in_nav_menus' => true,
    'show_tagcloud' => true,
    'rewrite' => [
      'slug' => 'tag',
      'with_front' => false,
    ],
  ]);

  // ========================
  // 3. EVENT CATEGORIES
  // ========================
  register_taxonomy('event_category', ['event'], [
    'labels' => [
      'name' => __('Event Categories', 'headless-theme'),
      'singular_name' => __('Event Category', 'headless-theme'),
      'search_items' => __('Search Categories', 'headless-theme'),
      'all_items' => __('All Categories', 'headless-theme'),
      'parent_item' => __('Parent Category', 'headless-theme'),
      'parent_item_colon' => __('Parent Category:', 'headless-theme'),
      'edit_item' => __('Edit Category', 'headless-theme'),
      'update_item' => __('Update Category', 'headless-theme'),
      'add_new_item' => __('Add New Category', 'headless-theme'),
      'new_item_name' => __('New Category Name', 'headless-theme'),
      'menu_name' => __('Categories', 'headless-theme'),
    ],
    'hierarchical' => true,
    'public' => true,
    'show_ui' => true,
    'show_in_rest' => true,
    'rest_base' => 'event-categories',
    'show_admin_column' => true,
    'show_in_nav_menus' => true,
    'show_tagcloud' => false,
    'rewrite' => [
      'slug' => 'event-category',
      'with_front' => false,
      'hierarchical' => true,
    ],
  ]);

  // ========================
  // 4. EVENT TYPE (upcoming/past)
  // ========================
  register_taxonomy('event_type', ['event'], [
    'labels' => [
      'name' => __('Event Types', 'headless-theme'),
      'singular_name' => __('Event Type', 'headless-theme'),
      'all_items' => __('All Types', 'headless-theme'),
      'edit_item' => __('Edit Type', 'headless-theme'),
      'update_item' => __('Update Type', 'headless-theme'),
      'add_new_item' => __('Add New Type', 'headless-theme'),
      'new_item_name' => __('New Type Name', 'headless-theme'),
      'menu_name' => __('Event Types', 'headless-theme'),
    ],
    'hierarchical' => false,
    'public' => true,
    'show_ui' => true,
    'show_in_rest' => true,
    'rest_base' => 'event-types',
    'show_admin_column' => true,
    'show_in_nav_menus' => false,
    'show_tagcloud' => false,
    'meta_box_cb' => 'post_categories_meta_box', // Radio select in admin
    'rewrite' => [
      'slug' => 'event-type',
      'with_front' => false,
    ],
  ]);
}
add_action('init', 'wpyvr_register_taxonomies');

/**
 * Pre-populate Event Types on theme activation
 */
function wpyvr_create_default_event_types() {
  // Only run if event_type taxonomy exists
  if (!taxonomy_exists('event_type')) {
    return;
  }

  $types = ['upcoming', 'past'];
  
  foreach ($types as $type) {
    if (!term_exists($type, 'event_type')) {
      wp_insert_term($type, 'event_type', [
        'slug' => $type,
      ]);
    }
  }
}
add_action('init', 'wpyvr_create_default_event_types', 20);

/**
 * Pre-populate Guide Categories based on mock data
 */
function wpyvr_create_default_guide_categories() {
  if (!taxonomy_exists('guide_category')) {
    return;
  }

  $categories = ['Beginner', 'Plugins', 'Design', 'Tutorials'];
  
  foreach ($categories as $category) {
    if (!term_exists($category, 'guide_category')) {
      wp_insert_term($category, 'guide_category', [
        'slug' => sanitize_title($category),
      ]);
    }
  }
}
add_action('init', 'wpyvr_create_default_guide_categories', 20);

/**
 * Pre-populate Event Categories based on mock data
 */
function wpyvr_create_default_event_categories() {
  if (!taxonomy_exists('event_category')) {
    return;
  }

  $categories = ['Workshop', 'Masterclass', 'Meetup', 'Webinar', 'Panel Discussion'];
  
  foreach ($categories as $category) {
    if (!term_exists($category, 'event_category')) {
      wp_insert_term($category, 'event_category', [
        'slug' => sanitize_title($category),
      ]);
    }
  }
}
add_action('init', 'wpyvr_create_default_event_categories', 20);
