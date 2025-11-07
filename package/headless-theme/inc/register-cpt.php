<?php
/**
 * Register all custom post types
 */

if (!defined('ABSPATH')) exit;

function wpyvr_register_custom_post_types() {

  // Site Sections
  register_post_type('site_section', [
    'label' => 'Site Sections',
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-layout',
    'supports' => ['title', 'editor', 'thumbnail'],
  ]);

  // Guides
  register_post_type('guide', [
    'label' => 'Guides',
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-lightbulb',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'author'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'guides'],
  ]);

  // News
  register_post_type('news', [
    'label' => 'News',
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-megaphone',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'author'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'news'],
  ]);

  // Community
  register_post_type('community_post', [
    'label' => 'Community Posts',
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-groups',
    'supports' => ['title', 'editor', 'author', 'comments'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'community'],
  ]);

  // Events
  register_post_type('event', [
    'label' => 'Events',
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-calendar-alt',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
    'has_archive' => true,
    'rewrite' => ['slug' => 'events'],
  ]);
}
add_action('init', 'wpyvr_register_custom_post_types');
