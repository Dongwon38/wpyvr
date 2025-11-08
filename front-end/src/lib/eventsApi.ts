/**
 * Events API Integration
 * Connects to WordPress REST API for Events custom post type
 */

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8000';

export interface EventData {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  date: string;
  acf: {
    event_date: string;
    start_time: string;
    end_time: string;
    location_title: string;
    location_address?: string;
    event_link?: string;
    image?: string;
  };
  event_category?: number[];
  event_tag?: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface Event {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  date: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  formattedTime: string; // Formatted time in Pacific Time
  locationTitle: string;
  locationAddress?: string;
  googleMapsUrl?: string;
  link?: string;
  isPast: boolean;
  categories?: string[];
  tags?: string[];
}

/**
 * Format time range with PST/PDT label
 */
function formatLocalTime(date: string, startTime: string, endTime: string): string {
  // Parse the times (stored as local time)
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  // Format times in 12-hour format
  const formatTime = (hour: number, min: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
  };

  const startFormatted = formatTime(startHour, startMin);
  const endFormatted = formatTime(endHour, endMin);

  // Determine if we're in PST or PDT (daylight saving time)
  const eventDate = new Date(date);
  const year = eventDate.getFullYear();
  
  // Daylight saving time in Pacific timezone typically:
  // Starts: Second Sunday in March
  // Ends: First Sunday in November
  const dstStart = new Date(year, 2, 1); // March
  dstStart.setDate(dstStart.getDate() + (14 - dstStart.getDay()) % 7);
  
  const dstEnd = new Date(year, 10, 1); // November
  dstEnd.setDate(dstEnd.getDate() + (7 - dstEnd.getDay()) % 7);
  
  const isDST = eventDate >= dstStart && eventDate < dstEnd;
  const timezone = isDST ? 'PDT' : 'PST';

  return `${startFormatted} - ${endFormatted} ${timezone}`;
}

/**
 * Generate Google Maps URL from address
 */
function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Transform WordPress API response to frontend Event format
 */
function transformEventData(data: EventData): Event {
  const eventDate = data.acf.event_date;
  const [startHour, startMin] = data.acf.start_time.split(':').map(Number);
  
  // Parse date as local time (not UTC)
  // Split "YYYY-MM-DD" and create local date
  const [year, month, day] = eventDate.split('-').map(Number);
  const eventDateTime = new Date(year, month - 1, day, startHour, startMin, 0, 0);
  
  // Check if event is past (compare with current local time)
  const now = new Date();
  const isPast = eventDateTime < now;
  
  // Format time for display with PST/PDT
  const formattedTime = formatLocalTime(eventDate, data.acf.start_time, data.acf.end_time);

  // Extract categories and tags from embedded data
  const categories = data._embedded?.['wp:term']?.[0]?.map(term => term.name) || [];
  const tags = data._embedded?.['wp:term']?.[1]?.map(term => term.name) || [];

  return {
    id: data.id,
    slug: data.slug,
    title: data.title.rendered,
    excerpt: data.excerpt.rendered.replace(/<[^>]*>/g, ''), // Strip HTML tags
    content: data.content.rendered,
    thumbnail: data.acf.image || data._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    date: data.date,
    eventDate: data.acf.event_date,
    startTime: data.acf.start_time,
    endTime: data.acf.end_time,
    formattedTime,
    locationTitle: data.acf.location_title,
    locationAddress: data.acf.location_address,
    googleMapsUrl: data.acf.location_address ? getGoogleMapsUrl(data.acf.location_address) : undefined,
    link: data.acf.event_link,
    isPast,
    categories,
    tags,
  };
}

/**
 * Fetch all events from WordPress
 */
export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/events?_embed&per_page=100`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data: EventData[] = await response.json();
    return data.map(transformEventData);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

/**
 * Fetch a single event by slug
 */
export async function fetchEventBySlug(slug: string): Promise<Event | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/events?slug=${slug}&_embed`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    const data: EventData[] = await response.json();
    
    if (data.length === 0) {
      return null;
    }

    return transformEventData(data[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

/**
 * Fetch all events sorted by date (newest first)
 */
export async function fetchEventsSortedByDate(): Promise<Event[]> {
  const events = await fetchEvents();
  return events.sort((a, b) => {
    const aDateTime = new Date(a.eventDate + 'T' + a.startTime);
    const bDateTime = new Date(b.eventDate + 'T' + b.startTime);
    return bDateTime.getTime() - aDateTime.getTime();
  });
}

/**
 * Fetch upcoming events only
 */
export async function fetchUpcomingEvents(): Promise<Event[]> {
  const events = await fetchEvents();
  return events
    .filter(event => !event.isPast)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
}

/**
 * Fetch past events only
 */
export async function fetchPastEvents(): Promise<Event[]> {
  const events = await fetchEvents();
  return events
    .filter(event => event.isPast)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
}

/**
 * Get all event slugs for static generation
 */
export async function fetchEventSlugs(): Promise<string[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/events?_fields=slug&per_page=100`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: Array<{ slug: string }> = await response.json();
    return data.map(event => event.slug);
  } catch (error) {
    console.error('Error fetching event slugs:', error);
    return [];
  }
}
