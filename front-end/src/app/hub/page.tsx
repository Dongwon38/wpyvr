import HubTabs from "@/components/hub/HubTabs"
import { fetchHubPosts } from "@/lib/hubApi"

export const metadata = {
  title: "WPYVR Hub Posts",
  description: "허브에 모인 최신/인기/트렌딩 글을 한 곳에서 확인하세요.",
}

export default async function HubPage() {
  const latestPosts = await fetchHubPosts("latest", 9)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-wide text-sky-500">WPYVR Hub</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">커뮤니티 트렌드</h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          멤버 사이트에서 전송된 글을 검수 후 허브에 노출합니다. 최신, 인기, 트렌딩 탭으로 빠르게 탐색해 보세요.
        </p>
      </header>

      <HubTabs initialPosts={latestPosts} />
    </div>
  )
}
