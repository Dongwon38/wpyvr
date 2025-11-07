# 🚀 WordPress Backend Quick Reference

## 📊 Complete Data Structure Overview

### Custom Post Types (CPTs)

| CPT | Slug | REST Base | Menu Icon | Archive | Comments |
|-----|------|-----------|-----------|---------|----------|
| Hero Slides | `hero_slide` | `/hero-slides` | dashicons-slides | ❌ | ❌ |
| Guides | `guide` | `/guides` | dashicons-book-alt | ✅ | ❌ |
| Community Posts | `community_post` | `/community` | dashicons-groups | ✅ | ✅ |
| Events | `event` | `/events` | dashicons-calendar-alt | ✅ | ❌ |
| Site Sections | `site_section` | `/site-sections` | dashicons-layout | ❌ | ❌ |

---

### Taxonomies

| Taxonomy | CPT | Type | REST Base | Pre-populated Values |
|----------|-----|------|-----------|---------------------|
| Guide Categories | `guide` | Hierarchical | `/guide-categories` | Beginner, Plugins, Design, Tutorials |
| Community Tags | `community_post` | Flat | `/community-tags` | (User-generated) |
| Event Categories | `event` | Hierarchical | `/event-categories` | Workshop, Masterclass, Meetup, Webinar, Panel Discussion |
| Event Types | `event` | Flat | `/event-types` | upcoming, past |

---

### ACF Field Groups

#### 1. Hero Slide Fields

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| `badge` | Text | ✅ | Badge text above heading |
| `title` | Text | ✅ | First part of heading |
| `highlight` | Text | ✅ | Highlighted second part |
| `description` | Textarea | ✅ | Supporting text |
| `primary_cta` | Group | ✅ | Primary button (text, href, icon) |
| `secondary_cta` | Group | ✅ | Secondary button (text, href, icon) |
| `stats` | Repeater | ❌ | 3 statistics (label, value) |

#### 2. Guide Fields

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| `image` | Image | ❌ | Featured image URL |

*Also uses native WordPress fields: title, content, excerpt, author, featured_media*

#### 3. Community Post Fields

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| `avatar` | Text | ❌ | Emoji avatar (default: 👤) |
| `upvotes` | Number | ❌ | Upvote count (default: 0) |

*Also uses native WordPress fields: title, content, excerpt, author*

#### 4. Event Fields

| Field Name | Field Type | Required | Description |
|------------|------------|----------|-------------|
| `event_date` | Date Picker | ✅ | Event date (Y-m-d) |
| `time` | Text | ✅ | Event time string |
| `location` | Text | ✅ | Event location |
| `attendees` | Number | ❌ | Attendee count |
| `image` | Image | ❌ | Event image URL |

#### 5. Site Settings (Options Page)

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `site_name` | Text | Site name (default: Community Hub) |
| `site_tagline` | Textarea | Site description |
| `social_links` | Repeater | Social media links (platform, url, icon) |

---

## 🔗 REST API Quick Reference

### Hero Slides
```bash
# Get all slides (ordered)
GET /wp-json/wp/v2/hero-slides?orderby=menu_order&order=asc

# Get single slide
GET /wp-json/wp/v2/hero-slides/{id}
```

### Guides
```bash
# Get all guides
GET /wp-json/wp/v2/guides

# Get guides with embedded terms
GET /wp-json/wp/v2/guides?_embed

# Filter by category
GET /wp-json/wp/v2/guides?guide_category={id}

# Get by slug
GET /wp-json/wp/v2/guides?slug={slug}
```

### Community Posts
```bash
# Get all posts
GET /wp-json/wp/v2/community

# Get posts with embedded terms
GET /wp-json/wp/v2/community?_embed

# Sort by upvotes (descending)
GET /wp-json/wp/v2/community?orderby=meta_value_num&meta_key=upvotes&order=desc

# Filter by tag
GET /wp-json/wp/v2/community?community_tag={id}

# Get by slug
GET /wp-json/wp/v2/community?slug={slug}
```

### Events
```bash
# Get all events
GET /wp-json/wp/v2/events

# Get events with embedded terms
GET /wp-json/wp/v2/events?_embed

# Filter by type (upcoming/past)
GET /wp-json/wp/v2/events?event_type={id}

# Filter by category
GET /wp-json/wp/v2/events?event_category={id}

# Get by ID
GET /wp-json/wp/v2/events/{id}
```

### Taxonomies
```bash
# Guide categories
GET /wp-json/wp/v2/guide-categories

# Community tags
GET /wp-json/wp/v2/community-tags

# Event categories
GET /wp-json/wp/v2/event-categories

# Event types
GET /wp-json/wp/v2/event-types
```

### Site Settings
```bash
# Get all site settings
GET /wp-json/acf/v3/options/site-settings
```

---

## 📦 Frontend Type Definitions

