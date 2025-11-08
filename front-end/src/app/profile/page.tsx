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
                    bio: profile.bio || "",
                    position: profile.position || "",
                    specialties: profile.specialties || [],
                    company: profile.company || "",
                    website: profile.website || "",
                    avatar_url: profile.avatar_url || "",
                    member_type: profile.member_type || 'member',
                    social_links: profile.social_links || [],
                    privacy_settings: profile.privacy_settings || {
                      show_email: true,
                      show_position: true,
                      show_company: true,
                      show_website: true,
                      show_specialties: true,
                    },
                  }
                : undefined
            }
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <h3 className="font-semibold text-purple-900 dark:text-purple-300">
            💡 Profile Tips
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-400">
            <li>• Your nickname is required and visible to all members</li>
            <li>• Add specialties to showcase your skills and expertise</li>
            <li>• Upload a profile photo to make your profile more personal</li>
            <li>• Use privacy settings to control what information is public</li>
            <li>• Expert members are highlighted in the community members page</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
