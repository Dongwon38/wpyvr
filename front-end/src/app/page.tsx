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
      <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Hero Section */}
        <HeroSection />

      {/* Events Section */}
        <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
                <div className="mb-2 flex items-center gap-2">
                  <Calendar className="text-[#00749C]" size={24} />
                  <h2 className="text-2xl font-black tracking-tight text-[#444140]">
                  Events
                </h2>
              </div>
              <p className="text-sm text-[#444140]/70">
                Latest upcoming and past events
              </p>
            </motion.div>
            <Link
              href="/events"
                className="hidden items-center gap-2 text-sm font-semibold text-[#00749C] transition-colors hover:text-[#005A7A] sm:flex"
            >
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Events Grid */}
          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00749C]/20 border-t-[#00749C]"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#00749C]/15 bg-[#FFFDF9] p-12 text-center shadow-md">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-[#00749C]/40" />
              <p className="text-[#444140]/70">
                No events yet. Check back soon!
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00749C] transition-colors hover:text-[#005A7A]"
            >
              View All Events
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Community Highlights Section */}
        <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="mb-2 flex items-center gap-2">
              <Users className="text-[#00749C]" size={24} />
                <h2 className="text-2xl font-black tracking-tight text-[#444140]">
                Community Posts
              </h2>
            </div>
            <p className="text-sm text-[#444140]/70">
              Discover what our community is sharing
            </p>
          </motion.div>

          {/* Trending Posts Slider */}
          <div className="mb-12">
            <PostSlider
              posts={trendingPosts}
              title="Trending Posts"
              icon={<TrendingUp className="text-[#00749C]" size={20} />}
            />
          </div>

          {/* Recent Posts Slider */}
          <div>
            <PostSlider
              posts={recentPosts}
              title="Recent Posts"
              icon={<Clock className="text-[#00749C]" size={20} />}
            />
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
        <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2 flex items-center gap-2">
                <FileText className="text-[#00749C]" size={24} />
                <h2 className="text-2xl font-black tracking-tight text-[#444140]">
                  Latest Articles
                </h2>
              </div>
              <p className="text-sm text-[#444140]/70">
                In-depth tutorials and insights from our editorial team
              </p>
            </motion.div>
            <Link
              href="/blog"
                className="hidden items-center gap-2 text-sm font-semibold text-[#00749C] transition-colors hover:text-[#005A7A] sm:flex"
            >
              View All Articles
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Loading State */}
          {blogLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00749C]/20 border-t-[#00749C]"></div>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <BlogListItem key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#00749C]/15 bg-[#FFFDF9] p-12 text-center shadow-md">
              <FileText className="mx-auto mb-4 h-12 w-12 text-[#00749C]/40" />
              <p className="text-[#444140]/70">
                No blog posts yet. Check back soon!
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00749C] transition-colors hover:text-[#005A7A]"
            >
              View All Articles
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
        <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="text-[#00749C]" size={28} />
              <h2 className="text-2xl font-black text-[#444140]">
                Why Join Our Community?
              </h2>
            </div>
            <p className="mb-10 text-sm text-[#444140]/70">
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
                className="rounded-3xl border border-[#00749C]/10 bg-white p-8 text-center shadow-md"
              >
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-black text-[#444140]">
                  {feature.title}
                </h3>
                <p className="text-[#444140]/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
        <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8" style={{backgroundImage: "linear-gradient(130deg, #031926 0%, #00749C 48%, #00B7D3 100%)"}}>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-4xl font-black text-white sm:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-xl font-light text-white/90">
              Join our community today and start your journey with fellow creators
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-[#00749C] shadow-xl shadow-black/25 transition-all hover:-translate-y-0.5 hover:bg-white/95 sm:w-auto">
                Create Free Account
              </button>
              <button className="w-full rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

        {/* Contact Form Section */}
          <section id="contact" className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
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
              <p className="mx-auto max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                Reach our volunteer organizers if you’d like a referral to a local freelancer, need quick WordPress guidance, or just have a question about the community. We typically respond within 24 hours.
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
