"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, MessageCircle, Heart, Users, BookOpen, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              About Community Hub
            </h1>
            <p className="text-xl text-blue-100">
              A place where ideas, tools, and people meet
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl bg-white p-8 shadow-md dark:bg-gray-800 md:p-12"
          >
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
              Our Mission
            </h2>
            <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
              <p>
                Community Hub is a modern web community designed for creators, developers, 
                and writers who want to learn, share, and grow together.
              </p>
              <p>
                We believe in the power of collaborative learning and the strength of shared 
                knowledge. Our platform brings together expert editorial content with authentic 
                community experiences to create a comprehensive resource for web professionals.
              </p>
              <p>
                Whether you're just starting your journey or you're an experienced professional 
                looking to share your expertise, you'll find a welcoming space here to connect, 
                learn, and contribute.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-white px-4 py-16 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to learn and grow
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Expert Guides",
                description: "Comprehensive tutorials and articles written by industry experts covering everything from basics to advanced topics.",
                color: "text-blue-600"
              },
              {
                icon: Users,
                title: "Active Community",
                description: "Connect with thousands of creators and developers. Share your experiences and learn from others.",
                color: "text-purple-600"
              },
              {
                icon: TrendingUp,
                title: "Trending Content",
                description: "Stay up to date with the latest trends, tools, and best practices in web development and design.",
                color: "text-orange-600"
              },
              {
                icon: MessageCircle,
                title: "Discussions",
                description: "Engage in meaningful conversations about web development, design, and technology.",
                color: "text-green-600"
              },
              {
                icon: Heart,
                title: "Support System",
                description: "Get help when you need it and help others on their journey. We grow together.",
                color: "text-pink-600"
              },
              {
                icon: Mail,
                title: "Newsletter",
                description: "Stay informed with curated content delivered to your inbox weekly.",
                color: "text-indigo-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-900"
              >
                <feature.icon className={`mb-4 ${feature.color}`} size={32} />
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

      {/* Join Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-center shadow-xl md:p-12"
          >
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ready to Join?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Become part of our growing community of creators, developers, and learners.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/guides"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-gray-100 sm:w-auto"
              >
                <BookOpen size={20} />
                Explore Guides
              </Link>
              <Link
                href="/community"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-white/10 sm:w-auto"
              >
                <Users size={20} />
                Join Community
              </Link>
            </div>

            {/* Contact Options */}
            <div className="mt-12 border-t border-white/20 pt-8">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-100">
                Stay Connected
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:hello@communityhub.example"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <Mail size={16} />
                  Email Us
                </a>
                <a
                  href="https://discord.gg/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <MessageCircle size={16} />
                  Join Discord
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
