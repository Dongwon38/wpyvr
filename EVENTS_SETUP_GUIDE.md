# Events Feature Setup Guide

This guide will help you set up and use the Events feature that connects your Next.js frontend to WordPress backend.

## Overview

The Events feature allows you to:
- Create and manage events in WordPress dashboard
- Display events on your Next.js frontend
- Automatically categorize events as "Upcoming" or "Past" based on event date
- Show event details including date, time, location, and registration links

## Backend Setup (WordPress)

### 1. ACF Fields Configuration

The Events custom post type uses Advanced Custom Fields (ACF) with the following fields:

- **Event Date** (date_picker): Required - The date of the event
- **Event Time** (text): Required - Time with timezone (e.g., "2:00 PM - 5:00 PM EST")
- **Location** (text): Required - Physical location or "Online (Zoom)"
- **Event Link** (url): Optional - External registration or information link
- **Event Image** (image): Optional - Featured image for the event

### 2. Import ACF Fields

The ACF field group is already configured in `/package/headless-theme/acf-json/group_event.json`

ACF will automatically sync these fields when you:
1. Log into WordPress admin
2. Go to Custom Fields
3. Click "Sync available" if prompted

### 3. Create Your First Event

1. In WordPress admin, go to **Events > Add New**
2. Enter the event title
3. Write the event description in the editor (supports rich text and images)
4. Add an excerpt (brief summary)
5. Fill in the ACF fields:
   - Event Date
   - Event Time
   - Location
   - Event Link (optional)
   - Event Image (optional - can also use Featured Image)
6. Set a Featured Image (if not using ACF Event Image)
7. Click **Publish**

### 4. API Endpoint

Events are automatically available via REST API at:
```
http://your-wordpress-site.com/wp-json/wp/v2/events
```

The API includes:
- Standard post fields (title, content, excerpt, featured_media)
- ACF custom fields (event_date, time, location, event_link, image)
- Embedded featured media

## Frontend Setup (Next.js)

### 1. Environment Variables

Create a `.env.local` file in the `/front-end` directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` and set your WordPress URL:

```env
# For local development
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8000

# For production
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com
```

### 2. API Integration

The Events API is already integrated in `/front-end/src/lib/eventsApi.ts`

Available functions:
- `fetchEvents()` - Get all events
- `fetchEventBySlug(slug)` - Get a single event
- `fetchUpcomingEvents()` - Get only upcoming events
- `fetchPastEvents()` - Get only past events

### 3. Pages Using Events

Events are displayed on:

1. **Home Page** (`/`)
   - Shows 3 upcoming events
   - Links to full events page

2. **Events Page** (`/events`)
   - Lists all events with tabs for "Upcoming" and "Past"
   - Automatic categorization based on event date
   - Empty state when no events exist

3. **Event Detail Page** (`/events/[slug]`)
   - Full event information
   - Event content with rich text
   - Registration button (if event link provided)
   - Status badge (Upcoming/Past)

### 4. Components

- **EventCard** (`/components/EventCard.tsx`)
  - Reusable card component
  - Shows thumbnail, title, excerpt, date, time, location
  - "Learn More" and "Register" buttons
  - Past events shown with grayscale effect

## Testing Your Setup

### 1. Create a Test Event in WordPress

```
Title: Community Meetup Q1 2024
Content: Join us for our quarterly community meetup...
Excerpt: Connect with fellow creators and share your experiences.

Event Date: 2024-03-15
Event Time: 6:00 PM - 9:00 PM PST
Location: Community Center, San Francisco
Event Link: https://example.com/register
```

### 2. Verify API Response

Visit in your browser:
```
http://localhost:8000/wp-json/wp/v2/events
```

You should see JSON data with your event.

### 3. Check Frontend

1. Start your Next.js dev server:
   ```bash
   cd front-end
   npm run dev
   ```

2. Visit pages:
   - Home: `http://localhost:3000`
   - Events: `http://localhost:3000/events`
   - Event detail: `http://localhost:3000/events/community-meetup-q1-2024`

## Features

### Automatic Past/Upcoming Detection

Events are automatically categorized:
- **Upcoming**: Event date is today or in the future
- **Past**: Event date has passed

This happens in real-time on the frontend, so no need to manually update event status.

### Rich Content Support

The event content field supports:
- Rich text formatting
- Images and galleries
- Embedded videos
- Code blocks
- Any WordPress block editor content

### Navigation

Events are accessible via:
- Left sidebar navigation (Home → Events)
- Direct URL: `/events`
- Links from home page Events section

## Customization

### Styling

All components use Tailwind CSS and follow the site's design system:
- Consistent color scheme
- Dark mode support
- Responsive design
- Smooth animations with Framer Motion

### Adding Custom Fields

To add more ACF fields to events:

1. Edit `/package/headless-theme/acf-json/group_event.json`
2. Add your field definition
3. Update `/front-end/src/lib/eventsApi.ts` to include the new field in the `EventData` interface
4. Update components to display the new field

## Troubleshooting

### Events not showing on frontend

1. Check WordPress API is accessible:
   ```bash
   curl http://localhost:8000/wp-json/wp/v2/events
   ```

2. Verify environment variable:
   ```bash
   echo $NEXT_PUBLIC_WORDPRESS_API_URL
   ```

3. Check browser console for errors

### ACF fields not appearing

1. Go to WordPress admin > Custom Fields
2. Look for "Sync available" message
3. Click to sync the field group
4. Re-save your event

### Images not loading

1. Make sure WordPress media library URLs are accessible
2. Check CORS settings if WordPress is on a different domain
3. Verify image URLs in API response

## Production Deployment

1. Update `.env.local` with production WordPress URL
2. Build Next.js app:
   ```bash
   npm run build
   ```
3. Ensure WordPress site is accessible from production environment
4. Configure CORS if WordPress and Next.js are on different domains

## Support

For issues or questions:
- Check WordPress REST API documentation
- Review Next.js documentation for API integration
- Check ACF documentation for custom fields
