"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import { mockPosts, getAllTags } from "@/lib/mockData";
import { Filter, TrendingUp, Clock } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-600 to-purple-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Community Posts
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-orange-100">
              Discover insights, experiences, and projects shared by our vibrant community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <div className="mb-8 space-y-6">
            {/* Tag Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Filter size={20} className="text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filter by Tag
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedTag === tag
                        ? "bg-orange-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tag === "All" ? tag : `#${tag}`}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Sort Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Sort by:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("newest")}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    sortBy === "newest"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <Clock size={16} />
                  Newest
                </button>
                <button
                  onClick={() => setSortBy("popular")}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    sortBy === "popular"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <TrendingUp size={16} />
                  Popular
                </button>
              </div>
            </motion.div>
          </div>

          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 text-sm text-gray-600 dark:text-gray-400"
          >
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          </motion.p>

          {/* Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No posts found with this tag.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
