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
import { FileText, ArrowRight, Calendar, Sparkles, TrendingUp, Clock, Mail } from "lucide-react";
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
        <HeroSection />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
          {/* Events Section */}
          <section className="rounded-[32px] border border-[#E4EBEF] bg-white/95 p-6 shadow-sm shadow-[#031926]/5 sm:p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#00749C]">
                  Events & meetups
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#1F1C1A]">
                  Upcoming field notes
                </h2>
                <p className="text-sm text-[#6B6663]">
                  Latest workshops and gatherings from the Vancouver WordPress
                  crew.
                </p>
              </motion.div>
              <Link
                href="/events"
                className="hidden items-center gap-2 text-sm font-semibold text-[#00749C] transition hover:text-[#005f7a] sm:inline-flex"
              >
                View all events
                <ArrowRight size={16} />
              </Link>
            </div>

            {eventsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E4EBEF] border-t-[#00B4D8]" />
              </div>
            ) : events.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {events.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#E4EBEF] bg-[#F8FBFC] p-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-[#B8C4C9]" />
                <p className="text-sm text-[#6B6663]">
                  No events yet. Check back soon!
                </p>
              </div>
            )}

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00749C] transition hover:text-[#005f7a]"
              >
                View all events
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Community Highlights Section */}
          <section className="rounded-[32px] border border-[#E4EBEF] bg-white/95 p-6 shadow-sm shadow-[#031926]/5 sm:p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#00749C]">
                Community pulse
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#1F1C1A]">
                Threads we are amplifying
              </h2>
              <p className="text-sm text-[#6B6663]">
                Discover what members are shipping, sharing, and remixing.
              </p>
            </motion.div>

            <div className="mb-10">
              <PostSlider
                posts={trendingPosts}
                title="Trending Posts"
                icon={<TrendingUp className="text-[#00B4D8]" size={20} />}
              />
            </div>

            <PostSlider
              posts={recentPosts}
              title="Recent Posts"
              icon={<Clock className="text-[#F2994A]" size={20} />}
            />
          </section>

          {/* Latest Blog Posts Section */}
          <section className="rounded-[32px] border border-[#E4EBEF] bg-white/95 p-6 shadow-sm shadow-[#031926]/5 sm:p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#00749C]">
                  Editorial desk
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#1F1C1A]">
                  Latest articles
                </h2>
                <p className="text-sm text-[#6B6663]">
                  In-depth tutorials and insights from our editorial team.
                </p>
              </motion.div>
              <Link
                href="/blog"
                className="hidden items-center gap-2 text-sm font-semibold text-[#00749C] transition hover:text-[#005f7a] sm:inline-flex"
              >
                View all articles
                <ArrowRight size={16} />
              </Link>
            </div>

            {blogLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E4EBEF] border-t-[#00749C]" />
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post, index) => (
                  <BlogListItem key={post.id} post={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#E4EBEF] bg-[#F8FBFC] p-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-[#B8C4C9]" />
                <p className="text-sm text-[#6B6663]">
                  No blog posts yet. Check back soon!
                </p>
              </div>
            )}

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00749C] transition hover:text-[#005f7a]"
              >
                View all articles
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="rounded-[32px] border border-[#E4EBEF] bg-white/95 p-6 shadow-sm shadow-[#031926]/5 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-3 flex items-center justify-center gap-2 text-[#00749C]">
                <Sparkles size={24} />
                <p className="text-[10px] font-semibold uppercase tracking-[0.5em]">
                  Why join
                </p>
              </div>
              <h2 className="text-3xl font-black text-[#1F1C1A]">
                Everything you need to learn, grow, and connect
              </h2>
            </motion.div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: "📚",
                  title: "Expert content",
                  description:
                    "High-quality guides and tutorials written by industry experts.",
                },
                {
                  icon: "🤝",
                  title: "Active community",
                  description:
                    "Connect with creators, developers, and designers in Vancouver.",
                },
                {
                  icon: "🚀",
                  title: "Share & learn",
                  description:
                    "Show your work, gather feedback, and collaborate on new ideas.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-3xl border border-[#E4EBEF] bg-[#F8FBFC] p-6 text-center shadow-sm shadow-[#031926]/5"
                >
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-[#1F1C1A]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#6B6663]">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-[32px] border border-[#0B3B52] bg-gradient-to-br from-[#041A26] via-[#03384B] to-[#00749C] px-6 py-14 text-white shadow-[0_45px_80px_rgba(0,0,0,0.35)] sm:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-4xl font-black sm:text-5xl">
                Ready to plug into the palette?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">
                Join today and start building with the refreshed WordPress teal
                system, community meetups, and gradient-ready decks.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-[#00749C] shadow-[0_20px_45px_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5 hover:bg-white/95 sm:w-auto">
                  Create free account
                </button>
                <button className="w-full rounded-full border border-white/40 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto">
                  Learn more
                </button>
              </div>
            </motion.div>
          </section>

          {/* Contact Form Section */}
          <section
            id="contact"
            className="rounded-[32px] border border-[#E4EBEF] bg-white/95 p-6 shadow-sm shadow-[#031926]/5 sm:p-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#00749C]">
                Contact
              </p>
              <div className="mt-3 flex flex-col items-center gap-2">
                <Mail className="text-[#00749C]" size={28} />
                <h2 className="text-3xl font-black text-[#1F1C1A]">
                  Need a quick hand?
                </h2>
              </div>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6B6663]">
                Reach our volunteer organizers for freelancer referrals,
                WordPress guidance, or general questions. We typically respond
                within 24 hours.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <ContactForm />
            </motion.div>
          </section>
        </div>
      </div>
    );
}
