"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowUp, User } from "lucide-react";
import { Post } from "@/lib/mockData";

interface PostListItemProps {
  post: Post;
  index?: number;
}

export default function PostListItem({ post, index = 0 }: PostListItemProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group border-b border-gray-200 py-6 dark:border-gray-800"
    >
      <div className="flex flex-col gap-3">
        {/* Title */}
        <Link href={`/community/${post.slug}`} className="group/title">
          <h2 className="text-2xl font-normal text-gray-900 transition-colors group-hover/title:text-blue-600 dark:text-white dark:group-hover/title:text-blue-400">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          {/* Author */}
          <div className="flex items-center gap-2">
            <span className="text-base">{post.avatar || "👤"}</span>
            <span className="font-normal">{post.author}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span className="font-normal">
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>

          {/* Upvotes */}
          <div className="flex items-center gap-1.5">
            <ArrowUp size={14} className="text-orange-500" />
            <span className="font-normal">{post.upvotes}</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-normal text-gray-400 dark:text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
