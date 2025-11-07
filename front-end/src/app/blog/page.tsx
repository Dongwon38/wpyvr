"use client";

import { motion } from "framer-motion";
import BlogPostCard, { BlogPost } from "@/components/BlogPostCard";

// Mock blog posts data - Ready for WordPress API integration
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "getting-started-with-wordpress-headless",
    title: "Getting Started with WordPress Headless CMS",
    excerpt: "Learn how to build modern web applications using WordPress as a headless CMS. This comprehensive guide covers everything from setup to deployment.",
    date: "2024-01-15",
    author: {
      name: "Sarah Johnson",
      avatar: undefined,
    },
    categories: ["Tutorial", "WordPress"],
    readTime: "8 min read",
  },
  {
    id: 2,
    slug: "building-scalable-nextjs-applications",
    title: "Building Scalable Next.js Applications",
    excerpt: "Discover best practices for creating performant and scalable applications with Next.js 14. From app routing to server components, we cover it all.",
    date: "2024-01-10",
    author: {
      name: "Michael Chen",
      avatar: undefined,
    },
    categories: ["Next.js", "Development"],
    readTime: "12 min read",
  },
  {
    id: 3,
    slug: "modern-ui-design-principles",
    title: "Modern UI Design Principles for 2024",
    excerpt: "Explore the latest trends in UI/UX design and learn how to create beautiful, user-friendly interfaces that engage and delight your users.",
    date: "2024-01-05",
    author: {
      name: "Emma Rodriguez",
      avatar: undefined,
    },
    categories: ["Design", "UI/UX"],
    readTime: "6 min read",
  },
  {
    id: 4,
    slug: "tailwind-css-tips-and-tricks",
    title: "Tailwind CSS: Tips and Tricks for Developers",
    excerpt: "Master Tailwind CSS with these practical tips and tricks. Learn how to write cleaner code and build responsive designs faster than ever.",
    date: "2023-12-28",
    author: {
      name: "David Park",
      avatar: undefined,
    },
    categories: ["CSS", "Frontend"],
    readTime: "10 min read",
  },
  {
    id: 5,
    slug: "typescript-best-practices-2024",
    title: "TypeScript Best Practices for Modern Development",
    excerpt: "Level up your TypeScript skills with these best practices and patterns. Write safer, more maintainable code for your projects.",
    date: "2023-12-20",
    author: {
      name: "Lisa Anderson",
      avatar: undefined,
    },
    categories: ["TypeScript", "Development"],
    readTime: "9 min read",
  },
  {
    id: 6,
    slug: "api-integration-guide",
    title: "Complete Guide to REST API Integration",
    excerpt: "A comprehensive guide to integrating REST APIs in your applications. Learn about authentication, error handling, and best practices.",
    date: "2023-12-15",
    author: {
      name: "James Wilson",
      avatar: undefined,
    },
    categories: ["API", "Backend"],
    readTime: "15 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Insights, tutorials, and stories from our community. Stay updated with the latest in web development and design.
          </p>
        </motion.div>

        {/* Featured Post (First Post) */}
        {mockBlogPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-1 shadow-xl">
              <div className="rounded-xl bg-white dark:bg-gray-800">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Featured Image */}
                  <div className="relative h-64 overflow-hidden rounded-l-xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 md:h-auto">
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-9xl opacity-20">⭐</div>
                    </div>
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Featured Content */}
                  <div className="flex flex-col justify-center p-8">
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {mockBlogPosts[0].categories?.[0]}
                      </span>
                      <span>•</span>
                      <span>{mockBlogPosts[0].readTime}</span>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                      {mockBlogPosts[0].title}
                    </h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">
                      {mockBlogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                          {mockBlogPosts[0].author.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {mockBlogPosts[0].author.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(mockBlogPosts[0].date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`/blog/${mockBlogPosts[0].slug}`}
                        className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
                      >
                        Read Article
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockBlogPosts.slice(1).map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index + 1} />
          ))}
        </div>

        {/* Placeholder for Pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <span>More posts coming soon...</span>
          </div>
        </motion.div>

        {/* API Integration Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 <strong>Developer Note:</strong> This page is ready for WordPress REST API integration.
            Connect to <code className="rounded bg-gray-200 px-2 py-1 dark:bg-gray-800">wp-json/wp/v2/posts</code> to fetch real blog data.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
