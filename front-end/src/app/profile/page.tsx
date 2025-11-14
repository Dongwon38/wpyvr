"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, User } from "lucide-react"
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
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="text-center">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#00749C]/20" />
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00749C] border-r-[#00B7D3] animate-spin"
              style={{ animationDuration: "0.8s" }}
            />
          </div>
          <p className="mt-6 text-lg font-medium text-[#444140]/80">
            Loading your profile...
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3EF]">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-[#444140]/70">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl bg-gradient-to-r from-[#00749C] to-[#00B7D3] px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Hero Section with Gradient */}
      <section className="relative isolate overflow-hidden border-b border-[#00749C]/10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "linear-gradient(135deg, #003B52 0%, #00749C 55%, #00B7D3 100%)",
          }}
        />
        <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#00B4D8]/20 blur-3xl" />
        <div className="absolute right-8 top-12 h-48 w-48 rounded-full bg-[#0390B8]/15 blur-[100px]" />
        
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/90 transition-all hover:text-white hover:gap-3"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
          
          <div className="text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90 backdrop-blur-sm">
              <User className="h-3.5 w-3.5" />
              Your Profile
            </span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              My Profile
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/85">
              Manage your profile information and connect with the community
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Form Card */}
        <div className="rounded-3xl border border-[#00749C]/10 bg-white p-6 shadow-xl md:p-8">
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
                    profile_visibility: profile.profile_visibility || 'private',
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
        <div className="mt-6 rounded-2xl border border-[#00749C]/20 bg-gradient-to-br from-[#00749C]/5 to-[#00B7D3]/5 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-[#00749C] to-[#00B7D3] p-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#00749C]">
                💡 Profile Tips
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#444140]/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00749C]"></span>
                  <span>Your nickname is required and visible to all members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00749C]"></span>
                  <span>Add specialties to showcase your skills and expertise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00749C]"></span>
                  <span>Upload a profile photo to make your profile more personal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00749C]"></span>
                  <span>Use privacy settings to control what information is public</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00749C]"></span>
                  <span>Set your profile to Private to hide from the members list</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
