<?php 
/**
 * Register ACF fields
 */

if (!defined('ABSPATH')) exit;

add_filter('acf/settings/save_json', function($path) {
    return get_template_directory() . '/acf-json';
  });
  
  add_filter('acf/settings/load_json', function($paths) {
    unset($paths[0]);
    $paths[] = get_template_directory() . '/acf-json';
    return $paths;
  });
  
