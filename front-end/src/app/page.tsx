"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import BlogListItem from "@/components/BlogListItem";
import PostSlider from "@/components/PostSlider";
import EventCard, { EventCardData } from "@/components/EventCard";
import { mockPosts } from "@/lib/mockData";
import { fetchEventsSortedByDate } from "@/lib/eventsApi";
import { fetchLatestBlogPosts, type BlogPost as ApiBlogPost } from "@/lib/blogApi";
import { FileText, Users, ArrowRight, Calendar, Sparkles, TrendingUp, Clock, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";

// Blog post format for component
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  categories?: string[];
  readTime: string;
}

export default function Home() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  
  // Get trending posts and recent posts
  const trendingPosts = [...mockPosts].sort((a, b) => b.upvotes - a.upvotes);
  const recentPosts = [...mockPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEventsSortedByDate();
        setEvents(data.slice(0, 3)); // Show latest 3 events on home page
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setEventsLoading(false);
      }
    }

    async function loadBlogPosts() {
      try {
        const data = await fetchLatestBlogPosts(3);
        
        if (data.length > 0) {
          const transformedPosts: BlogPost[] = data.map(post => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            author: post.author,
            readTime: post.readTime,
          }));
          setBlogPosts(transformedPosts);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setBlogLoading(false);
      }
    }

    loadEvents();
    loadBlogPosts();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Events Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Events
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest upcoming and past events
              </p>
            </motion.div>
            <Link
              href="/events"
                className="hidden items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:flex"
            >
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Events Grid */}
          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-100 p-12 text-center dark:bg-gray-700">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No events yet. Check back soon!
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/events"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Community Highlights Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="mb-2 flex items-center gap-2">
              <Users className="text-orange-600" size={24} />
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Community Posts
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover what our community is sharing
            </p>
          </motion.div>

          {/* Trending Posts Slider */}
          <div className="mb-12">
            <PostSlider
              posts={trendingPosts}
              title="Trending Posts"
              icon={<TrendingUp className="text-orange-500" size={20} />}
            />
          </div>

          {/* Recent Posts Slider */}
          <div>
            <PostSlider
              posts={recentPosts}
              title="Recent Posts"
              icon={<Clock className="text-blue-500" size={20} />}
            />
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2 flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Latest Articles
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                In-depth tutorials and insights from our editorial team
              </p>
            </motion.div>
            <Link
              href="/blog"
                className="hidden items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:flex"
            >
              View All Articles
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Loading State */}
          {blogLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <BlogListItem key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-100 p-12 text-center dark:bg-gray-700">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No blog posts yet. Check back soon!
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Articles
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="text-yellow-500" size={28} />
              <h2 className="text-2xl font-normal text-gray-900 dark:text-white">
                Why Join Our Community?
              </h2>
            </div>
            <p className="mb-10 text-sm text-gray-600 dark:text-gray-400">
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

        {/* Contact Form Section */}
        <section id="contact" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <Mail className="text-blue-600" size={28} />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Contact Us
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Have a question or suggestion? We'd love to hear from you.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
