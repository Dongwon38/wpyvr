/**
 * WordPress Blog Posts API Integration
 * Connects to WordPress REST API for standard Posts (Blog)
 */

import { decodeHtmlEntities } from './utils';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8000';

export interface WordPressBlogPost {
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
  date: string;
  modified: string;
  author: number;
  author_name?: string;
  author_avatar?: string;
  featured_media: number;
  featured_image_url?: string;
  reading_time?: string;
  categories: number[];
  tags: number[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  featuredImage?: string;
  categories: number[];
  categoryNames?: string[];
  readTime: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

/**
 * Transform WordPress API response to frontend BlogPost format
 */
function transformBlogPostData(data: WordPressBlogPost): BlogPost {
  return {
    id: data.id,
    slug: data.slug,
    title: decodeHtmlEntities(data.title.rendered),
    content: data.content.rendered,
    excerpt: decodeHtmlEntities(data.excerpt.rendered.replace(/<[^>]*>/g, '').trim()), // Strip HTML tags and decode
    date: data.date,
    author: {
      name: data.author_name || 'Anonymous',
      avatar: data.author_avatar,
    },
    featuredImage: data.featured_image_url,
    categories: data.categories || [],
    readTime: data.reading_time || '5 min read',
  };
}

/**
 * Fetch all blog posts from WordPress
 */
export async function fetchBlogPosts(params?: {
  perPage?: number;
  page?: number;
  category?: number;
  orderBy?: 'date' | 'title';
  order?: 'asc' | 'desc';
}): Promise<BlogPost[]> {
  try {
    const queryParams = new URLSearchParams({
      per_page: (params?.perPage || 100).toString(),
      page: (params?.page || 1).toString(),
      orderby: params?.orderBy || 'date',
      order: params?.order || 'desc',
      _embed: 'true', // Include author and media data
    });

    if (params?.category) {
      queryParams.append('categories', params.category.toString());
    }

    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?${queryParams}`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    const data: WordPressBlogPost[] = await response.json();
    return data.map(transformBlogPostData);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const data: WordPressBlogPost[] = await response.json();
    
    if (data.length === 0) {
      return null;
    }

    return transformBlogPostData(data[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/categories?per_page=100`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch category by ID and return name
 */
export async function fetchCategoryName(categoryId: number): Promise<string> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/categories/${categoryId}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return 'Uncategorized';
    }

    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error('Error fetching category name:', error);
    return 'Uncategorized';
  }
}

/**
 * Fetch latest blog posts (for homepage)
 */
export async function fetchLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  return fetchBlogPosts({
    perPage: limit,
    orderBy: 'date',
    order: 'desc',
  });
}
