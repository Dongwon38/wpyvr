<?php
/**
 * Register all custom post types
 * Aligned with Next.js frontend mock data structure
 */

if (!defined('ABSPATH')) exit;

function wpyvr_register_custom_post_types() {

  // ========================
  // 1. HERO SLIDES
  // ========================
  register_post_type('hero_slide', [
    'labels' => [
      'name' => __('Hero Slides', 'headless-theme'),
      'singular_name' => __('Hero Slide', 'headless-theme'),
      'add_new' => __('Add New', 'headless-theme'),
      'add_new_item' => __('Add New Hero Slide', 'headless-theme'),
      'edit_item' => __('Edit Hero Slide', 'headless-theme'),
      'new_item' => __('New Hero Slide', 'headless-theme'),
      'view_item' => __('View Hero Slide', 'headless-theme'),
      'search_items' => __('Search Hero Slides', 'headless-theme'),
      'not_found' => __('No hero slides found', 'headless-theme'),
      'not_found_in_trash' => __('No hero slides found in Trash', 'headless-theme'),
      'all_items' => __('All Hero Slides', 'headless-theme'),
    ],
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'hero-slides',
    'menu_icon' => 'dashicons-slides',
    'menu_position' => 20,
    'supports' => ['title', 'editor', 'page-attributes'], // page-attributes for menu_order
    'capability_type' => 'post',
    'has_archive' => false,
    'hierarchical' => false,
    'show_in_menu' => true,
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
    'menu_icon' => 'dashicons-book-alt',
    'menu_position' => 21,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'author', 'revisions'],
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'rewrite' => ['slug' => 'guides', 'with_front' => false],
  ]);

  // ========================
  // 3. COMMUNITY POSTS
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
    'menu_position' => 22,
    'supports' => ['title', 'editor', 'author', 'comments', 'thumbnail', 'excerpt', 'revisions'],
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'rewrite' => ['slug' => 'community', 'with_front' => false],
    'show_in_nav_menus' => true,
  ]);

  // ========================
  // 4. EVENTS
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
    'menu_position' => 23,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
    'capability_type' => 'post',
    'has_archive' => true,
    'hierarchical' => false,
    'rewrite' => ['slug' => 'events', 'with_front' => false],
  ]);

  // ========================
  // 5. SITE SECTIONS (Keep existing)
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
    'menu_position' => 24,
    'supports' => ['title', 'editor', 'thumbnail'],
    'capability_type' => 'post',
    'has_archive' => false,
    'hierarchical' => false,
  ]);
}
add_action('init', 'wpyvr_register_custom_post_types');

/**
 * Add custom fields to REST API responses
 */
add_action('rest_api_init', function() {
  
  // Add ACF fields to guides
  register_rest_field('guide', 'acf', [
    'get_callback' => function($object) {
      return get_fields($object['id']);
    },
    'schema' => null,
  ]);

  // Add ACF fields to community posts
  register_rest_field('community_post', 'acf', [
    'get_callback' => function($object) {
      return get_fields($object['id']);
    },
    'schema' => null,
  ]);

  // Add ACF fields to events
  register_rest_field('event', 'acf', [
    'get_callback' => function($object) {
      return get_fields($object['id']);
    },
    'schema' => null,
  ]);

  // Add event categories to REST API
  register_rest_field('event', 'event_category', [
    'get_callback' => function($object) {
      $terms = get_the_terms($object['id'], 'event_category');
      return $terms ? array_map(function($term) {
        return $term->term_id;
      }, $terms) : [];
    },
    'schema' => null,
  ]);

  // Add event tags to REST API
  register_rest_field('event', 'event_tag', [
    'get_callback' => function($object) {
      $terms = get_the_terms($object['id'], 'event_tag');
      return $terms ? array_map(function($term) {
        return $term->term_id;
      }, $terms) : [];
    },
    'schema' => null,
  ]);

  // Add ACF fields to hero slides
  register_rest_field('hero_slide', 'acf', [
    'get_callback' => function($object) {
      return get_fields($object['id']);
    },
    'schema' => null,
  ]);

  // Add author details to guides
  register_rest_field('guide', 'author_name', [
    'get_callback' => function($object) {
      return get_the_author_meta('display_name', $object['author']);
    },
    'schema' => null,
  ]);

  // Add author details to community posts
  register_rest_field('community_post', 'author_name', [
    'get_callback' => function($object) {
      return get_the_author_meta('display_name', $object['author']);
    },
    'schema' => null,
  ]);

  // Add upvotes count to community posts
  register_rest_field('community_post', 'upvotes', [
    'get_callback' => function($object) {
      $upvotes = get_post_meta($object['id'], 'upvotes', true);
      return $upvotes ? intval($upvotes) : 0;
    },
    'update_callback' => function($value, $object) {
      return update_post_meta($object->ID, 'upvotes', intval($value));
    },
    'schema' => [
      'type' => 'integer',
      'context' => ['view', 'edit'],
    ],
  ]);
});
