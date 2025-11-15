"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User } from "lucide-react"
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00749C] animate-spin"
              style={{ animationDuration: "0.8s" }}
            />
          </div>
          <p className="mt-6 text-sm font-medium text-[#444140]">
            Loading your profile...
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#444140]">Error</h1>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-[#00749C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#005a7a]"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#444140]"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#444140]">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your profile information and connect with the community
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Form Card */}
        <div className=" bg-white p-0">
          <ProfileForm
            initialData={
              profile
                ? {
                    nickname: profile.nickname || "",
                    bio: profile.bio || "",
                    position: profile.position || "",
                    specialties: profile.specialties || [],
                    status: profile.status || [],
                    company: profile.company || "",
                    website: profile.website || "",
                    avatar_url: profile.avatar_url || "",
                    profile_visibility: profile.profile_visibility || "private",
                    custom_email: profile.custom_email || "",
                    social_links: profile.social_links || [],
                    privacy_settings: {
                      show_email: profile.privacy_settings?.show_email ?? false,
                      show_position: profile.privacy_settings?.show_position ?? false,
                      show_company: profile.privacy_settings?.show_company ?? false,
                      show_website: profile.privacy_settings?.show_website ?? false,
                      show_specialties: profile.privacy_settings?.show_specialties ?? false,
                    },
                  }
                : undefined
            }
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 rounded-sm border border-gray-200 bg-gray-50 p-5">
          <h3 className="text-sm font-semibold text-[#444140]">
            💡 Profile Tips
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"></span>
              <span>Your nickname is required and visible to all members</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"></span>
              <span>Add specialties to showcase your skills and expertise</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"></span>
              <span>Upload a profile photo to make your profile more personal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"></span>
              <span>Use privacy settings to control what information is public</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400"></span>
              <span>Set your profile to Private to hide from the members list</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
