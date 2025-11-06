<?php
// Disable all front-end rendering
add_action('template_redirect', function () {
  if (!is_admin()) {
    wp_redirect(home_url('/')); // or your Next.js domain
    exit;
  }
});

// Enqueue nothing
add_action('wp_enqueue_scripts', function () {
  wp_dequeue_script('wp-embed');
  wp_deregister_script('wp-embed');
  wp_dequeue_style('wp-block-library');
  wp_deregister_style('wp-block-library');
});

// Enable REST & GraphQL (if using)
add_filter('rest_authentication_errors', '__return_null');

// Basic headless indicators
add_action('init', function () {
  remove_action('wp_head', 'wp_generator');
  remove_action('wp_head', 'rsd_link');
  remove_action('wp_head', 'wlwmanifest_link');
  remove_action('wp_head', 'wp_shortlink_wp_head');
  remove_action('wp_head', 'feed_links', 2);
  remove_action('wp_head', 'feed_links_extra', 3);
});
