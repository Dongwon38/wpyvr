"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Plus, X, Loader2 } from "lucide-react"
import AvatarUploader from "./AvatarUploader"
import { useAuth } from "@/context/AuthContext"
import { updateUserProfile, type SocialLink, type ProfileUpdatePayload } from "@/lib/profileApi"

interface ProfileFormProps {
  initialData?: {
    nickname: string
    greeting: string
    job_title: string
    website: string
    avatar_url: string
    social_links: SocialLink[]
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter()
  const { wpUser, refreshProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [nickname, setNickname] = useState(initialData?.nickname || "")
  const [greeting, setGreeting] = useState(initialData?.greeting || "")
  const [jobTitle, setJobTitle] = useState(initialData?.job_title || "")
  const [website, setWebsite] = useState(initialData?.website || "")
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || "")
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    initialData?.social_links || []
  )

  // Validation
  const isValid = nickname.trim().length > 0 && greeting.trim().length > 0

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { type: "", url: "" }])
  }

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
  }

  const handleSocialLinkChange = (
    index: number,
    field: "type" | "url",
    value: string
  ) => {
    const updated = [...socialLinks]
    updated[index][field] = value
    setSocialLinks(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      setMessage({
        type: "error",
        text: "Please fill in at least your nickname and greeting.",
      })
      return
    }

    if (!wpUser) {
      setMessage({ type: "error", text: "You must be logged in to update your profile." })
      return
    }

    try {
      setSaving(true)
      setMessage(null)

      // Filter out empty social links
      const validSocialLinks = socialLinks.filter(
        (link) => link.type.trim() && link.url.trim()
      )

      const payload: ProfileUpdatePayload = {
        user_id: wpUser.wp_user_id,
        nickname: nickname.trim(),
        greeting: greeting.trim(),
        job_title: jobTitle.trim(),
        website: website.trim(),
        avatar_url: avatarUrl,
        social_links: validSocialLinks,
      }

      await updateUserProfile(payload, wpUser.jwt)

      // Refresh profile in AuthContext
      await refreshProfile()

      setMessage({
        type: "success",
        text: "✅ Profile updated successfully!",
      })

      // Redirect back to home after a short delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      console.error("Failed to update profile:", error)
      setMessage({
        type: "error",
        text: "Failed to save profile. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar Section */}
      <div className="flex justify-center">
        <AvatarUploader
          currentAvatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
        />
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nickname */}
        <div>
          <label
            htmlFor="nickname"
            className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
          >
            Nickname <span className="text-red-500">*</span>
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g., DW"
            maxLength={100}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            required
          />
        </div>

        {/* Job Title */}
        <div>
          <label
            htmlFor="jobTitle"
            className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
          >
            Job Title
          </label>
          <input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Full-stack Developer"
            maxLength={255}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Greeting / Bio */}
      <div>
        <label
          htmlFor="greeting"
          className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
        >
          Greeting / Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          id="greeting"
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          placeholder="Tell the community about yourself..."
          rows={4}
          maxLength={255}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          required
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {greeting.length}/255 characters
        </p>
      </div>

      {/* Website */}
      <div>
        <label
          htmlFor="website"
          className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
        >
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yoursite.com"
          maxLength={255}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      {/* Social Links */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            Social Links
          </label>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Link
          </button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={link.type}
                onChange={(e) =>
                  handleSocialLinkChange(index, "type", e.target.value)
                }
                className="w-1/3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select...</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="dribbble">Dribbble</option>
                <option value="behance">Behance</option>
                <option value="other">Other</option>
              </select>
              <input
                type="url"
                value={link.url}
                onChange={(e) =>
                  handleSocialLinkChange(index, "url", e.target.value)
                }
                placeholder="https://..."
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveSocialLink(index)}
                className="rounded-lg border border-red-300 bg-white px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:hover:bg-red-900/20"
                aria-label="Remove link"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {socialLinks.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No social links yet. Click "Add Link" to get started.
            </p>
          )}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || saving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}
