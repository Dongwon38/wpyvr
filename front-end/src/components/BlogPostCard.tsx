"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  featuredImage?: string;
  categories?: string[];
  readTime?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  index?: number;
}

export default function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-800"
    >
      {/* Featured Image */}
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <div className="text-8xl opacity-20">📝</div>
            </div>
          )}
          
          {/* Category Badge */}
            {post.categories && post.categories.length > 0 && (
              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-900 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-white">
                {post.categories[0]}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Meta Information */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          {post.readTime && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{post.readTime}</span>
              </div>
            </>
          )}
        </div>

        {/* Title */}
          <Link href={`/blog/${post.slug}`} className="group/title">
            <h3 className="mb-3 text-xl font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover/title:text-blue-600 dark:text-white dark:group-hover/title:text-blue-400">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
          <p className="mb-4 flex-1 font-light text-gray-600 dark:text-gray-300 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author and Read More */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                {post.author.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {post.author.name}
            </span>
          </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read More
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
