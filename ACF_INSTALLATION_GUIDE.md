# 📦 ACF JSON Installation Guide

## ✅ What You Have

I've created **5 ACF field group JSON files** that perfectly match your Next.js frontend structure:

```
package/headless-theme/acf-json/
├── group_hero_slide.json          (Hero carousel fields)
├── group_guide.json                (Guide image field)
├── group_community_post.json       (Avatar & upvotes)
├── group_event.json                (Event details)
├── group_site_settings.json        (Footer & site config)
├── acf-import-all-fields.json      (Combined import file)
└── README.md                       (Detailed documentation)
```

---

## 🚀 Quick Start (3 Options)

### Option 1: Automatic Sync (Easiest - Recommended) ⭐

The JSON files will **automatically load** when you activate the theme!

**Steps:**
1. Upload the theme to WordPress
2. Activate "Headless Theme"
3. Refresh any WordPress admin page
4. Done! ✅

**Why this works:**
- Your `register-acf.php` already configures JSON sync
- ACF automatically scans `/acf-json/` directory
- Fields appear without any manual import

**Verify it worked:**
- Go to **Custom Fields → Field Groups**
- You should see 5 field groups listed
- Edit a Hero Slide post → ACF fields should appear

---

### Option 2: Import Combined File (One-Click Import)

Import all field groups at once using the combined file.

**Steps:**
1. Go to **Custom Fields → Tools** in WordPress admin
2. Click **Import Field Groups**
3. Upload `acf-json/acf-import-all-fields.json`
4. Click **Import**
5. All 5 field groups imported! ✅

**File location:**
```
package/headless-theme/acf-json/acf-import-all-fields.json
```

---

### Option 3: Import Individual Files

Import each field group separately.

**Steps:**
1. Go to **Custom Fields → Tools**
2. Click **Import Field Groups**
3. Upload files one by one:
   - `group_hero_slide.json`
   - `group_guide.json`
   - `group_community_post.json`
   - `group_event.json`
   - `group_site_settings.json`
4. Click **Import** after each upload

---

## 📋 Field Groups Overview

### 1. Hero Slide Details
**Post Type:** `hero_slide`

```
Fields:
✓ badge (text) - "Join 10,000+ members"
✓ title (text) - "A place where"
✓ highlight (text) - "ideas meet"
✓ description (textarea) - Supporting text
✓ primary_cta (group)
  ├── text - "Read Guides"
  ├── href - "/guides"
  └── icon - "BookOpen"
✓ secondary_cta (group)
  ├── text - "Join Community"
  ├── href - "/community"
  └── icon - "Users"
✓ stats (repeater - 3 items)
  ├── label - "Expert Guides"
  └── value - "100+"
```

### 2. Guide Details
**Post Type:** `guide`

```
Fields:
✓ image (image) - Featured image URL
```

### 3. Community Post Details
**Post Type:** `community_post`

```
Fields:
✓ avatar (text) - Emoji avatar (👤)
✓ upvotes (number) - Upvote count
```

### 4. Event Details
**Post Type:** `event`

```
Fields:
✓ event_date (date picker) - Event date
✓ time (text) - "2:00 PM - 5:00 PM EST"
✓ location (text) - "Online (Zoom)"
✓ attendees (number) - Attendee count
✓ image (image) - Event image URL
```

### 5. Site Settings
**Options Page:** `site-settings`

```
Fields:
✓ site_name (text) - "Community Hub"
✓ site_tagline (textarea) - Site description
✓ social_links (repeater)
  ├── platform (select) - GitHub, Twitter, etc.
  ├── url (URL) - Social profile link
  └── icon (text) - "Github", "Twitter", etc.
```

---

## 🔧 Prerequisites

### Required: ACF Plugin

You need to install **Advanced Custom Fields** plugin:

**Option A: ACF Free** (Basic features)
- Install from WordPress.org
- All field groups work EXCEPT Site Settings
- Site Settings requires Options Pages (Pro feature)

**Option B: ACF Pro** (All features) ⭐ Recommended
- Purchase from advancedcustomfields.com
- Includes Options Pages feature
- All field groups work perfectly

**Installation:**
1. Go to **Plugins → Add New**
2. Search for "Advanced Custom Fields"
3. Click **Install Now** → **Activate**

---

## ✅ Verification Checklist

After installation, verify everything works:

### WordPress Admin
- [ ] Go to **Custom Fields → Field Groups**
- [ ] 5 field groups are visible:
  - [ ] Hero Slide Details
  - [ ] Guide Details
  - [ ] Community Post Details
  - [ ] Event Details
  - [ ] Site Settings
- [ ] Edit a Hero Slide → fields appear
- [ ] Edit a Guide → image field appears
- [ ] Edit a Community Post → avatar & upvotes appear
- [ ] Edit an Event → date, time, location fields appear
- [ ] **Site Settings** menu item appears (if ACF Pro)

### REST API
Test that fields appear in API responses:

```bash
# Test hero slide
curl https://your-site.com/wp-json/wp/v2/hero-slides/1

# Should return:
{
  "id": 1,
  "acf": {
    "badge": "...",
    "title": "...",
    "highlight": "...",
    "primary_cta": { "text": "...", "href": "...", "icon": "..." },
    "stats": [...]
  }
}

# Test site settings
curl https://your-site.com/wp-json/acf/v3/options/site-settings

# Should return:
{
  "acf": {
    "site_name": "Community Hub",
    "site_tagline": "...",
    "social_links": [...]
  }
}
```

