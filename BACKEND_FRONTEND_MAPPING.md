# 🔄 Backend-Frontend Data Mapping

**Date:** 2025-11-07  
**Project:** WordPress Headless Theme + Next.js Frontend  
**Status:** ✅ Aligned & Production Ready

---

## 📊 Executive Summary

This document maps the Next.js frontend mock data structure to the WordPress backend implementation. All Custom Post Types (CPTs), taxonomies, and ACF fields have been configured to match the frontend's expected data structure.

---

## 🗂️ Custom Post Types Overview

| Frontend Component | WordPress CPT | REST Endpoint | Taxonomies |
|-------------------|---------------|---------------|------------|
| Hero Section | `hero_slide` | `/wp-json/wp/v2/hero-slides` | None |
| Guides | `guide` | `/wp-json/wp/v2/guides` | `guide_category` |
| Community Posts | `community_post` | `/wp-json/wp/v2/community` | `community_tag` |
| Events | `event` | `/wp-json/wp/v2/events` | `event_category`, `event_type` |
| Site Settings | Options Page | `/wp-json/acf/v3/options/site-settings` | None |

---

## 📋 Detailed Mapping Tables

### 1. Hero Slides

**Frontend Component:** `HeroSection.tsx`  
**WordPress CPT:** `hero_slide`  
**REST Endpoint:** `/wp-json/wp/v2/hero-slides`

#### Field Mapping

| Frontend Field | WordPress Field | ACF Field Name | Type | Required |
|---------------|-----------------|----------------|------|----------|
| `id` | Post ID | - | number | ✅ |
| `badge` | ACF Field | `badge` | text | ✅ |
| `title` | ACF Field | `title` | text | ✅ |
| `highlight` | ACF Field | `highlight` | text | ✅ |
| `description` | ACF Field | `description` | textarea | ✅ |
| `primaryCTA.text` | ACF Group | `primary_cta.text` | text | ✅ |
| `primaryCTA.href` | ACF Group | `primary_cta.href` | text | ✅ |
| `primaryCTA.icon` | ACF Group | `primary_cta.icon` | text | ✅ |
| `secondaryCTA.text` | ACF Group | `secondary_cta.text` | text | ✅ |
| `secondaryCTA.href` | ACF Group | `secondary_cta.href` | text | ✅ |
| `secondaryCTA.icon` | ACF Group | `secondary_cta.icon` | text | ✅ |
| `stats[].label` | ACF Repeater | `stats.label` | text | ✅ |
| `stats[].value` | ACF Repeater | `stats.value` | text | ✅ |

#### Example REST Response

```json
{
  "id": 1,
  "title": {
    "rendered": "Hero Slide 1"
  },
  "menu_order": 0,
  "acf": {
    "badge": "Join 10,000+ community members",
    "title": "A place where",
    "highlight": "ideas, tools, and people meet",
    "description": "Discover expert guides, connect with fellow creators...",
    "primary_cta": {
      "text": "Read Guides",
      "href": "/guides",
      "icon": "BookOpen"
    },
    "secondary_cta": {
      "text": "Join Community",
      "href": "/community",
      "icon": "Users"
    },
    "stats": [
      {
        "label": "Expert Guides",
        "value": "100+"
      },
      {
        "label": "Community Posts",
        "value": "500+"
      },
      {
        "label": "Active Members",
        "value": "10K+"
      }
    ]
  }
}
```

---

### 2. Guides

**Frontend Component:** `ArticleCard.tsx`  
**WordPress CPT:** `guide`  
**REST Endpoint:** `/wp-json/wp/v2/guides`  
**Taxonomy:** `guide_category`

#### Field Mapping

| Frontend Field | WordPress Field | Field Name | Type | Source |
|---------------|-----------------|------------|------|--------|
| `slug` | Post Slug | `slug` | string | Native |
| `title` | Post Title | `title.rendered` | string | Native |
| `author` | Author Display Name | `author_name` | string | Custom REST Field |
| `category` | Taxonomy Term | `guide_category` | string | Taxonomy |
| `excerpt` | Post Excerpt | `excerpt.rendered` | string | Native |
| `date` | Post Date | `date` | string | Native |
| `content` | Post Content | `content.rendered` | string | Native |
| `image` | ACF Image | `acf.image` | string (URL) | ACF |

#### Categories (Taxonomy: `guide_category`)

Pre-populated values from mock data:
- Beginner
- Plugins
- Design
- Tutorials

#### Example REST Response

