"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowUp, User } from "lucide-react";
import { Post } from "@/lib/mockData";
import TagChip from "./TagChip";

interface PostCardProps {
  post: Post;
  index?: number;
}

export default function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-800"
    >
      <div className="flex flex-1 flex-col p-6">
        {/* Author Info */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg">
            {post.avatar || "👤"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-500 dark:text-gray-400" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {post.author}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={12} />
              <span>
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Title and Excerpt */}
        <Link href={`/community/${post.slug}`} className="group/title">
          <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover/title:text-blue-600 dark:text-white dark:group-hover/title:text-blue-400">
            {post.title}
          </h3>
        </Link>

        <p className="mb-4 flex-1 text-gray-600 dark:text-gray-300">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>

        {/* Footer with Upvotes */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <Link
            href={`/community/${post.slug}`}
            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read Full Post →
          </Link>
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            <ArrowUp size={16} className="text-orange-500" />
            <span>{post.upvotes}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
