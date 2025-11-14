"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Plus, X, Loader2, Lock, Unlock, Mail } from "lucide-react"
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
    custom_email: string
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

  // Initialize email settings
  useEffect(() => {
    if (initialData?.custom_email) {
      setUseCustomEmail(true)
      setCustomEmail(initialData.custom_email)
    }
  }, [initialData])

  // Form state
  const [nickname, setNickname] = useState(initialData?.nickname || "")
  const [bio, setBio] = useState(initialData?.bio || "")
  const [position, setPosition] = useState(initialData?.position || "")
  const [specialties, setSpecialties] = useState<string[]>(initialData?.specialties || [])
  const [company, setCompany] = useState(initialData?.company || "")
  const [website, setWebsite] = useState(initialData?.website || "")
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || "")

  // Debug log for avatar URL changes
  useEffect(() => {
    console.log("📝 ProfileForm - Avatar URL state changed:", {
      avatarUrl,
      hasValue: !!avatarUrl,
      length: avatarUrl.length,
      startsWithHttp: avatarUrl.startsWith('http')
    })
  }, [avatarUrl])
  
  // Debug log for initial data
  useEffect(() => {
    console.log("📝 ProfileForm - Initial data loaded:", {
      hasInitialData: !!initialData,
      avatar_url: initialData?.avatar_url,
      hasAvatarUrl: !!initialData?.avatar_url
    })
  }, [initialData])
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>(
    initialData?.profile_visibility || 'private'
  )
  const [useCustomEmail, setUseCustomEmail] = useState(false)
  const [customEmail, setCustomEmail] = useState("")
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
        custom_email: useCustomEmail ? customEmail.trim() : '',
        social_links: validSocialLinks,
        privacy_settings: privacySettings,
      }
      
      console.log("💾 ProfileForm - Submitting profile update:", {
        user_id: payload.user_id,
        avatar_url: payload.avatar_url,
        has_avatar: !!payload.avatar_url
      })

      await updateUserProfile(payload, wpUser.jwt)

      // Refresh profile in AuthContext
      await refreshProfile()

      setMessage({
        type: "success",
        text: "✅ Profile updated successfully!",
      })

      // Refresh the current page after a short delay
      setTimeout(() => {
        router.refresh()
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
          onAvatarChange={(url) => {
            console.log("🎨 ProfileForm - Avatar changed via callback:", url)
            setAvatarUrl(url)
          }}
        />
      </div>

      {/* Nickname */}
      <div>
        <label
          htmlFor="nickname"
          className="mb-2 block text-sm font-bold text-[#00749C]"
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
          className="w-full rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-3 text-[#444140] placeholder-[#444140]/40 transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
          required
        />
      </div>

      {/* Profile Visibility - Card Style */}
      <div>
        <label className="mb-3 block text-sm font-bold text-[#00749C]">
          Profile Visibility <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Public Option Card */}
          <label className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
            profileVisibility === 'public'
              ? 'border-[#00B7D3] bg-gradient-to-br from-[#00749C]/10 to-[#00B7D3]/10 shadow-lg'
              : 'border-[#00749C]/20 bg-white hover:border-[#00749C]/40'
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
              <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                profileVisibility === 'public'
                  ? 'border-[#00B7D3] bg-[#00B7D3]'
                  : 'border-[#00749C]/30'
              }`}>
                {profileVisibility === 'public' && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" r="3" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Unlock size={18} className={profileVisibility === 'public' ? 'text-[#00B7D3]' : 'text-[#444140]/50'} />
                  <span className={`text-base font-bold ${
                    profileVisibility === 'public'
                      ? 'text-[#00749C]'
                      : 'text-[#444140]'
                  }`}>
                    Public
                  </span>
                </div>
                <p className={`mt-1 text-sm ${
                  profileVisibility === 'public'
                    ? 'text-[#00749C]/80'
                    : 'text-[#444140]/60'
                }`}>
                  Visible in members list
                </p>
              </div>
            </div>
          </label>

          {/* Private Option Card */}
          <label className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
            profileVisibility === 'private'
              ? 'border-[#444140] bg-gradient-to-br from-[#444140]/5 to-[#444140]/10 shadow-lg'
              : 'border-[#00749C]/20 bg-white hover:border-[#00749C]/40'
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
              <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                profileVisibility === 'private'
                  ? 'border-[#444140] bg-[#444140]'
                  : 'border-[#00749C]/30'
              }`}>
                {profileVisibility === 'private' && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" r="3" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Lock size={18} className={profileVisibility === 'private' ? 'text-[#444140]' : 'text-[#444140]/50'} />
                  <span className={`text-base font-bold ${
                    profileVisibility === 'private'
                      ? 'text-[#444140]'
                      : 'text-[#444140]'
                  }`}>
                    Private
                  </span>
                </div>
                <p className={`mt-1 text-sm ${
                  profileVisibility === 'private'
                    ? 'text-[#444140]/70'
                    : 'text-[#444140]/60'
                }`}>
                  Hidden from list
                </p>
              </div>
            </div>
          </label>
        </div>
        <div className="mt-3 rounded-xl border border-[#00749C]/20 bg-[#00749C]/5 p-4">
          <p className="text-xs font-medium text-[#00749C]">
            <strong>Note:</strong> Individual fields can be controlled separately with toggles below.
          </p>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="mb-2 block text-sm font-bold text-[#00749C]"
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
          className="w-full rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-3 text-[#444140] placeholder-[#444140]/40 transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
        />
        <p className="mt-1 text-xs text-[#444140]/60">
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
              className="text-sm font-bold text-[#00749C]"
            >
              Position / Job Title
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#444140]/60">
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
            className="w-full rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-3 text-[#444140] placeholder-[#444140]/40 transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
          />
        </div>

        {/* Company */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="company"
              className="text-sm font-bold text-[#00749C]"
            >
              Company
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#444140]/60">
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
            className="w-full rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-3 text-[#444140] placeholder-[#444140]/40 transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
          />
        </div>
      </div>

      {/* Specialties */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-[#00749C]">
            Specialties / Skills
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#444140]/60">
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
            className="flex-1 rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-3 text-[#444140] placeholder-[#444140]/40 transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
          />
          <button
            type="button"
            onClick={handleAddSpecialty}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#00749C] to-[#00B7D3] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 rounded-lg border border-[#00749C]/30 bg-[#00749C]/10 px-3 py-1.5 text-sm font-medium text-[#00749C]"
            >
              {specialty}
              <button
                type="button"
                onClick={() => handleRemoveSpecialty(index)}
                className="hover:text-[#444140]"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Email */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-bold text-[#00749C]">
            Email Address
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#444140]/60">
              {privacySettings.show_email ? "Public" : "Private"}
            </span>
            <Switch
              checked={privacySettings.show_email === true}
              onCheckedChange={() => togglePrivacy('show_email')}
              label="Toggle email visibility"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Radio buttons for default/custom */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="emailType"
                checked={!useCustomEmail}
                onChange={() => setUseCustomEmail(false)}
                className="h-4 w-4 border-[#00749C]/30 text-[#00749C] focus:ring-2 focus:ring-[#00749C]/20"
              />
              <span className="text-sm font-medium text-[#444140]">Use account email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="emailType"
                checked={useCustomEmail}
                onChange={() => setUseCustomEmail(true)}
                className="h-4 w-4 border-[#00749C]/30 text-[#00749C] focus:ring-2 focus:ring-[#00749C]/20"
              />
              <span className="text-sm font-medium text-[#444140]">Use custom email</span>
            </label>
          </div>

          {/* Show account email or custom email input */}
          {useCustomEmail ? (
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="custom@example.com"
              maxLength={255}
              className="w-full rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-3 text-[#444140] placeholder-[#444140]/40 transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
            />
          ) : (
            <div className="rounded-xl border border-[#00749C]/20 bg-[#444140]/5 px-4 py-3 text-[#444140]/70">
              {wpUser?.email || 'No account email available'}
            </div>
          )}
        </div>
      </div>

      {/* Website */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="website"
            className="text-sm font-bold text-[#00749C]"
          >
            Website
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#444140]/60">
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
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="yoursite.com or https://yoursite.com"
          maxLength={255}
          className="w-full rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-4 py-3 text-[#444140] placeholder-[#444140]/40 transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
        />
      </div>

      {/* Social Links */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-bold text-[#00749C]">
            Social Links
          </label>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#00749C] to-[#00B7D3] px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
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
                className="w-1/3 rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-3 py-2.5 text-[#444140] transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
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
                type="text"
                value={link.url}
                onChange={(e) =>
                  handleSocialLinkChange(index, "url", e.target.value)
                }
                placeholder="username or https://..."
                className="flex-1 rounded-xl border border-[#00749C]/20 bg-[#FFFDF9] px-3 py-2.5 text-[#444140] placeholder-[#444140]/40 transition-all focus:border-[#00749C] focus:outline-none focus:ring-2 focus:ring-[#00749C]/20"
              />
              <button
                type="button"
                onClick={() => handleRemoveSocialLink(index)}
                className="rounded-xl border-2 border-red-300 bg-white px-3 py-2.5 text-red-600 transition-all hover:bg-red-50"
                aria-label="Remove link"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {socialLinks.length === 0 && (
            <p className="text-sm text-[#444140]/60">
              No social links yet. Click "Add Link" to get started.
            </p>
          )}
        </div>
      </div>

      {/* Privacy Info */}
      <div className="rounded-2xl border border-[#00749C]/30 bg-gradient-to-br from-[#00749C]/5 to-[#00B7D3]/5 p-5">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-gradient-to-br from-[#00749C] to-[#00B7D3] p-3">
            <Lock size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-base font-bold text-[#00749C]">
              Privacy Settings
            </h3>
            <p className="text-sm text-[#444140]/80">
              Use the toggle switches to control what information is visible on your public profile.
              When switched off, fields will show "—" to other members.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#00B7D3]/50 bg-[#00B7D3]/10 px-3 py-1.5 font-medium text-[#00749C]">
                <Unlock size={12} />
                Public = Visible to all
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#444140]/30 bg-[#444140]/5 px-3 py-1.5 font-medium text-[#444140]">
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
          className={`rounded-2xl p-4 ${
            message.type === "success"
              ? "border border-green-200 bg-gradient-to-br from-green-50 to-green-100 text-green-800"
              : "border border-red-200 bg-gradient-to-br from-red-50 to-red-100 text-red-800"
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
          className="rounded-xl border-2 border-[#444140]/20 bg-white px-6 py-3 font-bold text-[#444140] transition-all hover:bg-[#444140]/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00749C] to-[#00B7D3] px-8 py-3 font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {saving ? (
            <>
              <div className="relative h-5 w-5">
                <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                <div 
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin"
                  style={{ animationDuration: "0.6s" }}
                />
              </div>
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