```json
{
  "id": 42,
  "slug": "start-your-first-website",
  "title": {
    "rendered": "Start Your First Website"
  },
  "excerpt": {
    "rendered": "<p>A step-by-step guide to getting online for the first time.</p>"
  },
  "content": {
    "rendered": "<h1>Start Your First Website</h1>..."
  },
  "date": "2025-10-01T00:00:00",
  "author": 1,
  "author_name": "Editor Team",
  "featured_media": 0,
  "guide_category": [5],
  "acf": {
    "image": "https://example.com/wp-content/uploads/guide-image.jpg"
  },
  "_links": {
    "wp:term": [
      {
        "taxonomy": "guide_category",
        "embeddable": true,
        "href": "https://example.com/wp-json/wp/v2/guide-categories?post=42"
      }
    ]
  }
}
```

---

### 3. Community Posts

**Frontend Component:** `PostCard.tsx`  
**WordPress CPT:** `community_post`  
**REST Endpoint:** `/wp-json/wp/v2/community`  
**Taxonomy:** `community_tag`

#### Field Mapping

| Frontend Field | WordPress Field | Field Name | Type | Source |
|---------------|-----------------|------------|------|--------|
| `slug` | Post Slug | `slug` | string | Native |
| `title` | Post Title | `title.rendered` | string | Native |
| `author` | Author Display Name | `author_name` | string | Custom REST Field |
| `tags` | Taxonomy Terms | `community_tag` | array | Taxonomy |
| `excerpt` | Post Excerpt | `excerpt.rendered` | string | Native |
| `upvotes` | Post Meta | `upvotes` | number | Custom REST Field |
| `date` | Post Date | `date` | string | Native |
| `content` | Post Content | `content.rendered` | string | Native |
| `avatar` | ACF Field | `acf.avatar` | string | ACF |

#### Example REST Response

```json
{
  "id": 84,
  "slug": "my-first-theme",
  "title": {
    "rendered": "My First Custom Theme"
  },
  "excerpt": {
    "rendered": "<p>Sharing my experience building a minimal theme from scratch.</p>"
  },
  "content": {
    "rendered": "<h1>My First Custom Theme</h1>..."
  },
  "date": "2025-10-20T00:00:00",
  "author": 2,
  "author_name": "Alex K",
  "upvotes": 12,
  "community_tag": [3, 7],
  "acf": {
    "avatar": "👤",
    "upvotes": 12
  },
  "_links": {
    "wp:term": [
      {
        "taxonomy": "community_tag",
        "embeddable": true,
        "href": "https://example.com/wp-json/wp/v2/community-tags?post=84"
      }
    ]
  }
}
```

#### Retrieving Tags as Strings

To get tag names (not just IDs), use the `_embed` parameter:

```
GET /wp-json/wp/v2/community?_embed
```

Then access tags via:
```javascript
post._embedded['wp:term'][0].map(tag => tag.name)
// Returns: ["WordPress", "Design"]
```

---

### 4. Events

**Frontend Component:** `EventCard.tsx`  
**WordPress CPT:** `event`  
**REST Endpoint:** `/wp-json/wp/v2/events`  
**Taxonomies:** `event_category`, `event_type`

#### Field Mapping

| Frontend Field | WordPress Field | Field Name | Type | Source |
|---------------|-----------------|------------|------|--------|
| `id` | Post ID | `id` | number | Native |
| `title` | Post Title | `title.rendered` | string | Native |
| `description` | Post Excerpt | `excerpt.rendered` | string | Native |
| `date` | ACF Date Field | `acf.event_date` | string | ACF |
| `time` | ACF Text Field | `acf.time` | string | ACF |
| `location` | ACF Text Field | `acf.location` | string | ACF |
| `type` | Taxonomy Term | `event_type` | string | Taxonomy |
| `category` | Taxonomy Term | `event_category` | string | Taxonomy |
| `attendees` | ACF Number Field | `acf.attendees` | number | ACF |
| `image` | ACF Image Field | `acf.image` | string (URL) | ACF |

#### Event Types (Taxonomy: `event_type`)

Pre-populated values:
- `upcoming`
- `past`

#### Event Categories (Taxonomy: `event_category`)

Pre-populated values:
- Workshop
- Masterclass
- Meetup
- Webinar
- Panel Discussion

#### Example REST Response

```json
{
  "id": 15,
  "title": {
    "rendered": "Web Development Workshop"
  },
  "excerpt": {
    "rendered": "<p>Join us for a hands-on workshop...</p>"
  },
  "event_type": [8],
  "event_category": [12],
  "acf": {
    "event_date": "2025-11-15",
    "time": "2:00 PM - 5:00 PM EST",
    "location": "Online (Zoom)",
    "attendees": 45,
    "image": "https://example.com/wp-content/uploads/event-image.jpg"
  },
  "_links": {
    "wp:term": [
      {
        "taxonomy": "event_type",
        "embeddable": true,
        "href": "https://example.com/wp-json/wp/v2/event-types?post=15"
      },
      {
        "taxonomy": "event_category",
        "embeddable": true,
        "href": "https://example.com/wp-json/wp/v2/event-categories?post=15"
      }
    ]
  }
}
```