```typescript
// types/wordpress.ts

export interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
    icon: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
    icon: string;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface Guide {
  slug: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  date: string;
  content?: string;
  image?: string;
}

export interface CommunityPost {
  slug: string;
  title: string;
  author: string;
  tags: string[];
  excerpt: string;
  upvotes: number;
  date: string;
  content?: string;
  avatar?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "upcoming" | "past";
  category: string;
  attendees?: number;
  image?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
}
```

---

## 🎯 Common Query Patterns

### Get Latest 3 Guides
```
/wp-json/wp/v2/guides?per_page=3&orderby=date&order=desc&_embed
```

### Get Trending Community Posts (by upvotes)
```
/wp-json/wp/v2/community?per_page=3&orderby=meta_value_num&meta_key=upvotes&order=desc&_embed
```

### Get Upcoming Events Only
```
/wp-json/wp/v2/events?event_type={upcoming_term_id}&_embed
```

### Get Guides by Category Slug
```typescript
// Step 1: Get category ID by slug
const catRes = await fetch('/wp-json/wp/v2/guide-categories?slug=beginner');
const cats = await catRes.json();
const categoryId = cats[0]?.id;

// Step 2: Query guides with that category
const guidesRes = await fetch(`/wp-json/wp/v2/guides?guide_category=${categoryId}`);
```

---

## 🔧 WordPress Admin Setup

### After Theme Activation

1. **Flush Permalinks**
   - Go to Settings → Permalinks
   - Click "Save Changes"

2. **Verify CPTs**
   - Check admin menu for: Hero Slides, Guides, Community Posts, Events

3. **Verify Taxonomies**
   - Each CPT should have its taxonomies in the sidebar
   - Default terms should be auto-created

4. **Verify ACF Fields**
   - Edit any post type
   - ACF field groups should appear

5. **Configure Site Settings**
   - Go to "Site Settings" in admin menu
   - Add site name, tagline, social links

---

## 📝 Content Creation Workflow

### Creating a Hero Slide

1. Go to **Hero Slides → Add New**
2. Fill in all required fields:
   - Badge text
   - Title & Highlight
   - Description
   - Both CTAs (text, link, icon)
   - 3 statistics
3. Set **Order** using the page attributes (0 = first)
4. Publish

### Creating a Guide

1. Go to **Guides → Add New**
2. Add title and content (full article)
3. Add excerpt (short description)
4. Select **Guide Category**
5. Upload **Featured Image** (optional)
6. Publish

### Creating a Community Post

1. Go to **Community Posts → Add New**
2. Add title and content
3. Add excerpt
4. Add **Community Tags** (create as needed)
5. Set avatar emoji (default: 👤)
6. Set initial upvotes (default: 0)
7. Publish

### Creating an Event

1. Go to **Events → Add New**
2. Add title and description (use excerpt field)
3. Fill in ACF fields:
   - Event date (date picker)
   - Time (text)
   - Location (text)
   - Attendees count
   - Event image (optional)
4. Select **Event Category** (Workshop, Meetup, etc.)
5. Select **Event Type** (upcoming or past)
6. Publish

---

## 🔐 Authentication Integration

Your theme already includes custom authentication:

- **Endpoint:** `/wp-json/custom-auth/v1/sync`
- **Method:** POST
- **Headers:** `Authorization: Bearer {firebase_token}`

And profile management:

- **Get Profile:** `/wp-json/custom-profile/v1/get?user_id={id}`
- **Update Profile:** `/wp-json/custom-profile/v1/update`

---

## 🎨 Customization Tips

### Adding New CPT Fields

1. Edit `/inc/register-acf.php`
2. Add field to appropriate `acf_add_local_field_group()`
3. Fields automatically appear in REST API

### Adding New Taxonomies

1. Edit `/inc/register-taxonomies.php`
2. Register new taxonomy with `register_taxonomy()`
3. Associate with CPT
4. Flush permalinks

### Modifying REST Response

Edit `/inc/register-cpt.php` and add custom REST fields:

```php
register_rest_field('your_cpt', 'custom_field', [
  'get_callback' => function($object) {
    return get_post_meta($object['id'], 'custom_meta', true);
  }
]);
```

---

## 📊 Database Tables

Your theme creates a custom table for user profiles:

```sql
wp_user_profiles
├── id (primary key)
├── user_id (foreign key to wp_users)
├── nickname
├── greeting
├── avatar_url
├── website
├── job_title
├── social_links (JSON)
├── last_seen_at
└── updated_at
```

Access via `/wp-json/custom-profile/v1/` endpoints.

---

## ✅ Production Checklist

- [ ] All CPTs registered and visible
- [ ] All taxonomies created with default terms
- [ ] ACF fields showing in admin
- [ ] Test data created for each CPT
- [ ] REST API endpoints responding
- [ ] ACF fields in REST responses
- [ ] CORS configured for frontend domain
- [ ] Permalinks flushed
- [ ] Site Settings configured
- [ ] Authentication endpoints tested

---

**Quick Start:** After activating theme, visit **Settings → Permalinks** and click Save. Then start creating content!
