"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Plus, X, Loader2, Lock, Unlock } from "lucide-react"
import AvatarUploader from "./AvatarUploader"
import Switch from "@/components/ui/Switch"
import { useAuth } from "@/context/AuthContext"
import { updateUserProfile, type SocialLink, type ProfileUpdatePayload, type PrivacySettings } from "@/lib/profileApi"

interface ProfileFormProps {
  initialData?: {
    nickname: string
    bio: string
    position: string
    specialties: string[]
    company: string
    website: string
    avatar_url: string
    profile_visibility: 'public' | 'private'
    social_links: SocialLink[]
    privacy_settings: PrivacySettings
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter()
  const { wpUser, refreshProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Default privacy settings
  const defaultPrivacySettings: PrivacySettings = {
    show_email: false,
    show_position: false,
    show_company: false,
    show_website: false,
    show_specialties: false,
  }

  // Form state
  const [nickname, setNickname] = useState(initialData?.nickname || "")
  const [bio, setBio] = useState(initialData?.bio || "")
  const [position, setPosition] = useState(initialData?.position || "")
  const [specialties, setSpecialties] = useState<string[]>(initialData?.specialties || [])
  const [company, setCompany] = useState(initialData?.company || "")
  const [website, setWebsite] = useState(initialData?.website || "")
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || "")
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>(initialData?.profile_visibility || 'private')
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    initialData?.social_links || []
  )
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() => {
    // If initialData has privacy settings, use them
    if (initialData?.privacy_settings) {
      return {
        show_email: initialData.privacy_settings.show_email ?? false,
        show_position: initialData.privacy_settings.show_position ?? false,
        show_company: initialData.privacy_settings.show_company ?? false,
        show_website: initialData.privacy_settings.show_website ?? false,
        show_specialties: initialData.privacy_settings.show_specialties ?? false,
      }
    }
    // Otherwise use default (all private)
    return defaultPrivacySettings
  })

  // Specialty input
  const [specialtyInput, setSpecialtyInput] = useState("")

  // Validation
  const isValid = nickname.trim().length > 0

  const handleAddSpecialty = () => {
    const trimmed = specialtyInput.trim()
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed])
      setSpecialtyInput("")
    }
  }

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index))
  }

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

  const togglePrivacy = (key: keyof PrivacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      setMessage({
        type: "error",
        text: "Please fill in at least your nickname.",
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
        bio: bio.trim(),
        position: position.trim(),
        specialties: specialties,
        company: company.trim(),
        website: website.trim(),
        avatar_url: avatarUrl,
        profile_visibility: profileVisibility,
        social_links: validSocialLinks,
        privacy_settings: privacySettings,
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

      {/* Profile Visibility - Card Style */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-gray-900 dark:text-white">
          Profile Visibility <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Public Option Card */}
          <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
            profileVisibility === 'public'
              ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20'
              : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
          }`}>
            <input
              type="radio"
              name="profileVisibility"
              value="public"
              checked={profileVisibility === 'public'}
              onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
              className="sr-only"
              required
            />
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                profileVisibility === 'public'
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {profileVisibility === 'public' && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" r="3" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Unlock size={18} className={profileVisibility === 'public' ? 'text-green-600 dark:text-green-400' : 'text-gray-500'} />
                  <span className={`text-base font-semibold ${
                    profileVisibility === 'public'
                      ? 'text-green-900 dark:text-green-300'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    Public
                  </span>
                </div>
                <p className={`mt-1 text-sm ${
                  profileVisibility === 'public'
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Visible in members list
                </p>
              </div>
            </div>
          </label>

          {/* Private Option Card */}
          <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
            profileVisibility === 'private'
              ? 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/20'
              : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
          }`}>
            <input
              type="radio"
              name="profileVisibility"
              value="private"
              checked={profileVisibility === 'private'}
              onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
              className="sr-only"
              required
            />
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                profileVisibility === 'private'
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {profileVisibility === 'private' && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" r="3" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Lock size={18} className={profileVisibility === 'private' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'} />
                  <span className={`text-base font-semibold ${
                    profileVisibility === 'private'
                      ? 'text-purple-900 dark:text-purple-300'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    Private
                  </span>
                </div>
                <p className={`mt-1 text-sm ${
                  profileVisibility === 'private'
                    ? 'text-purple-700 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Hidden from list
                </p>
              </div>
            </div>
          </label>
        </div>
        <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> Individual fields can be controlled separately with toggles below.
          </p>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
        >
          Bio / About Me
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the community about yourself..."
          rows={4}
          maxLength={500}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {bio.length}/500 characters
        </p>
      </div>

      {/* Professional Info */}
      <div className="space-y-6">
        {/* Position */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="position"
              className="text-sm font-semibold text-gray-900 dark:text-white"
            >
              Position / Job Title
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {privacySettings.show_position ? "Public" : "Private"}
              </span>
              <Switch
                checked={privacySettings.show_position === true}
                onCheckedChange={() => togglePrivacy('show_position')}
                label="Toggle position visibility"
              />
            </div>
          </div>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., Full-stack Developer"
            maxLength={255}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        {/* Company */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="company"
              className="text-sm font-semibold text-gray-900 dark:text-white"
            >
              Company
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {privacySettings.show_company ? "Public" : "Private"}
              </span>
              <Switch
                checked={privacySettings.show_company === true}
                onCheckedChange={() => togglePrivacy('show_company')}
                label="Toggle company visibility"
              />
            </div>
          </div>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Tech Innovations Inc."
            maxLength={255}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Specialties */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Specialties / Skills
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {privacySettings.show_specialties ? "Public" : "Private"}
            </span>
            <Switch
              checked={privacySettings.show_specialties === true}
              onCheckedChange={() => togglePrivacy('show_specialties')}
              label="Toggle specialties visibility"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddSpecialty()
              }
            }}
            placeholder="e.g., React, Node.js, TypeScript"
            maxLength={50}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
          <button
            type="button"
            onClick={handleAddSpecialty}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 rounded-md bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            >
              {specialty}
              <button
                type="button"
                onClick={() => handleRemoveSpecialty(index)}
                className="hover:text-purple-900 dark:hover:text-purple-100"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Website */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="website"
            className="text-sm font-semibold text-gray-900 dark:text-white"
          >
            Website
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {privacySettings.show_website ? "Public" : "Private"}
            </span>
            <Switch
              checked={privacySettings.show_website === true}
              onCheckedChange={() => togglePrivacy('show_website')}
              label="Toggle website visibility"
            />
          </div>
        </div>
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

      {/* Privacy Info */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/50">
            <Lock size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 font-semibold text-purple-900 dark:text-purple-300">
              Privacy Settings
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-400">
              Use the toggle switches to control what information is visible on your public profile.
              When switched off, fields will show "—" to other members.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-2 py-1 font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                <Unlock size={12} />
                Public = Visible to all
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <Lock size={12} />
                Private = Hidden (shows "—")
              </span>
            </div>
          </div>
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