---

## 🆘 Troubleshooting

### Issue: Field groups not appearing

**Solution 1: Check ACF is installed**
```
Plugins → Installed Plugins → ACF should be active
```

**Solution 2: Verify JSON files location**
```
Files should be in: /wp-content/themes/headless-theme/acf-json/
```

**Solution 3: Check file permissions**
```
chmod 644 /path/to/acf-json/*.json
```

**Solution 4: Manual sync**
```
Custom Fields → Field Groups → Look for "Sync available" → Click "Sync"
```

---

### Issue: Site Settings not showing

**Cause:** Options Pages require ACF Pro

**Solution 1: Upgrade to ACF Pro**
```
Purchase from advancedcustomfields.com
```

**Solution 2: Use free version without Site Settings**
```
Comment out the options page code in register-acf.php:
// if (function_exists('acf_add_options_page')) { ... }
```

---

### Issue: Fields not in REST API

**Solution 1: Check ACF REST API setting**
```
register-acf.php should have:
add_filter('acf/rest_api/field_settings/show_in_rest', '__return_true');
```

**Solution 2: Verify field group has show_in_rest enabled**
```
Each JSON file should have: "show_in_rest": 1
```

---

### Issue: Changes not saving to JSON

**Solution 1: Check directory permissions**
```
chmod 755 /path/to/acf-json/
```

**Solution 2: Verify ACF JSON path is set**
```
register-acf.php should have:
add_filter('acf/settings/save_json', function($path) {
  return get_template_directory() . '/acf-json';
});
```

---

## 📝 Creating Content

### Create a Hero Slide

1. Go to **Hero Slides → Add New**
2. Fill in all fields:
   - Badge: "Join 10,000+ community members"
   - Title: "A place where"
   - Highlight: "ideas, tools, and people meet"
   - Description: "Discover expert guides..."
   - Primary CTA: Text="Read Guides", Href="/guides", Icon="BookOpen"
   - Secondary CTA: Text="Join Community", Href="/community", Icon="Users"
   - Stats: Add 3 items (Expert Guides: 100+, Community Posts: 500+, etc.)
3. Set **Order** to 0 (for first slide), 1, 2, etc.
4. Publish

### Create a Guide

1. Go to **Guides → Add New**
2. Add title and content
3. Add excerpt (short description)
4. Select **Guide Category**
5. Upload **Featured Image** (in ACF field)
6. Publish

### Create a Community Post

1. Go to **Community Posts → Add New**
2. Add title and content
3. Add excerpt
4. Add **Community Tags**
5. Set **Avatar** (emoji like 👤)
6. Set **Upvotes** (default: 0)
7. Publish

### Create an Event

1. Go to **Events → Add New**
2. Add title and description (use excerpt)
3. Select **Event Date** (date picker)
4. Enter **Time** (e.g., "2:00 PM - 5:00 PM EST")
5. Enter **Location** (e.g., "Online (Zoom)")
6. Enter **Attendees** count
7. Upload **Event Image**
8. Select **Event Category** (Workshop, Meetup, etc.)
9. Select **Event Type** (upcoming or past)
10. Publish

### Configure Site Settings

1. Go to **Site Settings** (in admin menu)
2. Set **Site Name** (default: "Community Hub")
3. Set **Site Tagline**
4. Add **Social Links**:
   - Platform: GitHub → URL: https://github.com → Icon: Github
   - Platform: Twitter → URL: https://twitter.com → Icon: Twitter
   - etc.
5. Click **Save**

---

## 🔄 Syncing Changes

### When You Edit Fields in WordPress

1. Edit field group in WordPress admin
2. Click **Update**
3. ACF automatically saves to JSON file
4. Commit the updated JSON file to git

### When JSON Files Are Updated (e.g., git pull)

1. Go to **Custom Fields → Field Groups**
2. Look for "Sync available" badge next to field groups
3. Click **Sync** to update the database

---

## 🎉 Next Steps

After ACF fields are set up:

1. ✅ Create sample content for each CPT
2. ✅ Test REST API endpoints
3. ✅ Configure site settings (footer)
4. ✅ Build frontend API client
5. ✅ Replace mock data with real API calls

---

## 📚 Additional Resources

- **ACF Documentation:** https://www.advancedcustomfields.com/resources/
- **ACF JSON Sync:** https://www.advancedcustomfields.com/resources/local-json/
- **ACF REST API:** https://www.advancedcustomfields.com/resources/wp-rest-api-integration/
- **Your Documentation:** See `BACKEND_FRONTEND_MAPPING.md` for field mappings

---

## 📞 Quick Reference

**JSON Files Location:**
```
package/headless-theme/acf-json/
```

**Import File:**
```
acf-import-all-fields.json (imports all 5 field groups)
```

**Field Groups:**
- Hero Slide Details (11 fields total)
- Guide Details (1 field)
- Community Post Details (2 fields)
- Event Details (5 fields)
- Site Settings (3 fields)

**Total Fields:** 22 fields across 5 field groups ✅

---

**You're all set! 🚀** Start creating content and your WordPress backend will serve perfectly structured data to your Next.js frontend!
