<?php 
/**
 * Register ACF fields
 * Aligned with Next.js frontend mock data structure
 */

if (!defined('ABSPATH')) exit;

// Configure ACF JSON save/load paths
add_filter('acf/settings/save_json', function($path) {
  return get_template_directory() . '/acf-json';
});

add_filter('acf/settings/load_json', function($paths) {
  unset($paths[0]);
  $paths[] = get_template_directory() . '/acf-json';
  return $paths;
});

/**
 * Register ACF Field Groups Programmatically
 */
add_action('acf/init', function() {

  // ========================
  // 1. HERO SLIDE FIELDS
  // ========================
  acf_add_local_field_group([
    'key' => 'group_hero_slide',
    'title' => 'Hero Slide Details',
    'fields' => [
      [
        'key' => 'field_hero_badge',
        'label' => 'Badge Text',
        'name' => 'badge',
        'type' => 'text',
        'instructions' => 'Small badge text shown above the title (e.g., "Join 10,000+ community members")',
        'required' => 1,
        'default_value' => '',
      ],
      [
        'key' => 'field_hero_title',
        'label' => 'Title',
        'name' => 'title',
        'type' => 'text',
        'instructions' => 'First part of the heading (e.g., "A place where")',
        'required' => 1,
      ],
      [
        'key' => 'field_hero_highlight',
        'label' => 'Highlight Text',
        'name' => 'highlight',
        'type' => 'text',
        'instructions' => 'Highlighted second part of heading (e.g., "ideas, tools, and people meet")',
        'required' => 1,
      ],
      [
        'key' => 'field_hero_description',
        'label' => 'Description',
        'name' => 'description',
        'type' => 'textarea',
        'instructions' => 'Supporting text below the heading',
        'required' => 1,
        'rows' => 3,
      ],
      [
        'key' => 'field_hero_primary_cta',
        'label' => 'Primary CTA',
        'name' => 'primary_cta',
        'type' => 'group',
        'layout' => 'block',
        'sub_fields' => [
          [
            'key' => 'field_primary_cta_text',
            'label' => 'Button Text',
            'name' => 'text',
            'type' => 'text',
            'default_value' => 'Read Guides',
          ],
          [
            'key' => 'field_primary_cta_href',
            'label' => 'Button Link',
            'name' => 'href',
            'type' => 'text',
            'default_value' => '/guides',
          ],
          [
            'key' => 'field_primary_cta_icon',
            'label' => 'Icon Name',
            'name' => 'icon',
            'type' => 'text',
            'instructions' => 'Lucide icon name (e.g., BookOpen, Users)',
            'default_value' => 'BookOpen',
          ],
        ],
      ],
      [
        'key' => 'field_hero_secondary_cta',
        'label' => 'Secondary CTA',
        'name' => 'secondary_cta',
        'type' => 'group',
        'layout' => 'block',
        'sub_fields' => [
          [
            'key' => 'field_secondary_cta_text',
            'label' => 'Button Text',
            'name' => 'text',
            'type' => 'text',
            'default_value' => 'Join Community',
          ],
          [
            'key' => 'field_secondary_cta_href',
            'label' => 'Button Link',
            'name' => 'href',
            'type' => 'text',
            'default_value' => '/community',
          ],
          [
            'key' => 'field_secondary_cta_icon',
            'label' => 'Icon Name',
            'name' => 'icon',
            'type' => 'text',
            'default_value' => 'Users',
          ],
        ],
      ],
      [
        'key' => 'field_hero_stats',
        'label' => 'Stats',
        'name' => 'stats',
        'type' => 'repeater',
        'instructions' => 'Add 3 statistics to display',
        'required' => 0,
        'min' => 3,
        'max' => 3,
        'layout' => 'table',
        'button_label' => 'Add Stat',
        'sub_fields' => [
          [
            'key' => 'field_stat_label',
            'label' => 'Label',
            'name' => 'label',
            'type' => 'text',
            'required' => 1,
          ],
          [
            'key' => 'field_stat_value',
            'label' => 'Value',
            'name' => 'value',
            'type' => 'text',
            'required' => 1,
          ],
        ],
      ],
    ],
    'location' => [
      [
        [
          'param' => 'post_type',
          'operator' => '==',
          'value' => 'hero_slide',
        ],
      ],
    ],
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
  ]);

  // ========================
  // 2. GUIDE FIELDS
  // ========================
  acf_add_local_field_group([
    'key' => 'group_guide',
    'title' => 'Guide Details',
    'fields' => [
      [
        'key' => 'field_guide_image',
        'label' => 'Featured Image URL',
        'name' => 'image',
        'type' => 'image',
        'instructions' => 'Upload or select a featured image',
        'return_format' => 'url',
        'preview_size' => 'medium',
      ],
    ],
    'location' => [
      [
        [
          'param' => 'post_type',
          'operator' => '==',
          'value' => 'guide',
        ],
      ],
    ],
    'menu_order' => 0,
  ]);

  // ========================
  // 3. COMMUNITY POST FIELDS
  // ========================
  acf_add_local_field_group([
    'key' => 'group_community_post',
    'title' => 'Community Post Details',
    'fields' => [
      [
        'key' => 'field_post_avatar',
        'label' => 'Author Avatar',
        'name' => 'avatar',
        'type' => 'text',
        'instructions' => 'Emoji or icon for author avatar (e.g., 👤, 🧑‍💻)',
        'default_value' => '👤',
      ],
      [
        'key' => 'field_post_upvotes',
        'label' => 'Upvotes',
        'name' => 'upvotes',
        'type' => 'number',
        'instructions' => 'Number of upvotes (also accessible via post meta)',
        'default_value' => 0,
        'min' => 0,
      ],
    ],
    'location' => [
      [
        [
          'param' => 'post_type',
          'operator' => '==',
          'value' => 'community_post',
        ],
      ],
    ],
    'menu_order' => 0,
  ]);

  // ========================
  // 4. EVENT FIELDS
  // ========================
  acf_add_local_field_group([
    'key' => 'group_event',
    'title' => 'Event Details',
    'fields' => [
      [
        'key' => 'field_event_date',
        'label' => 'Event Date',
        'name' => 'event_date',
        'type' => 'date_picker',
        'instructions' => 'Select the event date',
        'required' => 1,
        'display_format' => 'F j, Y',
        'return_format' => 'Y-m-d',
      ],
      [
        'key' => 'field_event_time',
        'label' => 'Event Time',
        'name' => 'time',
        'type' => 'text',
        'instructions' => 'Event time (e.g., "2:00 PM - 5:00 PM EST")',
        'required' => 1,
      ],
      [
        'key' => 'field_event_location',
        'label' => 'Location',
        'name' => 'location',
        'type' => 'text',
        'instructions' => 'Event location (e.g., "Online (Zoom)", "Community Center")',
        'required' => 1,
      ],
      [
        'key' => 'field_event_attendees',
        'label' => 'Attendees Count',
        'name' => 'attendees',
        'type' => 'number',
        'instructions' => 'Number of registered/attended participants',
        'default_value' => 0,
        'min' => 0,
      ],
      [
        'key' => 'field_event_image',
        'label' => 'Event Image',
        'name' => 'image',
        'type' => 'image',
        'instructions' => 'Event featured image',
        'return_format' => 'url',
        'preview_size' => 'medium',
      ],
    ],
    'location' => [
      [
        [
          'param' => 'post_type',
          'operator' => '==',
          'value' => 'event',
        ],
      ],
    ],
    'menu_order' => 0,
  ]);

  // ========================
  // 5. SITE OPTIONS (Footer, Social Links, etc.)
  // ========================
  if (function_exists('acf_add_options_page')) {
    acf_add_options_page([
      'page_title' => 'Site Settings',
      'menu_title' => 'Site Settings',
      'menu_slug' => 'site-settings',
      'capability' => 'edit_posts',
      'icon_url' => 'dashicons-admin-settings',
      'position' => 2,
      'redirect' => false,
    ]);

    acf_add_local_field_group([
      'key' => 'group_site_settings',
      'title' => 'Site Settings',
      'fields' => [
        [
          'key' => 'field_site_name',
          'label' => 'Site Name',
          'name' => 'site_name',
          'type' => 'text',
          'default_value' => 'Community Hub',
        ],
        [
          'key' => 'field_site_tagline',
          'label' => 'Site Tagline',
          'name' => 'site_tagline',
          'type' => 'textarea',
          'rows' => 2,
          'default_value' => 'A place where ideas, tools, and people meet. Join our community of creators and developers.',
        ],
        [
          'key' => 'field_social_links',
          'label' => 'Social Media Links',
          'name' => 'social_links',
          'type' => 'repeater',
          'layout' => 'table',
          'button_label' => 'Add Social Link',
          'sub_fields' => [
            [
              'key' => 'field_social_platform',
              'label' => 'Platform',
              'name' => 'platform',
              'type' => 'select',
              'choices' => [
                'github' => 'GitHub',
                'twitter' => 'Twitter',
                'linkedin' => 'LinkedIn',
                'email' => 'Email',
                'facebook' => 'Facebook',
                'instagram' => 'Instagram',
              ],
            ],
            [
              'key' => 'field_social_url',
              'label' => 'URL',
              'name' => 'url',
              'type' => 'url',
            ],
            [
              'key' => 'field_social_icon',
              'label' => 'Icon Name',
              'name' => 'icon',
              'type' => 'text',
              'instructions' => 'Lucide icon name (e.g., Github, Twitter, Linkedin, Mail)',
            ],
          ],
        ],
      ],
      'location' => [
        [
          [
            'param' => 'options_page',
            'operator' => '==',
            'value' => 'site-settings',
          ],
        ],
      ],
    ]);
  }
});

/**
 * Expose ACF fields to REST API
 */
add_filter('acf/rest_api/field_settings/show_in_rest', '__return_true');

/**
 * Automatically create ACF JSON directory if it doesn't exist
 */
add_action('acf/init', function() {
  $json_dir = get_template_directory() . '/acf-json';
  if (!file_exists($json_dir)) {
    wp_mkdir_p($json_dir);
  }
});
