"use client"

import { useState, useTransition } from "react"
import { useAuth } from "@/context/AuthContext"
import { likeHubPost, unlikeHubPost, type HubPostStats } from "@/lib/hubApi"

type Props = {
  postId: number
  initialLikes: number
  initialComments?: number
  initialHotScore: number
}

const HubLikeButton = ({ postId, initialLikes, initialComments = 0, initialHotScore }: Props) => {
  const { user } = useAuth()
  const [stats, setStats] = useState<HubPostStats>({
    post_id: postId,
    likes_count: initialLikes,
    comments_count: initialComments,
    hot_score: initialHotScore,
  })
  const [liked, setLiked] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    if (isPending) return

    startTransition(async () => {
      setError(null)
      try {
        const token = user ? await user.getIdToken() : undefined
        const nextStats = liked ? await unlikeHubPost(postId, token) : await likeHubPost(postId, token)
        setStats(nextStats)
        setLiked(!liked)
      } catch (err) {
        console.error(err)
        setError("좋아요 상태를 업데이트하지 못했습니다.")
      }
    })
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
          liked ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-white"
        }`}
      >
        {liked ? "❤️ 좋아요 취소" : "🤍 좋아요"}
        <span className="text-xs">({stats.likes_count})</span>
      </button>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}

export default HubLikeButton
