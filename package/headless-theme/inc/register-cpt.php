<?php
/**
 * Register all custom post types
 * Following WordPress coding standards and best practices
 */

if (!defined('ABSPATH')) exit;

function wpyvr_register_custom_post_types() {

  // ========================
  // 1. SITE SECTIONS
  // ========================
  register_post_type('site_section', [
    'labels' => [
      'name' => __('Site Sections', 'headless-theme'),
      'singular_name' => __('Site Section', 'headless-theme'),
      'add_new' => __('Add New', 'headless-theme'),
      'add_new_item' => __('Add New Site Section', 'headless-theme'),
      'edit_item' => __('Edit Site Section', 'headless-theme'),
      'new_item' => __('New Site Section', 'headless-theme'),
      'view_item' => __('View Site Section', 'headless-theme'),
      'search_items' => __('Search Site Sections', 'headless-theme'),
      'not_found' => __('No site sections found', 'headless-theme'),
      'not_found_in_trash' => __('No site sections found in Trash', 'headless-theme'),
    ],
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'site-sections',
    'menu_icon' => 'dashicons-layout',
    'menu_position' => 20,
    'supports' => ['title', 'editor', 'thumbnail'],
    'capability_type' => 'post',
    'has_archive' => false, // Usually sections are not archived
    'hierarchical' => false,
  ]);

  // ========================
  // 2. GUIDES
  // ========================
  register_post_type('guide', [
    'labels' => [
      'name' => __('Guides', 'headless-theme'),
      'singular_name' => __('Guide', 'headless-theme'),
      'add_new' => __('Add New', 'headless-theme'),
      'add_new_item' => __('Add New Guide', 'headless-theme'),
      'edit_item' => __('Edit Guide', 'headless-theme'),
      'new_item' => __('New Guide', 'headless-theme'),
      'view_item' => __('View Guide', 'headless-theme'),
      'search_items' => __('Search Guides', 'headless-theme'),
      'not_found' => __('No guides found', 'headless-theme'),
      'not_found_in_trash' => __('No guides found in Trash', 'headless-theme'),
      'all_items' => __('All Guides', 'headless-theme'),
    ],
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'guides',
    'menu_icon' => 'dashicons-lightbulb',
    'menu_position' => 21,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'author', 'revisions'],
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'rewrite' => ['slug' => 'guides', 'with_front' => false],
    'taxonomies' => ['category', 'post_tag'], // Enable built-in taxonomies if needed
  ]);

  // ========================
  // 3. NEWS
  // ========================
  register_post_type('news', [
    'labels' => [
      'name' => __('News', 'headless-theme'),
      'singular_name' => __('News Article', 'headless-theme'),
      'add_new' => __('Add New', 'headless-theme'),
      'add_new_item' => __('Add New News Article', 'headless-theme'),
      'edit_item' => __('Edit News Article', 'headless-theme'),
      'new_item' => __('New News Article', 'headless-theme'),
      'view_item' => __('View News Article', 'headless-theme'),
      'search_items' => __('Search News', 'headless-theme'),
      'not_found' => __('No news articles found', 'headless-theme'),
      'not_found_in_trash' => __('No news articles found in Trash', 'headless-theme'),
      'all_items' => __('All News', 'headless-theme'),
    ],
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'news',
    'menu_icon' => 'dashicons-megaphone',
    'menu_position' => 22,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'author', 'revisions'],
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'rewrite' => ['slug' => 'news', 'with_front' => false],
    'taxonomies' => ['category', 'post_tag'],
  ]);

  // ========================
  // 4. COMMUNITY POSTS
  // ========================
  register_post_type('community_post', [
    'labels' => [
      'name' => __('Community Posts', 'headless-theme'),
      'singular_name' => __('Community Post', 'headless-theme'),
      'add_new' => __('Add New', 'headless-theme'),
      'add_new_item' => __('Add New Community Post', 'headless-theme'),
      'edit_item' => __('Edit Community Post', 'headless-theme'),
      'new_item' => __('New Community Post', 'headless-theme'),
      'view_item' => __('View Community Post', 'headless-theme'),
      'search_items' => __('Search Community Posts', 'headless-theme'),
      'not_found' => __('No community posts found', 'headless-theme'),
      'not_found_in_trash' => __('No community posts found in Trash', 'headless-theme'),
      'all_items' => __('All Community Posts', 'headless-theme'),
    ],
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'community',
    'menu_icon' => 'dashicons-groups',
    'menu_position' => 23,
    'supports' => ['title', 'editor', 'author', 'comments', 'thumbnail', 'excerpt'],
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'rewrite' => ['slug' => 'community', 'with_front' => false],
    'show_in_nav_menus' => true,
  ]);

  // ========================
  // 5. EVENTS
  // ========================
  register_post_type('event', [
    'labels' => [
      'name' => __('Events', 'headless-theme'),
      'singular_name' => __('Event', 'headless-theme'),
      'add_new' => __('Add New', 'headless-theme'),
      'add_new_item' => __('Add New Event', 'headless-theme'),
      'edit_item' => __('Edit Event', 'headless-theme'),
      'new_item' => __('New Event', 'headless-theme'),
      'view_item' => __('View Event', 'headless-theme'),
      'search_items' => __('Search Events', 'headless-theme'),
      'not_found' => __('No events found', 'headless-theme'),
      'not_found_in_trash' => __('No events found in Trash', 'headless-theme'),
      'all_items' => __('All Events', 'headless-theme'),
    ],
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'events',
    'menu_icon' => 'dashicons-calendar-alt',
    'menu_position' => 24,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'rewrite' => ['slug' => 'events', 'with_front' => false],
  ]);
}
add_action('init', 'wpyvr_register_custom_post_types');
