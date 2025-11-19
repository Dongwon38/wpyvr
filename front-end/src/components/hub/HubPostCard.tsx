"use client"

import Link from "next/link"
import Image from "next/image"
import type { HubPost } from "@/lib/hubApi"

type Props = {
  post: HubPost
}

const HubPostCard = ({ post }: Props) => {
  const author = post.sourceAuthor || post.author || "Unknown member"
  const identifier = post.slug?.trim() ? post.slug : post.id.toString()

  return (
    <Link href={`/community/${identifier}`} className="block group">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
        {post.featuredImage ? (
          <div className="relative h-56 w-full">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800">
            <Image
              src="/images/img1.jpg"
              alt="Community placeholder"
              fill
              className="object-cover opacity-70"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            {post.sourceSite && <span>{post.sourceSite.replace(/^https?:\/\//, "")}</span>}
          </div>

          <h3 className="text-lg font-semibold leading-tight text-slate-900 transition-colors group-hover:text-sky-600 dark:text-white">
            {post.title}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Posted by <span className="font-medium text-slate-700 dark:text-slate-200">{author}</span>
          </p>

          <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">{post.excerpt || "No summary was provided for this post."}</p>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              ❤️ {post.likesCount} · 💬 {post.commentsCount}
            </span>
            <span>🔥 {post.hotScore.toFixed(1)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default HubPostCard
