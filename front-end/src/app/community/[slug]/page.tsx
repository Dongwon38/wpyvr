import Link from "next/link"
import { notFound } from "next/navigation"
import HubPostDetail from "@/components/hub/HubPostDetail"
import { fetchHubPost, fetchHubPosts } from "@/lib/hubApi"

type RawParams = { slug: string }
type RouteParams = RawParams | Promise<RawParams>

async function resolveParams(params: RouteParams): Promise<RawParams> {
  return await params
}

async function getPostFromParams(params: RouteParams) {
  const { slug } = await resolveParams(params)
  return fetchHubPost(slug, { onlyPushed: true })
}

export async function generateMetadata({ params }: { params: RouteParams }) {
  const post = await getPostFromParams(params)
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
  const posts = await fetchHubPosts("latest", 20, 1, { onlyPushed: true })
  return posts.map((post) => ({ slug: post.slug && post.slug.trim() ? post.slug : post.id.toString() }))
}

export default async function CommunityPostPage({ params }: { params: RouteParams }) {
  const post = await getPostFromParams(params)
  if (!post) {
    notFound()
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <Link href="/community" className="text-sm font-medium text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200">
          ← Back to Community
        </Link>
      </div>

      <HubPostDetail post={post} />
    </div>
  )
}