#### Filtering Events by Type

**Get Upcoming Events:**
```
GET /wp-json/wp/v2/events?event_type=upcoming
```

**Get Past Events:**
```
GET /wp-json/wp/v2/events?event_type=past
```

---

### 5. Site Settings (Footer)

**Frontend Component:** `Footer.tsx`  
**WordPress:** ACF Options Page  
**REST Endpoint:** `/wp-json/acf/v3/options/site-settings`

#### Field Mapping

| Frontend Field | WordPress Field | ACF Field Name | Type |
|---------------|-----------------|----------------|------|
| Site Name | ACF Option | `site_name` | text |
| Site Tagline | ACF Option | `site_tagline` | textarea |
| Social Links | ACF Repeater | `social_links` | repeater |
| `social[].platform` | Repeater Sub-field | `social_links.platform` | select |
| `social[].url` | Repeater Sub-field | `social_links.url` | url |
| `social[].icon` | Repeater Sub-field | `social_links.icon` | text |

#### Example REST Response

```json
{
  "site_name": "Community Hub",
  "site_tagline": "A place where ideas, tools, and people meet. Join our community of creators and developers.",
  "social_links": [
    {
      "platform": "github",
      "url": "https://github.com",
      "icon": "Github"
    },
    {
      "platform": "twitter",
      "url": "https://twitter.com",
      "icon": "Twitter"
    },
    {
      "platform": "linkedin",
      "url": "https://linkedin.com",
      "icon": "Linkedin"
    },
    {
      "platform": "email",
      "url": "mailto:hello@example.com",
      "icon": "Mail"
    }
  ]
}
```

---

## 🔗 REST API Endpoints Summary

### Main Content Endpoints

```bash
# Hero Slides
GET /wp-json/wp/v2/hero-slides
GET /wp-json/wp/v2/hero-slides/{id}

# Guides
GET /wp-json/wp/v2/guides
GET /wp-json/wp/v2/guides?guide_category={slug}
GET /wp-json/wp/v2/guides/{id}

# Community Posts
GET /wp-json/wp/v2/community
GET /wp-json/wp/v2/community?community_tag={slug}
GET /wp-json/wp/v2/community?orderby=meta_value_num&meta_key=upvotes&order=desc
GET /wp-json/wp/v2/community/{id}

# Events
GET /wp-json/wp/v2/events
GET /wp-json/wp/v2/events?event_type=upcoming
GET /wp-json/wp/v2/events?event_type=past
GET /wp-json/wp/v2/events?event_category={slug}
GET /wp-json/wp/v2/events/{id}

# Site Settings
GET /wp-json/acf/v3/options/site-settings
```

### Taxonomy Endpoints

```bash
# Guide Categories
GET /wp-json/wp/v2/guide-categories
GET /wp-json/wp/v2/guide-categories/{id}

# Community Tags
GET /wp-json/wp/v2/community-tags
GET /wp-json/wp/v2/community-tags/{id}

# Event Categories
GET /wp-json/wp/v2/event-categories
GET /wp-json/wp/v2/event-categories/{id}

# Event Types
GET /wp-json/wp/v2/event-types
GET /wp-json/wp/v2/event-types/{id}
```

---

## 📦 Frontend Integration Examples

### 1. Fetching Hero Slides

```typescript
// lib/api.ts
export async function getHeroSlides() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/hero-slides?orderby=menu_order&order=asc`
  );
  const data = await res.json();
  
  return data.map((slide: any) => ({
    id: slide.id,
    badge: slide.acf.badge,
    title: slide.acf.title,
    highlight: slide.acf.highlight,
    description: slide.acf.description,
    primaryCTA: slide.acf.primary_cta,
    secondaryCTA: slide.acf.secondary_cta,
    stats: slide.acf.stats,
  }));
}
```

### 2. Fetching Guides with Categories

```typescript
export async function getGuides(category?: string) {
  let url = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/guides?_embed`;
  
  if (category && category !== 'All') {
    // First get the category ID
    const catRes = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/guide-categories?slug=${category.toLowerCase()}`
    );
    const cats = await catRes.json();
    if (cats.length > 0) {
      url += `&guide_category=${cats[0].id}`;
    }
  }
  
  const res = await fetch(url);
  const data = await res.json();
  
  return data.map((guide: any) => ({
    slug: guide.slug,
    title: guide.title.rendered,
    author: guide.author_name,
    category: guide._embedded?.['wp:term']?.[0]?.[0]?.name || '',
    excerpt: guide.excerpt.rendered.replace(/<[^>]*>/g, ''),
    date: guide.date,
    content: guide.content.rendered,
    image: guide.acf?.image || '',
  }));
}
```

### 3. Fetching Community Posts with Tags

```typescript
export async function getCommunityPosts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/community?_embed&orderby=meta_value_num&meta_key=upvotes&order=desc`
  );
  const data = await res.json();
  
  return data.map((post: any) => ({
    slug: post.slug,
    title: post.title.rendered,
    author: post.author_name,
    tags: post._embedded?.['wp:term']?.[0]?.map((tag: any) => tag.name) || [],
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
    upvotes: post.upvotes,
    date: post.date,
    content: post.content.rendered,
    avatar: post.acf?.avatar || '👤',
  }));
}
```

