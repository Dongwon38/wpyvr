"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Plus, X, Lock, Eye, EyeOff } from "lucide-react"
import AvatarUploader from "./AvatarUploader"
import Switch from "@/components/ui/Switch"
import { useAuth } from "@/context/AuthContext"
import { updateUserProfile, type SocialLink, type ProfileUpdatePayload, type PrivacySettings } from "@/lib/profileApi"

const STATUS_OPTIONS = [
  {
    value: "looking_for_job",
    label: "Looking for a job",
    description: "Show up in searches when teams are hiring.",
  },
  {
    value: "taking_on_projects",
    label: "Taking on projects",
    description: "Let others know you’re open to freelance or collabs.",
  },
] as const

interface ProfileFormProps {
  initialData?: {
    nickname: string
    bio: string
    position: string
    specialties: string[]
    status?: string[]
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
  const [statusSelections, setStatusSelections] = useState<string[]>(initialData?.status || [])

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

  const handleStatusToggle = (value: string) => {
    setStatusSelections(prev => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      }
      return [...prev, value]
    })
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
          status: statusSelections,
          avatar_url: avatarUrl,
          profile_visibility: profileVisibility,
          custom_email: useCustomEmail ? customEmail.trim() : "",
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
          className="mb-2 block text-sm font-semibold text-[#444140]"
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
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-[#444140] placeholder-gray-400 transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
          required
        />
      </div>

      {/* Profile Visibility - Card Style */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-[#444140]">
          Profile Visibility <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Public Option Card */}
          <label className={`relative cursor-pointer rounded-sm border p-4 transition-all ${
            profileVisibility === 'public'
              ? 'border-[#00749C] bg-[#00749C]/5'
              : 'border-gray-200 bg-white hover:border-gray-300'
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
            <div className="flex items-start gap-2">
              <div>
              <Eye size={20} className={profileVisibility === 'public' ? 'text-[#00749C]' : 'text-gray-400'} />
                
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${
                    profileVisibility === 'public'
                      ? 'text-[#00749C]'
                      : 'text-gray-400'
                  }`}>
                    Public
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  Visible in members list
                </p>
              </div>
            </div>
          </label>

          {/* Private Option Card */}
          <label className={`relative cursor-pointer rounded-sm border p-4 transition-all ${
            profileVisibility === 'private'
              ? 'border-[#00749C] bg-[#00749C]/5'
              : 'border-gray-200 bg-white hover:border-gray-300'
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
            <div className="flex items-start gap-2">
              <EyeOff size={20} className={profileVisibility === 'private' ? 'text-[#00749C]' : 'text-gray-400'} />
              <div className="flex-1">
                <span className={`text-sm font-semibold ${profileVisibility === 'private' ? 'text-[#00749C]' : 'text-gray-400'}`}>
                  Private
                </span>
                <p className="mt-0.5 text-xs text-gray-500">
                  Hidden from list
                </p>
              </div>
            </div>
          </label>
        </div>
        <div className="mt-3 rounded-sm bg-gray-50 px-4 py-3 text-xs text-gray-600">
          <strong className="font-semibold">Note:</strong> Individual fields can be controlled separately with toggles below.
        </div>
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="mb-2 block text-sm font-semibold text-[#444140]"
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
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-[#444140] placeholder-gray-400 transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          {bio.length}/500 characters
        </p>
      </div>

      {/* Status Checkboxes */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-[#444140]">
          Availability Status
        </label>
        <p className="mb-3 text-xs text-gray-500">
          Choose the tags that describe your current availability. Leave unchecked if you prefer not to display anything.
        </p>
        <div className="space-y-2">
          {STATUS_OPTIONS.map((option) => {
            const checked = statusSelections.includes(option.value)
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors ${
                  checked ? "border-[#00749C] bg-[#00749C]/5" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-[#00749C] focus:ring-2 focus:ring-[#00749C]/30"
                  checked={checked}
                  onChange={() => handleStatusToggle(option.value)}
                />
                <div>
                  <span className="text-sm font-semibold text-[#444140]">{option.label}</span>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* Professional Info */}
      <div className="space-y-5">
        {/* Position */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="position"
              className="text-sm font-semibold text-[#444140]"
            >
              Position / Job Title
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
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
            className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-[#444140] placeholder-gray-400 transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Company */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="company"
              className="text-sm font-semibold text-[#444140]"
            >
              Company
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
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
            className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-[#444140] placeholder-gray-400 transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      {/* Specialties */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold text-[#444140]">
            Specialties / Skills
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
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
            className="flex-1 rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-[#444140] placeholder-gray-400 transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            type="button"
            onClick={handleAddSpecialty}
            className="flex items-center gap-1.5 rounded-sm cursor-pointer border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-[#444140] transition-colors hover:bg-gray-50"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 rounded-sm border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-[#444140]"
            >
              {specialty}
              <button
                type="button"
                onClick={() => handleRemoveSpecialty(index)}
                className="cursor-pointer text-gray-400 hover:text-[#444140]"
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
          <label className="text-sm font-semibold text-[#444140]">
            Email Address
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
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
                className="h-4 w-4 border-gray-300 text-[#444140] focus:ring-2 focus:ring-gray-200"
              />
              <span className="text-sm text-gray-700">Use account email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="emailType"
                checked={useCustomEmail}
                onChange={() => setUseCustomEmail(true)}
                className="h-4 w-4 border-gray-300 text-[#444140] focus:ring-2 focus:ring-gray-200"
              />
              <span className="text-sm text-gray-700">Use custom email</span>
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
              className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-[#444140] placeholder-gray-400 transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          ) : (
            <div className="rounded-sm border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-600">
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
            className="text-sm font-semibold text-[#444140]"
          >
            Website
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
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
          className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-[#444140] placeholder-gray-400 transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {/* Social Links */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-semibold text-[#444140]">
            Social Links
          </label>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="flex items-center gap-1.5 rounded-sm cursor-pointer border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-[#444140] transition-colors hover:bg-gray-50"
          >
            <Plus size={14} />
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
                className="w-1/3 rounded-sm border border-gray-300 bg-white px-3 py-2 text-[#444140] transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                className="flex-1 rounded-sm border border-gray-300 bg-white px-4 py-2 text-[#444140] placeholder-gray-400 transition-colors focus:border-[#444140] focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemoveSocialLink(index)}
                className="rounded-sm border border-gray-300 bg-white px-3 py-2 text-gray-500 cursor-pointer transition-colors hover:bg-gray-50 hover:text-red-600"
                aria-label="Remove link"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {socialLinks.length === 0 && (
            <p className="text-sm text-gray-500">
              No social links yet. Click "Add Link" to get started.
            </p>
          )}
        </div>
      </div>

      {/* Privacy Info */}
      <div className="rounded-sm border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm bg-white">
            <Lock size={18} className="text-[#444140]" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-semibold text-[#444140]">
              Privacy Settings
            </h3>
            <p className="text-sm text-gray-600">
              Use the toggle switches to control what information is visible on your public profile.
              When switched off, fields will show "—" to other members.
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`rounded-sm px-4 py-3 text-sm ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-sm cursor-pointer border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-[#444140] transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || saving}
          className={`
            group relative overflow-hidden rounded-sm cursor-pointer border border-transparent
            bg-[#00749C] px-8 py-3 text-sm font-semibold text-white
            shadow-[0_20px_55px_-32px_rgba(0,116,156,1)]
            transition-all
            hover:bg-[#00749C]
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-[#00A8C6]
            disabled:cursor-not-allowed disabled:opacity-50
          `}
        >
          {/* gradient hover layer */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-[#00749C] via-[#00A8C6] to-[#62C8E6] opacity-0 transition group-hover:opacity-100"
          />

          {/* content */}
          <span className="relative z-10 flex items-center gap-2">
            {saving ? (
              <>
                <div className="relative h-4 w-4">
                  <div className="absolute inset-0 rounded-sm border-2 border-white/30" />
                  <div
                    className="absolute inset-0 rounded-sm border-2 border-transparent border-t-white animate-spin"
                    style={{ animationDuration: "0.6s" }}
                  />
                </div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  )
}
