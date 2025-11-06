"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ArticleCard from "@/components/ArticleCard";
import PostCard from "@/components/PostCard";
import { mockGuides, mockPosts } from "@/lib/mockData";
import { BookOpen, Users, ArrowRight } from "lucide-react";

export default function Home() {
  // Get latest guides and trending posts
  const latestGuides = mockGuides.slice(0, 3);
  const trendingPosts = mockPosts.sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection />

      {/* Latest Guides Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2 flex items-center gap-2">
                <BookOpen className="text-blue-600" size={24} />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Latest Guides
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Expert tutorials and articles from our editorial team
              </p>
            </motion.div>
            <Link
              href="/guides"
              className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:flex"
            >
              View All Guides
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestGuides.map((guide, index) => (
              <ArticleCard key={guide.slug} guide={guide} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Guides
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Community Highlights Section */}
      <section className="bg-white px-4 py-16 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Users className="text-orange-600" size={24} />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Trending Community Posts
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Popular posts from our community members
              </p>
            </motion.div>
            <Link
              href="/community"
              className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:flex"
            >
              View All Posts
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Posts
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Why Join Our Community?
            </h2>
            <p className="mb-12 text-gray-600 dark:text-gray-400">
              Everything you need to learn, grow, and connect
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "📚",
                title: "Expert Content",
                description: "Access high-quality guides and tutorials written by industry experts."
              },
              {
                icon: "🤝",
                title: "Active Community",
                description: "Connect with thousands of creators, developers, and designers."
              },
              {
                icon: "🚀",
                title: "Share & Learn",
                description: "Share your knowledge and learn from others' experiences."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl bg-white p-8 text-center shadow-md dark:bg-gray-800"
              >
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
