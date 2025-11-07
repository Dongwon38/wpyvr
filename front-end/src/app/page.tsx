"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ArticleCard from "@/components/ArticleCard";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";
import { mockGuides, mockPosts, getUpcomingEvents, getPastEvents } from "@/lib/mockData";
import { BookOpen, Users, ArrowRight, Calendar, Sparkles } from "lucide-react";

export default function Home() {
  // Get latest guides and trending posts
  const latestGuides = mockGuides.slice(0, 3);
  const trendingPosts = mockPosts.sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
  
  // Get all events sorted by date (upcoming first, then past)
  const allEvents = [...getUpcomingEvents(), ...getPastEvents()].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).reverse(); // Reverse to show upcoming (future dates) first

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Events Section */}
      <section className="bg-white px-4 py-16 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2 flex items-center gap-2">
                <Calendar className="text-purple-600" size={24} />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Community Events
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Join workshops, meetups, and learning sessions
              </p>
            </motion.div>
            <Link
              href="/events"
              className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:flex"
            >
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Community Highlights Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
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

      {/* Latest Guides Section */}
      <section className="bg-white px-4 py-16 dark:bg-gray-800 sm:px-6 lg:px-8">
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
                  Expert Guides
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                In-depth tutorials and articles from our editorial team
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

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-500" size={28} />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Why Join Our Community?
              </h2>
            </div>
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

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-xl text-white/90">
              Join our community today and start your journey with fellow creators
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="w-full rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-xl transition-all hover:bg-gray-100 hover:shadow-2xl sm:w-auto">
                Create Free Account
              </button>
              <button className="w-full rounded-2xl border-2 border-white px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
