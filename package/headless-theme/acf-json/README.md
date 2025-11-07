# ACF JSON Field Groups

This directory contains ACF field group definitions in JSON format that match your Next.js frontend structure.

## 📦 Files Included

1. **group_hero_slide.json** - Hero Slide Details (7 fields + 2 groups + 1 repeater)
2. **group_guide.json** - Guide Details (1 image field)
3. **group_community_post.json** - Community Post Details (2 fields)
4. **group_event.json** - Event Details (5 fields)
5. **group_site_settings.json** - Site Settings (Options Page - 3 fields + 1 repeater)

## 🚀 Installation Methods

### Method 1: Automatic Sync (Recommended)

The JSON files in this directory will be **automatically loaded** when you activate the theme. No manual import needed!

**How it works:**
- ACF automatically scans the `/acf-json/` directory
- Field groups are synchronized on every page load
- Any changes in WordPress admin are saved back to JSON files

**Steps:**
1. Activate the theme
2. Refresh any WordPress admin page
3. Field groups will appear automatically
4. Done! ✅

### Method 2: Manual Import via ACF UI

If you prefer to import manually:

**Steps:**
1. Go to **Custom Fields → Tools** in WordPress admin
2. Click **Import Field Groups**
3. Upload each JSON file individually, or use the combined file (see below)
4. Click **Import**

### Method 3: Use Combined Import File

For convenience, import all field groups at once:

**File:** `acf-import-all-fields.json` (created below)

**Steps:**
1. Go to **Custom Fields → Tools**
2. Click **Import Field Groups**
3. Upload `acf-import-all-fields.json`
4. Click **Import**
5. All 5 field groups will be imported at once

## 📋 Field Group Details

### 1. Hero Slide Details
**Location:** Post Type = `hero_slide`

**Fields:**
- `badge` (Text) - Badge text above title
- `title` (Text) - First part of heading
- `highlight` (Text) - Highlighted second part
- `description` (Textarea) - Supporting text
- `primary_cta` (Group)
  - `text` (Text)
  - `href` (Text)
  - `icon` (Text)
- `secondary_cta` (Group)
  - `text` (Text)
  - `href` (Text)
  - `icon` (Text)
- `stats` (Repeater) - Min/Max: 3 items
  - `label` (Text)
  - `value` (Text)

### 2. Guide Details
**Location:** Post Type = `guide`

**Fields:**
- `image` (Image) - Featured image, returns URL

### 3. Community Post Details
**Location:** Post Type = `community_post`

**Fields:**
- `avatar` (Text) - Emoji avatar (default: 👤)
- `upvotes` (Number) - Upvote count (default: 0)

### 4. Event Details
**Location:** Post Type = `event`

**Fields:**
- `event_date` (Date Picker) - Required, format: Y-m-d
- `time` (Text) - Required, e.g., "2:00 PM - 5:00 PM EST"
- `location` (Text) - Required, e.g., "Online (Zoom)"
- `attendees` (Number) - Optional attendee count
- `image` (Image) - Optional event image, returns URL

### 5. Site Settings
**Location:** Options Page = `site-settings`

**Fields:**
- `site_name` (Text) - Default: "Community Hub"
- `site_tagline` (Textarea) - Site description
- `social_links` (Repeater)
  - `platform` (Select) - GitHub, Twitter, LinkedIn, Email, Facebook, Instagram
  - `url` (URL) - Social profile URL
  - `icon` (Text) - Lucide icon name

## 🔧 REST API Access

All fields are automatically exposed to the WordPress REST API:

```bash
# Access hero slide fields
GET /wp-json/wp/v2/hero-slides/1
Response: { "acf": { "badge": "...", "title": "...", ... } }

# Access guide fields
GET /wp-json/wp/v2/guides/42
Response: { "acf": { "image": "https://..." } }

# Access site settings
GET /wp-json/acf/v3/options/site-settings
Response: { "acf": { "site_name": "...", "social_links": [...] } }
```

## 🔄 Syncing Changes

### From WordPress Admin to JSON
When you edit fields in WordPress admin:
1. Click **Update** on the field group
2. ACF automatically saves changes to the JSON file
3. Commit the updated JSON file to version control

### From JSON to WordPress Admin
When JSON files are updated (e.g., from git pull):
1. Go to **Custom Fields → Field Groups**
2. Look for "Sync available" notice
3. Click **Sync** to update the database

## 📝 Modifying Field Groups

### Option 1: Edit in WordPress Admin (Recommended)
1. Go to **Custom Fields → Field Groups**
2. Edit the field group
3. Click **Update**
4. JSON file is automatically updated
5. Commit changes to git

### Option 2: Edit JSON Directly
1. Edit the JSON file in your editor
2. Ensure valid JSON syntax
3. WordPress will automatically load changes
4. Or manually sync via ACF UI

## 🚨 Important Notes

### Field Keys Must Be Unique
- Each field has a unique `key` (e.g., `field_hero_badge`)
- Do not duplicate keys across field groups
- ACF uses these keys internally

### Required ACF Version
- ACF Free: 5.0+ (basic features)
- ACF Pro: 5.0+ (all features including Options Pages)

**Note:** Site Settings requires ACF Pro for Options Pages functionality.

### Version Control
- Always commit JSON files to git
- This allows team collaboration
- Provides field structure history
- Enables easy deployment across environments

### Troubleshooting

**Fields not appearing?**
- Check that ACF plugin is installed and activated
- Verify JSON files are in the correct directory
- Check file permissions (should be readable)

**Changes not syncing?**
- Go to Custom Fields → Field Groups
- Look for "Sync available" badge
- Click "Sync" button

**Options Page not showing?**
- Requires ACF Pro
- Check that `register-acf.php` creates options page
- Verify options page slug matches: `site-settings`

## 📚 Additional Resources

- [ACF JSON Documentation](https://www.advancedcustomfields.com/resources/local-json/)
- [ACF REST API](https://www.advancedcustomfields.com/resources/wp-rest-api-integration/)
- [Field Types Reference](https://www.advancedcustomfields.com/resources/#field-types)

## ✅ Verification Checklist

After installation, verify:

- [ ] All 5 field groups appear in **Custom Fields → Field Groups**
- [ ] Hero Slide fields appear when editing a hero slide
- [ ] Guide fields appear when editing a guide
- [ ] Community Post fields appear when editing a community post
- [ ] Event fields appear when editing an event
- [ ] Site Settings page accessible in WordPress admin menu
- [ ] Fields appear in REST API responses (check with `/wp-json/wp/v2/hero-slides`)

## 🎉 You're All Set!

Your ACF fields are now configured and ready to use. Start creating content in WordPress and it will automatically be available via REST API!
