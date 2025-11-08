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
 * Convert UTC time to Pacific Time
 */
function convertToPacificTime(date: string, time: string): Date {
  // Combine date and time into ISO string
  const dateTimeString = `${date}T${time}`;
  const utcDate = new Date(dateTimeString + 'Z'); // Treat as UTC
  
  return utcDate;
}

/**
 * Format time range in Pacific Time
 */
function formatPacificTime(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles'
  };

  const startFormatted = startDate.toLocaleString('en-US', options);
  const endFormatted = endDate.toLocaleString('en-US', options);

  return `${startFormatted} - ${endFormatted} PST`;
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
  const eventDate = new Date(data.acf.event_date);
  const now = new Date();
  
  // Convert times to Pacific Time
  const startDateTime = convertToPacificTime(data.acf.event_date, data.acf.start_time);
  const endDateTime = convertToPacificTime(data.acf.event_date, data.acf.end_time);
  
  // Check if event is past (compare with current date/time in Pacific timezone)
  const isPast = startDateTime < now;
  
  // Format time for display
  const formattedTime = formatPacificTime(startDateTime, endDateTime);

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
