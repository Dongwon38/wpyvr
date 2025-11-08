# Events Feature Setup Guide

This guide will help you set up and use the Events feature that connects your Next.js frontend to WordPress backend.

## Overview

The Events feature allows you to:
- Create and manage events in WordPress dashboard
- Display events on your Next.js frontend
- Automatically categorize events as "Upcoming" or "Past" based on event date
- Show event details including date, time, location, and registration links

## Backend Setup (WordPress)

### 1. WordPress Timezone Settings

**IMPORTANT**: Before creating events, configure your WordPress timezone:

1. Go to **Settings > General** in WordPress admin
2. Set **Timezone** to `Los Angeles` (Pacific Time)
3. This ensures event times are displayed correctly as PST/PDT

**Note**: Event dates and times are stored and displayed in Pacific Time (PST/PDT). The system automatically determines whether to display PST or PDT based on daylight saving time.

### 2. ACF Fields Configuration

The Events custom post type uses Advanced Custom Fields (ACF) with the following fields:

- **Event Date** (date_picker): Required - The date of the event (YYYY-MM-DD format)
- **Start Time** (time_picker): Required - Event start time (stored as local Pacific Time)
- **End Time** (time_picker): Required - Event end time (stored as local Pacific Time)
- **Location Title** (text): Required - Location name (e.g., "Community Center")
- **Location Address** (text): Optional - Full address (creates Google Maps link)
- **Event Link** (url): Optional - External registration or information link
- **Event Image** (image): Optional - Featured image for the event

### 3. Event Categories and Tags

Events support two taxonomies:

- **Event Categories** (hierarchical): For organizing events into groups
  - Examples: "Meetup", "Workshop", "Conference", "Social"
- **Event Tags** (non-hierarchical): For flexible tagging
  - Examples: "beginners", "advanced", "networking", "hands-on"

Create categories and tags before publishing events for better organization.

### 4. Import ACF Fields

The ACF field group is already configured in `/package/headless-theme/acf-json/group_event.json`

ACF will automatically sync these fields when you:
1. Log into WordPress admin
2. Go to Custom Fields
3. Click "Sync available" if prompted

### 5. Create Your First Event

1. In WordPress admin, go to **Events > Add New**
2. Enter the event title
3. Write the event description in the editor (supports rich text and images)
4. Add an excerpt (brief summary)
5. Fill in the ACF fields:
   - **Event Date**: Select date from calendar picker
   - **Start Time**: Select start time (e.g., 18:00 for 6:00 PM)
   - **End Time**: Select end time (e.g., 21:00 for 9:00 PM)
   - **Location Title**: Enter location name (e.g., "WeWork Downtown")
   - **Location Address**: Enter full address for Google Maps link (optional)
   - **Event Link**: Add registration/info URL (optional)
   - **Event Image**: Upload event image (optional - can also use Featured Image)
6. Assign Event Categories and Tags
7. Set a Featured Image (if not using ACF Event Image)
8. Click **Publish**

**Time Entry Tips**:
- Times are stored in Pacific Time (local)
- Use 24-hour format in the picker (18:00) 
- Frontend displays as 12-hour format with PST/PDT (6:00 PM PST)
- System automatically determines PST vs PDT based on date

### 6. API Endpoint

Events are automatically available via REST API at:
```
http://your-wordpress-site.com/wp-json/wp/v2/events
```

The API includes:
- Standard post fields (title, content, excerpt, featured_media)
- ACF custom fields (event_date, start_time, end_time, location_title, location_address, event_link, image)
- Event categories and tags (via `_embed` parameter)
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
- `fetchEventsSortedByDate()` - Get all events sorted by date (newest first)
- `fetchUpcomingEvents()` - Get only upcoming events (sorted chronologically)
- `fetchPastEvents()` - Get only past events (sorted reverse chronologically)

### 3. Pages Using Events

Events are displayed on:

1. **Home Page** (`/`)
   - Shows latest 3 events (sorted by date, newest first)
   - Displays both upcoming and past events
   - Links to full events page

2. **Events Page** (`/events`)
   - Lists all events in one view (no tabs)
   - Sorted by date (newest first)
   - Dynamic "Upcoming" or "Past" badges
   - Past events shown with grayscale images
   - Empty state when no events exist

3. **Event Detail Page** (`/events/[slug]`)
   - Full event information
   - Event content with rich text
   - Registration button (if event link provided)
   - Status badge (Upcoming/Past)

### 4. Components

- **EventCard** (`/components/EventCard.tsx`)
  - Reusable card component
  - Shows thumbnail, title, excerpt, date, formatted time (with PST/PDT), location
  - Location links to Google Maps (if address provided)
  - Event tags display (up to 3, with "+X more" indicator)
  - "Learn More" button (all events) and "Register" button (upcoming events only)
  - Past events shown with grayscale effect and gray badge

## Testing Your Setup

### 1. Create a Test Event in WordPress

```
Title: Vancouver WordPress October Social Hangout
Content: Join us for an evening of networking and casual conversation...
Excerpt: Connect with fellow WordPress enthusiasts in a relaxed setting.

Event Date: 2025-10-22 (select from date picker)
Start Time: 18:00 (6:00 PM)
End Time: 21:00 (9:00 PM)
Location Title: Central Library
Location Address: 350 W Georgia St, Vancouver, BC V6B 6B1, Canada
Event Link: https://www.meetup.com/vancouver-wordpress-meetup-group/
Event Categories: Meetup, Social
Event Tags: networking, community, beginners-welcome
```

**Note**: The system will automatically display the time as "6:00 PM - 9:00 PM PST" or "6:00 PM - 9:00 PM PDT" depending on whether daylight saving time is in effect for the event date.

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

Events are automatically categorized based on the event date and start time:
- **Upcoming**: Event start time is in the future (badge: blue/purple gradient)
- **Past**: Event start time has passed (badge: gray, image: grayscale)

This happens in real-time on the frontend by comparing the event date/time with the current local time. No need to manually update event status.

### Time Zone Handling

**How it works**:
1. **Storage**: Event dates and times are stored as entered (local Pacific Time)
2. **Display**: Times are displayed with PST or PDT suffix based on the event date
3. **DST Detection**: The system automatically determines DST:
   - PDT (Pacific Daylight Time): Second Sunday in March to First Sunday in November
   - PST (Pacific Standard Time): First Sunday in November to Second Sunday in March
4. **Comparison**: Event past/upcoming status is determined by comparing with browser's local time

**Example**:
- You enter: October 22, 2025, 18:00-21:00
- Stored as: 2025-10-22, 18:00, 21:00
- Displayed as: Oct 22, 2025, 6:00 PM - 9:00 PM PDT (because October is in DST period)
- Status: Automatically marked as "Past" after October 22, 2025 6:00 PM local time

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
