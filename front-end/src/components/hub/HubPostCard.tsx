"use client"

import Link from "next/link"
import Image from "next/image"
import type { HubPost } from "@/lib/hubApi"

type Props = {
  post: HubPost
}

const HubPostCard = ({ post }: Props) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {post.featuredImage ? (
        <Link href={`/community/${post.slug}`} className="relative block h-56 w-full">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
      ) : (
        <div className="h-56 bg-slate-100 dark:bg-slate-800" />
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          {post.sourceSite && <span>{post.sourceSite.replace(/^https?:\/\//, "")}</span>}
        </div>

        <Link href={`/community/${post.slug}`} className="text-lg font-semibold leading-tight text-slate-900 dark:text-white">
          {post.title}
        </Link>

        <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">{post.excerpt || "원문에서 제공된 요약이 없습니다."}</p>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            ❤️ {post.likesCount} · 💬 {post.commentsCount}
          </span>
          <span>🔥 {post.hotScore.toFixed(1)}</span>
        </div>
      </div>
    </article>
  )
}

export default HubPostCard
