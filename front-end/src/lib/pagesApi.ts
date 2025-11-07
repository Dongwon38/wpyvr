/**
 * WordPress Pages API Integration
 * Connects to WordPress REST API for standard Pages
 */

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8000';

export interface WordPressPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  date: string;
  modified: string;
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  date: string;
  modified: string;
}

/**
 * Transform WordPress API response to frontend Page format
 */
function transformPageData(data: WordPressPage): Page {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title.rendered,
    content: data.content.rendered,
    excerpt: data.excerpt?.rendered.replace(/<[^>]*>/g, ''), // Strip HTML tags
    date: data.date,
    modified: data.modified,
  };
}

/**
 * Fetch a page by slug from WordPress
 */
export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/pages?slug=${slug}`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const data: WordPressPage[] = await response.json();
    
    if (data.length === 0) {
      return null;
    }

    return transformPageData(data[0]);
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

/**
 * Fetch all pages from WordPress
 */
export async function fetchPages(): Promise<Page[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/pages?per_page=100`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.statusText}`);
    }

    const data: WordPressPage[] = await response.json();
    return data.map(transformPageData);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}
