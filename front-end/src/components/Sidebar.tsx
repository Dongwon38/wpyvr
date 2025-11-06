import Link from "next/link";
import { TrendingUp, Users } from "lucide-react";
import { mockPosts, mockGuides } from "@/lib/mockData";

interface SidebarProps {
  type?: "guides" | "community";
}

export default function Sidebar({ type = "guides" }: SidebarProps) {
  // Get top content based on type
  const relatedContent = type === "guides" 
    ? mockGuides.slice(0, 3)
    : mockPosts.sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

  return (
    <aside className="space-y-6">
      {/* Related Posts/Guides */}
      <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {type === "guides" ? "Related Guides" : "Trending Posts"}
          </h3>
        </div>
        <div className="space-y-4">
          {type === "guides" 
            ? mockGuides.slice(0, 3).map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group block"
                >
                  <h4 className="mb-1 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {guide.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {guide.category}
                  </p>
                </Link>
              ))
            : mockPosts
                .sort((a, b) => b.upvotes - a.upvotes)
                .slice(0, 3)
                .map((post) => (
                  <Link
                    key={post.slug}
                    href={`/community/${post.slug}`}
                    className="group block"
                  >
                    <h4 className="mb-1 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.upvotes} upvotes</span>
                    </div>
                  </Link>
                ))}
        </div>
      </div>

      {/* Top Contributors (for community) */}
      {type === "community" && (
        <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Top Contributors
            </h3>
          </div>
          <div className="space-y-3">
            {["Alex K", "Jamie L", "Sam Chen", "Maya Rodriguez"].map((name, index) => (
              <div key={name} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.floor(Math.random() * 50) + 10} posts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white shadow-md">
        <h3 className="mb-2 text-lg font-bold">
          {type === "guides" ? "Want to Contribute?" : "Join the Discussion"}
        </h3>
        <p className="mb-4 text-sm opacity-90">
          {type === "guides"
            ? "Share your expertise and help others learn."
            : "Connect with fellow creators and share your journey."}
        </p>
        <button className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-gray-100">
          Get Started
        </button>
      </div>
    </aside>
  );
}
