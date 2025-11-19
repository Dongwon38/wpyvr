"use client"

import { FormEvent, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { submitHubComment } from "@/lib/hubApi"

type Props = {
  postId: number
  onSubmitSuccess?: () => void
}

const HubCommentForm = ({ postId, onSubmitSuccess }: Props) => {
  const { user } = useAuth()
  const [author, setAuthor] = useState(user?.displayName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!content.trim()) {
      setError("Please enter a comment.")
      return
    }

    setStatus("submitting")
    setError(null)

    try {
      const token = user ? await user.getIdToken() : undefined
        await submitHubComment({
          postId,
          author: author || "Anonymous",
          email: email || "no-reply@example.com",
          content,
          token,
        })

      setContent("")
      setStatus("success")
      onSubmitSuccess?.()
    } catch (err) {
      console.error(err)
        setError("There was a problem submitting your comment.")
      setStatus("error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          disabled={!!user}
        />
      </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          disabled={!!user}
        />
      </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Comment</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 h-32 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </div>
        {error && <p className="text-xs text-rose-500">{error}</p>}
        {status === "success" && <p className="text-xs text-emerald-600">Your comment has been posted.</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
      >
          Submit Comment
      </button>
    </form>
  )
}

export default HubCommentForm
