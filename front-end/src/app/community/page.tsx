import HubTabs from "@/components/hub/HubTabs"
import { fetchHubPosts } from "@/lib/hubApi"

export const metadata = {
  title: "Community Hub",
  description: "멤버 사이트에서 검수 완료된 실시간 커뮤니티 글을 탐색하세요.",
}

export default async function CommunityPage() {
  const latestPosts = await fetchHubPosts("latest", 9)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-wide text-sky-500">WPYVR Community</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">커뮤니티 하이라이트</h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          각 멤버 사이트에서 푸시된 최신 글을 탭으로 탐색하고, 핫한 콘텐츠를 한 번에 확인하세요.
        </p>
      </header>

      <HubTabs initialPosts={latestPosts} />
    </div>
  )
}
