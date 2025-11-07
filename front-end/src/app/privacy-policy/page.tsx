"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { fetchPageBySlug } from "@/lib/pagesApi";
import type { Page } from "@/lib/pagesApi";

export default function PrivacyPolicyPage() {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        const data = await fetchPageBySlug('privacy-policy');
        setPage(data);
      } catch (error) {
        console.error('Failed to load page:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-12 text-center shadow-md dark:bg-gray-800">
            <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist or hasn't been created yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-600 p-3 text-white dark:bg-green-500">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
                {page.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date(page.modified).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl bg-white p-8 shadow-md dark:bg-gray-800 sm:p-12"
        >
          <article
            className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-green-600 prose-a:no-underline hover:prose-a:text-green-700 hover:prose-a:underline
              dark:prose-a:text-green-400 dark:hover:prose-a:text-green-300
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-img:rounded-lg prose-img:shadow-md
              prose-code:text-green-600 dark:prose-code:text-green-400
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-blockquote:border-l-green-600 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Questions about this policy? <Link href="/about" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">Contact us</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
