import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { mockGuides, getGuideBySlug } from "@/lib/mockData";
import Sidebar from "@/components/Sidebar";

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all guides
export async function generateStaticParams() {
  return mockGuides.map((guide) => ({
    slug: guide.slug,
  }));
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white px-4 py-12 dark:border-gray-800 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/guides"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            Back to Guides
          </Link>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Tag size={14} />
              {guide.category}
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            {guide.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="font-medium">{guide.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {new Date(guide.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <article className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-8 shadow-md dark:bg-gray-800">
                {/* Featured Image Placeholder */}
                <div className="mb-8 h-64 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-8xl opacity-20">📚</div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {guide.content ? (
                    <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {guide.content}
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4 text-gray-700 dark:text-gray-300">
                        {guide.excerpt}
                      </p>
                      <p className="mb-4 text-gray-700 dark:text-gray-300">
                        This is a comprehensive guide that will walk you through everything 
                        you need to know about {guide.title.toLowerCase()}. Our expert team 
                        has compiled best practices, tips, and real-world examples to help 
                        you succeed.
                      </p>
                      <p className="text-gray-500 italic dark:text-gray-400">
                        [Full content would be fetched from WP REST API here]
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <Sidebar type="guides" />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
