"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BlogListItem from "@/components/BlogListItem";
import { BlogPost } from "@/components/BlogPostCard";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get all unique categories
  const allCategories = ["All", ...new Set(mockBlogPosts.flatMap(post => post.categories || []))];

  // Filter posts by category
  const filteredPosts = selectedCategory === "All"
    ? mockBlogPosts
    : mockBlogPosts.filter(post => post.categories?.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="border-b border-gray-200 px-4 py-8 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="mb-3 text-3xl font-normal text-gray-900 dark:text-white">
              Blog
            </h1>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
              Insights, tutorials, and stories from our editorial team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter */}
          <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4 dark:border-gray-800">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-sm font-normal transition-colors ${
                  selectedCategory === category
                    ? "text-gray-900 underline decoration-blue-500 decoration-2 underline-offset-4 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-500">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </p>

          {/* Blog Posts Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <BlogListItem key={post.id} post={post} index={index} />
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-base text-gray-500 dark:text-gray-500">
                No posts found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
