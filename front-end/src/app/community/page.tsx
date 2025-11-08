"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PostListItem from "@/components/PostListItem";
import { mockPosts, getAllTags } from "@/lib/mockData";
import { TrendingUp, Clock } from "lucide-react";

export default function CommunityPage() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  
  const tags = ["All", ...getAllTags()];

  // Filter by tag
  let filteredPosts = selectedTag === "All"
    ? mockPosts
    : mockPosts.filter(post => post.tags.includes(selectedTag));

  // Sort posts
  filteredPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") {
      return b.upvotes - a.upvotes;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="border-b border-gray-200 px-4 py-12 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="mb-3 text-3xl font-normal text-gray-900 dark:text-white">
              Community
            </h1>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
              Insights, experiences, and projects from our community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Toolbar - Filters and Sort */}
          <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            {/* Tag Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-sm font-normal transition-colors ${
                    selectedTag === tag
                      ? "text-gray-900 underline decoration-orange-500 decoration-2 underline-offset-4 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                  }`}
                >
                  {tag === "All" ? tag : `#${tag}`}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => setSortBy("newest")}
                className={`inline-flex items-center gap-1.5 font-normal transition-colors ${
                  sortBy === "newest"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                }`}
              >
                <Clock size={14} />
                Newest
              </button>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <button
                onClick={() => setSortBy("popular")}
                className={`inline-flex items-center gap-1.5 font-normal transition-colors ${
                  sortBy === "popular"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                }`}
              >
                <TrendingUp size={14} />
                Popular
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="mb-6 text-sm font-normal text-gray-500 dark:text-gray-500">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </p>

          {/* Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <PostListItem key={post.slug} post={post} index={index} />
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-base text-gray-500 dark:text-gray-500">
                No posts found with this tag.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
