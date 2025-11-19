import HubTabs from "@/components/hub/HubTabs"
import { fetchHubPosts } from "@/lib/hubApi"

export const metadata = {
  title: "Community Hub",
  description: "Browse real-time posts pushed from member sites after moderation.",
}

export default async function CommunityPage() {
  const latestPosts = await fetchHubPosts("latest", 9, 1, { onlyPushed: true })

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-wide text-sky-500">WPYVR Community</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Community Highlights</h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Explore latest, popular, and trending content sourced directly from member sites.
        </p>
      </header>

      <HubTabs initialPosts={latestPosts} onlyPushed />
    </div>
  )
}
