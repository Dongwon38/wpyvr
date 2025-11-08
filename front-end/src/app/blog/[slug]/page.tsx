import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { fetchBlogPostBySlug, fetchBlogPosts, fetchLatestBlogPosts } from "@/lib/blogApi";
import BlogListItem from "@/components/BlogListItem";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await fetchBlogPosts({ perPage: 100 });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch recent posts for recommendations (excluding current post)
  const allRecentPosts = await fetchLatestBlogPosts(4);
  const recentPosts = allRecentPosts
    .filter(p => p.slug !== slug)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      author: p.author,
      readTime: p.readTime,
    }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <section className="border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-normal text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Article */}
      <article className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="mb-6 text-3xl font-normal leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-500">
            {/* Author */}
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <span className="text-base">✍️</span>
              )}
              <span className="font-normal">{post.author.name}</span>
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

            {/* Read Time */}
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span className="font-normal">{post.readTime}</span>
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back to Blog Button */}
          <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-normal text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={16} />
              Back to All Articles
            </Link>
          </div>
        </div>
      </article>

      {/* Recent Posts Section */}
      {recentPosts.length > 0 && (
        <section className="border-t border-gray-200 px-4 py-12 dark:border-gray-800 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-normal text-gray-900 dark:text-white">
                  Recent Articles
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Continue reading more from our blog
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:flex"
              >
                View All
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((recentPost, index) => (
                <BlogListItem key={recentPost.id} post={recentPost} index={index} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View All Articles
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
