"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ArticleCard from "@/components/ArticleCard";
import { mockGuides, getAllCategories } from "@/lib/mockData";
import { Filter } from "lucide-react";

export default function GuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...getAllCategories()];

  const filteredGuides = selectedCategory === "All"
    ? mockGuides
    : mockGuides.filter(guide => guide.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Expert Guides & Tutorials
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100">
              Learn from comprehensive guides written by industry experts. 
              From beginner tutorials to advanced techniques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <Filter size={20} className="text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filter by Category
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 text-sm text-gray-600 dark:text-gray-400"
          >
            Showing {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'}
          </motion.p>

          {/* Guides Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide, index) => (
              <ArticleCard key={guide.slug} guide={guide} index={index} />
            ))}
          </div>

          {/* Empty State */}
          {filteredGuides.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No guides found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
