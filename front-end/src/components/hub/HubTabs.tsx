"use client"

import { useEffect, useState } from "react"
import HubPostList from "./HubPostList"
import type { HubPost, HubPostOrder } from "@/lib/hubApi"
import { fetchHubPosts } from "@/lib/hubApi"

type Props = {
  initialPosts: HubPost[]
  onlyPushed?: boolean
}

const tabs: { label: string; value: HubPostOrder }[] = [
  { label: "Latest", value: "latest" },
  { label: "Popular", value: "popular" },
  { label: "Trending", value: "trending" },
]

const HubTabs = ({ initialPosts, onlyPushed }: Props) => {
  const [activeTab, setActiveTab] = useState<HubPostOrder>("latest")
  const [data, setData] = useState<Record<HubPostOrder, HubPost[]>>({
    latest: initialPosts,
    popular: [],
    trending: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    const loadPosts = async () => {
      if (data[activeTab].length) {
        return
      }

      setLoading(true)
      try {
          const posts = await fetchHubPosts(activeTab, 9, 1, { onlyPushed })
        if (!ignore) {
          setData((prev) => ({ ...prev, [activeTab]: posts }))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadPosts()

    return () => {
      ignore = true
    }
  }, [activeTab, data])

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.value ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

        {loading && !data[activeTab].length ? (
          <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <HubPostList posts={data[activeTab]} />
      )}
    </section>
  )
}

export default HubTabs
