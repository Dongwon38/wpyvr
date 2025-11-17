import { notFound } from "next/navigation"
import HubPostDetail from "@/components/hub/HubPostDetail"
import { fetchHubPostBySlug, fetchHubPosts } from "@/lib/hubApi"

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const post = await fetchHubPostBySlug(params.slug)
  if (!post) {
    return {
      title: "Hub Post",
    }
  }

  return {
    title: `${post.title} | WPYVR Hub`,
    description: post.excerpt || "Hub post detail",
  }
}

export async function generateStaticParams() {
  const posts = await fetchHubPosts("latest", 20)
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function HubPostPage({ params }: Props) {
  const post = await fetchHubPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <HubPostDetail post={post} />
    </div>
  )
}
