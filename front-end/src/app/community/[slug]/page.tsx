import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft, ArrowUp } from "lucide-react";
import { mockPosts, getPostBySlug } from "@/lib/mockData";
import Sidebar from "@/components/Sidebar";
import TagChip from "@/components/TagChip";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white px-4 py-12 dark:border-gray-800 dark:bg-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/community"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            Back to Community
          </Link>

          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-2xl">
              {post.avatar || "👤"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500 dark:text-gray-400" />
                <p className="font-semibold text-gray-900 dark:text-white">
                  {post.author}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={14} />
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Tags and Upvotes */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              <ArrowUp size={18} className="text-orange-500" />
              <span>{post.upvotes} upvotes</span>
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
                {/* Post Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {post.content ? (
                    <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {post.content}
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4 text-gray-700 dark:text-gray-300">
                        {post.excerpt}
                      </p>
                      <p className="mb-4 text-gray-700 dark:text-gray-300">
                        This is a detailed community post where {post.author} shares their 
                        experience and insights about {post.title.toLowerCase()}. The community 
                        has found this content valuable, as shown by the upvotes.
                      </p>
                      <p className="text-gray-500 italic dark:text-gray-400">
                        [Full content would be fetched from WP REST API here]
                      </p>
                    </div>
                  )}
                </div>

                {/* Interaction Section */}
                <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700">
                      <ArrowUp size={18} />
                      Upvote
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <Sidebar type="community" />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
