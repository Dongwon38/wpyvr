"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import ProfileForm from "@/components/profile/ProfileForm"
import { fetchUserProfile, type UserProfile } from "@/lib/profileApi"

export default function ProfilePage() {
  const router = useRouter()
  const { user, wpUser, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return
      
      if (!user || !wpUser) {
        router.push("/")
        return
      }

      try {
        setLoadingProfile(true)
        const data = await fetchUserProfile(wpUser.wp_user_id, wpUser.jwt)
        setProfile(data)
      } catch (err) {
        console.error("Failed to load profile:", err)
        setError("Failed to load profile data")
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [user, wpUser, authLoading, router])

  // Show loading state
  if (authLoading || loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="mx-auto animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your profile information and connect with the community
          </p>
        </div>

        {/* Profile Form Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 md:p-8">
          <ProfileForm
            initialData={
              profile
                ? {
                    nickname: profile.nickname || "",
                    greeting: profile.greeting || "",
                    job_title: profile.job_title || "",
                    website: profile.website || "",
                    avatar_url: profile.avatar_url || "",
                    social_links: profile.social_links || [],
                  }
                : undefined
            }
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300">
            💡 Profile Tips
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-400">
            <li>• Your nickname and greeting are required to complete your profile</li>
            <li>• Upload a profile photo to make your profile more personal</li>
            <li>• Add social links to help others connect with you</li>
            <li>• Your profile helps you stand out in the community</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
