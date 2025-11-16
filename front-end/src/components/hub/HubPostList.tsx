"use client"

import HubPostCard from "./HubPostCard"
import type { HubPost } from "@/lib/hubApi"

type Props = {
  posts: HubPost[]
}

const HubPostList = ({ posts }: Props) => {
  if (!posts.length) {
    return <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800">표시할 글이 없습니다. 다른 탭을 선택하거나 나중에 다시 시도하세요.</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <HubPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default HubPostList
