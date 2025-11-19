"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import ProfileForm from "@/components/profile/ProfileForm"
import {
  fetchUserProfile,
  fetchPushTokenInfo,
  generatePushToken,
  revokePushToken,
  type UserProfile,
  type PushTokenInfo,
} from "@/lib/profileApi"

export default function ProfilePage() {
  const router = useRouter()
  const { user, wpUser, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pushTokenInfo, setPushTokenInfo] = useState<PushTokenInfo | null>(null)
  const [pushTokenLoading, setPushTokenLoading] = useState(true)
  const [pushTokenError, setPushTokenError] = useState<string | null>(null)
  const [originSiteUrl, setOriginSiteUrl] = useState("")
  const [isTokenUpdating, setIsTokenUpdating] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState<"idle" | "copied">("idle")

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

  useEffect(() => {
    const loadPushToken = async () => {
      if (authLoading) return
      if (!user || !wpUser) {
        setPushTokenLoading(false)
        return
      }

      try {
        setPushTokenLoading(true)
        const info = await fetchPushTokenInfo(wpUser.jwt)
        setPushTokenInfo(info)
        if (info.origin_site_url) {
          setOriginSiteUrl(info.origin_site_url)
        } else if (profile?.website) {
          setOriginSiteUrl(profile.website)
        }
        setPushTokenError(null)
      } catch (err) {
          console.error("Failed to load push token:", err)
          setPushTokenError("Unable to load token info.")
      } finally {
        setPushTokenLoading(false)
      }
    }

    loadPushToken()
  }, [authLoading, user, wpUser, profile?.website])

  const handleGenerateOrRegenerateToken = async () => {
    if (!wpUser) return
    const origin = originSiteUrl?.trim() || undefined

    try {
      setIsTokenUpdating(true)
      const info = await generatePushToken(wpUser.jwt, origin)
      setPushTokenInfo(info)
      setPushTokenError(null)
      setCopyFeedback("idle")
    } catch (err) {
        console.error("Failed to generate push token:", err)
        setPushTokenError(
          err instanceof Error ? err.message : "Token generation failed."
        )
    } finally {
      setIsTokenUpdating(false)
    }
  }

  const handleRevokeToken = async () => {
    if (!wpUser) return

    try {
      setIsTokenUpdating(true)
      const info = await revokePushToken(wpUser.jwt)
      setPushTokenInfo(info)
      setPushTokenError(null)
      setCopyFeedback("idle")
    } catch (err) {
        console.error("Failed to revoke push token:", err)
        setPushTokenError(
          err instanceof Error ? err.message : "Token deletion failed."
        )
    } finally {
      setIsTokenUpdating(false)
    }
  }

  const handleCopyToken = async () => {
    if (!pushTokenInfo?.token) return
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(pushTokenInfo.token)
        setCopyFeedback("copied")
        setTimeout(() => setCopyFeedback("idle"), 2000)
      }
    } catch (err) {
        console.error("Failed to copy push token:", err)
        setPushTokenError("Failed to copy token to clipboard.")
    }
  }

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

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#00749C]/10 text-[#00749C]">
              <User size={18} />
            </div>
              <div>
                <h2 className="text-lg font-semibold text-[#444140]">Hub Push Token</h2>
                <p className="text-sm text-gray-600">
                  Generate a long-lived token for the WPYVR Connect plugin. Use this token in the member site settings.
                </p>
              </div>
          </div>

          {pushTokenLoading ? (
              <p className="mt-4 text-sm text-gray-600">Loading token info...</p>
          ) : (
            <div className="mt-4 space-y-4">
              {pushTokenError && (
                <p className="text-sm text-red-600">{pushTokenError}</p>
              )}

              {pushTokenInfo?.token ? (
                <>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase text-gray-500">
                      현재 토큰
                    </p>
                    <p className="mt-2 break-all font-mono text-sm text-gray-800">
                      {pushTokenInfo.token}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      disabled={isTokenUpdating}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {copyFeedback === "copied" ? "복사 완료!" : "토큰 복사"}
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateOrRegenerateToken}
                      disabled={isTokenUpdating}
                      className="rounded-lg bg-[#00749C] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#005a7a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isTokenUpdating ? "재발급 중..." : "토큰 재발급"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRevokeToken}
                      disabled={isTokenUpdating}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      토큰 삭제
                    </button>
                  </div>

                  <div className="text-xs text-gray-500">
                    {pushTokenInfo.origin_site_url && (
                      <p>연결된 사이트: {pushTokenInfo.origin_site_url}</p>
                    )}
                    <p>
                      마지막 푸시:{" "}
                      {pushTokenInfo.last_push_at
                        ? pushTokenInfo.last_push_at
                        : "아직 기록이 없습니다."}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="origin-site-url"
                      className="text-sm font-medium text-gray-700"
                    >
                        Origin Site URL (optional)
                    </label>
                    <input
                      id="origin-site-url"
                      type="url"
                      value={originSiteUrl}
                      onChange={(event) => setOriginSiteUrl(event.target.value)}
                      placeholder="https://membersite.com"
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#00749C] focus:outline-none focus:ring-1 focus:ring-[#00749C]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateOrRegenerateToken}
                    disabled={isTokenUpdating}
                    className="inline-flex rounded-lg bg-[#00749C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#005a7a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isTokenUpdating ? "발급 중..." : "토큰 발급"}
                  </button>
                </>
              )}
            </div>
          )}
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
