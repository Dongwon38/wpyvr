"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Guide } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  guide: Guide;
  index?: number;
}

export default function ArticleCard({ guide, index = 0 }: ArticleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-800"
    >
      {/* Category Badge */}
      <div className="absolute right-4 top-4 z-10">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
            guide.category === "Beginner" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            guide.category === "Plugins" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            guide.category === "Design" && "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
            guide.category === "Tutorials" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          )}
        >
          {guide.category}
        </span>
      </div>

      {/* Image Placeholder */}
      <div className="h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900 dark:to-orange-900">
        <div className="flex h-full w-full items-center justify-center transition-transform group-hover:scale-105">
          <div className="text-6xl opacity-20">📚</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/guides/${guide.slug}`} className="group/title">
          <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover/title:text-blue-600 dark:text-white dark:group-hover/title:text-blue-400">
            {guide.title}
          </h3>
        </Link>

        <p className="mb-4 flex-1 text-gray-600 dark:text-gray-300">
          {guide.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{guide.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(guide.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Read More Link */}
        <Link
          href={`/guides/${guide.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Read More
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
