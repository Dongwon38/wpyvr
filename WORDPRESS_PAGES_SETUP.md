# WordPress Pages Setup Guide

This guide explains how to create and display WordPress pages (like Code of Conduct and Privacy Policy) in your Next.js frontend.

## Overview

The frontend now supports rendering WordPress pages with full HTML formatting including:
- Headings (`<h1>`, `<h2>`, etc.)
- Paragraphs (`<p>`)
- Lists (`<ul>`, `<ol>`, `<li>`)
- Images (`<img>`)
- Links (`<a>`)
- Block quotes, code blocks, and more

## Setup Complete

✅ **WordPress Pages API** - `/lib/pagesApi.ts`
✅ **Code of Conduct Page** - `/code-of-conduct`
✅ **Privacy Policy Page** - `/privacy-policy`
✅ **Tailwind Typography Plugin** - Installed and configured
✅ **Navigation Links** - Added to Footer and LeftSidebar

## How to Create Pages in WordPress

### 1. Create a New Page

1. Log into WordPress admin
2. Go to **Pages > Add New**
3. Enter the page title
4. Write your content using the WordPress block editor
5. **Important**: Set the permalink (slug) correctly:
   - For Code of Conduct: `code-of-conduct`
   - For Privacy Policy: `privacy-policy`
6. Click **Publish**

### 2. Page Slug Configuration

The slug must match exactly:
- WordPress URL: `http://your-site.com/code-of-conduct/`
- Frontend URL: `http://your-frontend.com/code-of-conduct`

To set the slug:
1. In the page editor, look for "Permalink" in the right sidebar
2. Click "Edit" next to the URL
3. Enter the exact slug (e.g., `code-of-conduct`)
4. Click "OK"

## Content Formatting

WordPress content is rendered with full HTML support using `dangerouslySetInnerHTML`.

### Supported Elements

**Headings**
```html
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
```

**Paragraphs**
```html
<p>Regular paragraph text.</p>
<p><strong>Bold text</strong> and <em>italic text</em></p>
```

**Lists**
```html
<ul>
  <li>Unordered list item</li>
  <li>Another item</li>
</ul>

<ol>
  <li>Ordered list item</li>
  <li>Another numbered item</li>
</ol>
```

**Links**
```html
<a href="https://example.com">External Link</a>
<a href="/about">Internal Link</a>
```

**Images**
```html
<img src="image-url.jpg" alt="Description" />
```

**Block Quotes**
```html
<blockquote>
  <p>This is a quote.</p>
</blockquote>
```

**Code**
```html
<code>inline code</code>

<pre><code>
function example() {
  return true;
}
</code></pre>
```

## Typography Styling

The pages use Tailwind Typography (`prose` classes) for beautiful, readable content.

### Prose Classes Applied

```tsx
<article className="prose prose-lg max-w-none dark:prose-invert
  prose-headings:font-bold prose-headings:text-gray-900
  prose-p:text-gray-700
  prose-a:text-blue-600 hover:prose-a:underline
  prose-ul:list-disc prose-ol:list-decimal
  prose-img:rounded-lg prose-img:shadow-md
  ...
">
  {/* HTML content from WordPress */}
</article>
```

### Features

- **Responsive typography** - Adjusts for mobile and desktop
- **Dark mode support** - Automatic color adjustments
- **Beautiful defaults** - Proper spacing, line height, and sizing
- **Link styling** - Blue links with hover underlines
- **Image styling** - Rounded corners with shadows
- **Code styling** - Syntax highlighting ready

## Page Structure

Each page includes:

1. **Back Button** - Returns to home
2. **Page Header** - Icon, title, and last updated date
3. **Content Section** - Full WordPress content with typography
4. **Footer Note** - Contact link for questions

### Code of Conduct Page

- URL: `/code-of-conduct`
- Icon: Blue FileText
- Color theme: Blue accents

### Privacy Policy Page

- URL: `/privacy-policy`
- Icon: Green Shield
- Color theme: Green accents

## Navigation

Pages are accessible from:

