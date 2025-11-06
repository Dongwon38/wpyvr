"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 px-4 py-20 dark:from-gray-900 dark:via-blue-950 dark:to-orange-950 sm:px-6 lg:px-8 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]" />
      
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:bg-gray-800/50 dark:text-gray-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Join 10,000+ community members
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="block">A place where</span>
            <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              ideas, tools, and people meet
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl"
          >
            Discover expert guides, connect with fellow creators, and share your journey 
            in a vibrant community of developers and designers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/guides"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl sm:w-auto"
            >
              <BookOpen size={20} />
              Read Guides
              <ArrowRight 
                size={20} 
                className="transition-transform group-hover:translate-x-1" 
              />
            </Link>
            <Link
              href="/community"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-lg transition-all hover:border-gray-400 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 sm:w-auto"
            >
              <Users size={20} />
              Join Community
              <ArrowRight 
                size={20} 
                className="transition-transform group-hover:translate-x-1" 
              />
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid gap-8 sm:grid-cols-3"
        >
          {[
            { label: "Expert Guides", value: "100+" },
            { label: "Community Posts", value: "500+" },
            { label: "Active Members", value: "10K+" },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/60 p-6 text-center backdrop-blur-sm dark:bg-gray-800/60"
            >
              <div className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
