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
      <div className="min-h-screen overflow-x-hidden bg-white text-[#444140]">
      {/* Hero Section */}
        <HeroSection />

        {/* Events Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#F1EDE8] bg-white/95 px-6 py-10 shadow-[0_25px_70px_rgba(7,45,59,0.08)] sm:px-10">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D6EEF7] bg-[#F4FBFD] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#00749C]">
                  <Calendar size={16} />
                  Events Pulse
                </div>
                <h2 className="text-3xl font-black text-[#05202C]">
                  Live sessions, workshops, and pop-up collabs
                </h2>
                <p className="mt-2 text-sm text-[#5C5856]">
                  Fresh off the Showcase 1 palette — meetups feel more curated than ever.
                </p>
              </motion.div>
              <Link
                href="/events"
                className="hidden items-center gap-2 text-sm font-semibold text-[#00749C] transition hover:text-[#005f78] sm:flex"
              >
                View all events
                <ArrowRight size={16} />
              </Link>
            </div>

            {eventsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E3EEF5] border-t-[#00749C]" />
              </div>
            ) : events.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {events.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E3EEF5] bg-[#F8FEFF] p-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-[#8BBCCA]" />
                <p className="text-sm text-[#5C5856]">
                  No events yet. Our volunteers are crafting the next teal-forward session.
                </p>
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00749C]"
              >
                View all events
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Community Highlights Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#F1EDE8] bg-white/95 px-6 py-10 shadow-[0_20px_60px_rgba(7,45,59,0.06)] sm:px-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFE5D2] bg-[#FFF7F0] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#C96228]">
                <Users className="h-4 w-4" />
                Community Posts
              </div>
              <h2 className="text-3xl font-black text-[#05202C]">
                Discover what Vancouver WordPress creators are sharing
              </h2>
              <p className="mt-2 text-sm text-[#5C5856]">
                Trending knowledge drops, followed by the freshest posts straight from the hub.
              </p>
            </motion.div>

            <div className="mb-10 rounded-3xl border border-[#FFE5D2] bg-[#FFF9F4] p-4">
              <PostSlider
                posts={trendingPosts}
                title="Trending Posts"
                icon={<TrendingUp className="text-[#C96228]" size={20} />}
              />
            </div>

            <div className="rounded-3xl border border-[#E3EEF5] bg-[#F7FDFF] p-4">
              <PostSlider
                posts={recentPosts}
                title="Recent Posts"
                icon={<Clock className="text-[#00749C]" size={20} />}
              />
            </div>
          </div>
        </section>

        {/* Latest Blog Posts Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#F1EDE8] bg-white/95 px-6 py-10 shadow-[0_20px_60px_rgba(7,45,59,0.06)] sm:px-10">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D6EEF7] bg-[#F4FBFD] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#00749C]">
                  <FileText size={16} />
                  Latest Articles
                </div>
                <h2 className="text-3xl font-black text-[#05202C]">
                  In-depth tutorials and insights from our editorial team
                </h2>
                <p className="mt-2 text-sm text-[#5C5856]">
                  Edited to match the Showcase 1 system — high contrast copy, breathable spacing.
                </p>
              </motion.div>
              <Link
                href="/blog"
                className="hidden items-center gap-2 text-sm font-semibold text-[#00749C] transition hover:text-[#005f78] sm:flex"
              >
                View all articles
                <ArrowRight size={16} />
              </Link>
            </div>

            {blogLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E3EEF5] border-t-[#00749C]" />
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post, index) => (
                  <BlogListItem key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E3EEF5] bg-[#F8FEFF] p-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-[#8BBCCA]" />
                <p className="text-sm text-[#5C5856]">
                  No blog posts yet. Check back soon!
                </p>
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00749C]"
              >
                View all articles
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#F1EDE8] bg-white/95 px-6 py-10 shadow-[0_15px_50px_rgba(7,45,59,0.05)] sm:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D6EEF7] bg-[#F4FBFD] px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#00749C]">
                <Sparkles className="h-4 w-4" />
                Why join our community?
              </div>
              <p className="mb-10 text-sm text-[#5C5856]">
                Everything you need to learn, grow, and connect — styled after Showcase 1.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: "📚",
                  title: "Expert Content",
                  description: "High-quality guides and tutorials written by industry experts.",
                },
                {
                  icon: "🤝",
                  title: "Active Community",
                  description: "Connect with thousands of creators, developers, and designers.",
                },
                {
                  icon: "🚀",
                  title: "Share & Learn",
                  description: "Bring your story, learn from others, and spotlight your craft.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border border-[#E3EEF5] bg-white p-8 text-center shadow-sm"
                >
                  <div className="mb-4 text-5xl">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-[#05202C]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#5C5856]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-[#041523] px-8 py-16 text-white shadow-[0_35px_120px_rgba(3,19,31,0.5)]"
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 18% 22%, rgba(0, 180, 216, 0.55), transparent 45%),
                    radial-gradient(circle at 80% 0%, rgba(0, 116, 156, 0.9), rgba(3, 25, 38, 0.95)),
                    linear-gradient(120deg, #03121C, #063549 55%, #0097C2)
                  `,
                }}
              />
              <div className="relative z-10">
                <h2 className="mb-4 text-4xl font-black sm:text-5xl">
                  Ready to get started?
                </h2>
                <p className="mx-auto mb-8 max-w-3xl text-lg text-white/85">
                  Join our community today and build alongside peers who use the same Showcase 1
                  palette across events, blog posts, and collab threads.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <button className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-[#00749C] shadow-xl shadow-black/30 transition hover:-translate-y-0.5 hover:bg-white/95 sm:w-auto">
                    Create free account
                  </button>
                  <button className="w-full rounded-full border border-white/40 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto">
                    Learn more
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#F1EDE8] bg-white/95 px-6 py-12 shadow-[0_15px_50px_rgba(7,45,59,0.05)] sm:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center"
            >
              <div className="mb-4 flex items-center justify-center gap-2 text-[#00749C]">
                <Mail size={28} />
                <h2 className="text-3xl font-black text-[#05202C]">Contact Us</h2>
              </div>
              <p className="mx-auto max-w-2xl text-sm text-[#5C5856]">
                Reach our volunteer organizers if you’d like a referral to a local freelancer,
                need quick WordPress guidance, or just have a question about the community. We
                typically respond within 24 hours.
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