1. **Footer** - "Legal" section
2. **Left Sidebar** - "Legal" section (above "Need Help")
3. **Direct URL** - Type the URL directly

## Technical Implementation

### API Integration

```typescript
// Fetch page by slug
const page = await fetchPageBySlug('code-of-conduct');

// Returns
{
  id: number;
  slug: string;
  title: string;
  content: string; // HTML content
  modified: string; // Last update date
}
```

### HTML Rendering

```tsx
<article
  className="prose prose-lg max-w-none dark:prose-invert ..."
  dangerouslySetInnerHTML={{ __html: page.content }}
/>
```

**Note**: `dangerouslySetInnerHTML` is used to render HTML from WordPress. The content comes from your trusted WordPress backend, so it's safe.

### Caching

Pages are cached for 5 minutes:
```typescript
{
  next: { revalidate: 300 }
}
```

This means:
- Fast page loads
- Changes in WordPress appear within 5 minutes
- Reduced API calls

## Adding More Pages

To add additional pages:

### 1. Create Page in WordPress
- Set appropriate slug (e.g., `terms-of-service`)

### 2. Create Frontend Route
Create `/app/[slug]/page.tsx`:

```tsx
"use client";
import { fetchPageBySlug } from "@/lib/pagesApi";

export default function TermsPage() {
  // Same structure as code-of-conduct page
  // Just change the slug and styling
}
```

### 3. Add Navigation Links

**Footer**:
```typescript
legal: [
  { label: "Code of Conduct", href: "/code-of-conduct" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" }, // New
]
```

**LeftSidebar**:
```typescript
const legalLinks = [
  { href: "/code-of-conduct", label: "Code of Conduct" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" }, // New
];
```

## Troubleshooting

### Page Not Loading

1. Check WordPress page exists and is published
2. Verify slug matches exactly
3. Check WordPress REST API is accessible:
   ```
   http://your-wordpress.com/wp-json/wp/v2/pages?slug=code-of-conduct
   ```
4. Check `.env.local` has correct WordPress URL

### HTML Not Rendering

1. Verify Tailwind Typography is installed:
   ```bash
   npm list @tailwindcss/typography
   ```
2. Check `globals.css` includes:
   ```css
   @plugin "@tailwindcss/typography";
   ```
3. Restart dev server after making changes

### Styling Issues

1. Check prose classes are applied to the article element
2. Verify dark mode classes (dark:prose-invert)
3. Test without custom styles first
4. Check browser console for errors

### Content Appears as Plain Text

If content shows as plain text with HTML tags visible:
- This means `dangerouslySetInnerHTML` isn't working
- Check the code has `dangerouslySetInnerHTML={{ __html: page.content }}`
- Verify `page.content` contains HTML (not plain text)

## Security Notes

- Content comes from your trusted WordPress backend
- WordPress handles content sanitization
- `dangerouslySetInnerHTML` is safe for trusted content
- Always validate WordPress admin access

## Best Practices

1. **Keep content updated** - Regular review and updates
2. **Use proper headings** - H2 for main sections, H3 for subsections
3. **Add images** - Use WordPress media library
4. **Test responsiveness** - Check on mobile and desktop
5. **Use block editor** - Take advantage of WordPress blocks
6. **Set featured images** - For better SEO and previews

## Example Content Structure

```html
<h2>1. Introduction</h2>
<p>Welcome to our community...</p>

<h2>2. Community Guidelines</h2>
<h3>2.1 Be Respectful</h3>
<p>Treat everyone with respect...</p>
<ul>
  <li>Listen actively</li>
  <li>Be kind and courteous</li>
  <li>Respect different viewpoints</li>
</ul>

<h3>2.2 Be Professional</h3>
<p>Maintain professional standards...</p>

<blockquote>
  <p>"In diversity there is beauty and strength." - Maya Angelou</p>
</blockquote>
```

## Support

For questions or issues:
- Check WordPress page is published
- Verify slug configuration
- Test API endpoint directly
- Review browser console for errors
- Check WordPress REST API settings
