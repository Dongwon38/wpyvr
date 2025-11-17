"use client"

import HubLikeButton from "./HubLikeButton"
import HubCommentForm from "./HubCommentForm"
import type { HubPost } from "@/lib/hubApi"

type Props = {
  post: HubPost
}

const HubPostDetail = ({ post }: Props) => {
  const author = post.sourceAuthor || post.author || "Unknown member"

  return (
    <article className="space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-6 dark:border-slate-800">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{post.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
          {new Date(post.date).toLocaleString()} · Posted by {author}
          {post.sourceSite && (
            <>
              {" "}
              · <span>Source: {post.sourceSite}</span>
            </>
          )}
          </p>
        <HubLikeButton postId={post.id} initialLikes={post.likesCount} initialComments={post.commentsCount} initialHotScore={post.hotScore} />
      </div>

      <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />

        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Leave a Comment</h2>
        <HubCommentForm postId={post.id} />
      </section>
    </article>
  )
}

export default HubPostDetail
