import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, ArrowUp } from "lucide-react";
import { mockPosts, getPostBySlug } from "@/lib/mockData";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <section className="border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-sm font-normal text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back to Community
          </Link>
        </div>
      </section>

      {/* Article */}
      <article className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Title */}
          <h1 className="mb-6 text-3xl font-normal leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-500">
            {/* Author */}
            <div className="flex items-center gap-2">
              <span className="text-base">{post.avatar || "👤"}</span>
              <span className="font-normal">{post.author}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span className="font-normal">
                {new Date(post.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>

            {/* Upvotes */}
            <div className="flex items-center gap-1.5">
              <ArrowUp size={14} className="text-orange-500" />
              <span className="font-normal">{post.upvotes} upvotes</span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-normal text-gray-400 dark:text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {post.content ? (
              <div className="whitespace-pre-line text-base leading-relaxed text-gray-700 dark:text-gray-300">
                {post.content}
              </div>
            ) : (
              <div className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                <p className="mb-4">
                  {post.excerpt}
                </p>
                <p className="mb-4">
                  This is a detailed community post where {post.author} shares their 
                  experience and insights about {post.title.toLowerCase()}. The community 
                  has found this content valuable, as shown by the upvotes.
                </p>
                <p className="italic text-gray-500 dark:text-gray-500">
                  [Full content would be fetched from WP REST API here]
                </p>
              </div>
            )}
          </div>

          {/* Interaction Section */}
          <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-normal text-white transition-colors hover:bg-orange-700">
                <ArrowUp size={16} />
                Upvote
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-normal text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800">
                Share
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