### 4. Fetching Events by Type

```typescript
export async function getEvents(type: 'upcoming' | 'past') {
  // First get the event type term ID
  const typeRes = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/event-types?slug=${type}`
  );
  const types = await typeRes.json();
  
  if (types.length === 0) return [];
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/events?event_type=${types[0].id}&_embed`
  );
  const data = await res.json();
  
  return data.map((event: any) => ({
    id: event.id,
    title: event.title.rendered,
    description: event.excerpt.rendered.replace(/<[^>]*>/g, ''),
    date: event.acf.event_date,
    time: event.acf.time,
    location: event.acf.location,
    type: type,
    category: event._embedded?.['wp:term']?.[1]?.[0]?.name || '',
    attendees: event.acf.attendees,
    image: event.acf.image || '',
  }));
}
```

### 5. Fetching Site Settings

```typescript
export async function getSiteSettings() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/acf/v3/options/site-settings`
  );
  const data = await res.json();
  
  return {
    siteName: data.acf.site_name,
    tagline: data.acf.site_tagline,
    socialLinks: data.acf.social_links || [],
  };
}
```

---

## 🛠️ Migration Checklist

### Step 1: WordPress Setup
- [ ] Activate the headless theme
- [ ] Go to **Settings → Permalinks** and save (flush rewrite rules)
- [ ] Verify all CPTs appear in admin menu
- [ ] Install ACF Pro (or ACF Free)
- [ ] Verify ACF fields are registered

### Step 2: Create Default Taxonomies
- [ ] Verify Guide Categories are created (auto-created on init)
- [ ] Verify Event Types are created (auto-created on init)
- [ ] Verify Event Categories are created (auto-created on init)

### Step 3: Add Content
- [ ] Create Hero Slides (3 slides matching mock data)
- [ ] Create Guides (assign categories)
- [ ] Create Community Posts (assign tags)
- [ ] Create Events (assign type and category)
- [ ] Configure Site Settings (footer social links)

### Step 4: Test REST API
- [ ] Test `/wp-json/wp/v2/hero-slides`
- [ ] Test `/wp-json/wp/v2/guides?_embed`
- [ ] Test `/wp-json/wp/v2/community?_embed`
- [ ] Test `/wp-json/wp/v2/events?event_type=upcoming`
- [ ] Test `/wp-json/acf/v3/options/site-settings`

### Step 5: Frontend Integration
- [ ] Update `.env.local` with `NEXT_PUBLIC_WP_URL`
- [ ] Create `lib/api.ts` with fetch functions (examples above)
- [ ] Replace mock data imports with API calls
- [ ] Test all pages render correctly
- [ ] Verify images load properly
- [ ] Test filtering and sorting

### Step 6: Production Deployment
- [ ] Configure CORS in WordPress
- [ ] Set up caching strategy (ISR, SSG, or SSR)
- [ ] Optimize images (use Next.js Image component)
- [ ] Test performance
- [ ] Deploy and monitor

---

## 🚨 Important Notes

### ACF Configuration
- All ACF fields are exposed to REST API via `add_filter('acf/rest_api/field_settings/show_in_rest', '__return_true')`
- ACF fields are accessible via `post.acf` in REST responses
- ACF JSON files will be saved in `/acf-json/` for version control

### Custom REST Fields
- `author_name` - automatically added to guides and community posts
- `upvotes` - automatically added to community posts (also in ACF)

### Taxonomy Queries
- Use `?_embed` to get full taxonomy term details
- Use slug or ID to filter by taxonomy
- Taxonomy terms auto-populate on theme activation

### Image Handling
- Featured images use native WordPress featured_media
- ACF image fields return URLs when `return_format` is set to `url`
- Use Next.js Image component with proper domains configuration

### Menu Order
- Hero slides use `menu_order` (supports property) for ordering
- Query with `?orderby=menu_order&order=asc`

---

## 📚 Additional Resources

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [ACF REST API Documentation](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Last Updated:** 2025-11-07  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
