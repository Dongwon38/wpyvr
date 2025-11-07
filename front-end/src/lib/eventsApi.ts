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
    time: string;
    location: string;
    event_link?: string;
    image?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
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
  time: string;
  location: string;
  link?: string;
  isPast: boolean;
}

/**
 * Transform WordPress API response to frontend Event format
 */
function transformEventData(data: EventData): Event {
  const eventDate = new Date(data.acf.event_date);
  const isPast = eventDate < new Date();

  return {
    id: data.id,
    slug: data.slug,
    title: data.title.rendered,
    excerpt: data.excerpt.rendered.replace(/<[^>]*>/g, ''), // Strip HTML tags
    content: data.content.rendered,
    thumbnail: data.acf.image || data._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    date: data.date,
    eventDate: data.acf.event_date,
    time: data.acf.time,
    location: data.acf.location,
    link: data.acf.event_link,
    isPast,
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
