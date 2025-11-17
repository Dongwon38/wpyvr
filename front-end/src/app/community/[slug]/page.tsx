import Link from "next/link"
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
      title: "Community Post",
    }
  }

  return {
    title: `${post.title} | Community`,
    description: post.excerpt || "Community post detail",
  }
}

export async function generateStaticParams() {
  const posts = await fetchHubPosts("latest", 20)
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function CommunityPostPage({ params }: Props) {
  const post = await fetchHubPostBySlug(params.slug)
  if (!post) {
    notFound()
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <Link href="/community" className="text-sm font-medium text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200">
          ← 커뮤니티 목록으로
        </Link>
      </div>

      <HubPostDetail post={post} />
    </div>
  )
}
