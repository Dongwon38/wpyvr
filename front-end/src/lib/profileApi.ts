/**
 * Profile API Helper Functions
 * Handles all profile-related API calls to WordPress REST endpoints
 */

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://localhost:8000"
const PROFILE_API_URL = `${WP_API_URL}/wp-json/custom-profile/v1`

export type SocialLink = {
  type: string
  url: string
}

export type PrivacySettings = {
  show_email?: boolean
  show_position?: boolean
  show_company?: boolean
  show_website?: boolean
  show_specialties?: boolean
}

export type UserProfile = {
  id?: number
  user_id: number
  nickname: string
  bio: string
  avatar_url: string
  position: string
  specialties: string[]
  company: string
  website: string
  profile_visibility: 'public' | 'private'
  custom_email: string
  social_links: SocialLink[]
  privacy_settings: PrivacySettings
  email?: string
  role?: string
  last_active_at: string | null
  created_at: string
  updated_at: string
}

export type ProfileUpdatePayload = {
  user_id: number
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

/**
 * Fetch user profile by WordPress user ID
 */
export async function fetchUserProfile(
  userId: number,
  token: string
): Promise<UserProfile | null> {
  try {
    console.log("📡 Fetching profile for user ID:", userId)
    const response = await fetch(`${PROFILE_API_URL}/get?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log("⚠️ Profile not found for user", userId)
        // Profile doesn't exist yet, return null
        return null
      }
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch profile")
    }

    const data = await response.json()
    console.log("✅ Profile fetched successfully:", {
      user_id: data.user_id,
      nickname: data.nickname,
      avatar_url: data.avatar_url,
      has_avatar: !!data.avatar_url
    })
    return data
  } catch (error) {
    console.error("❌ Error fetching user profile:", error)
    throw error
  }
}

/**
 * Update or create user profile
 */
export async function updateUserProfile(
  payload: ProfileUpdatePayload,
  token: string
): Promise<UserProfile> {
  try {
    console.log("📤 Updating profile:", {
      user_id: payload.user_id,
      nickname: payload.nickname,
      avatar_url: payload.avatar_url,
      has_avatar: !!payload.avatar_url
    })
    const response = await fetch(`${PROFILE_API_URL}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("❌ Update failed:", error)
      throw new Error(error.message || "Failed to update profile")
    }

    const data = await response.json()
    console.log("✅ Profile updated successfully:", {
      user_id: data.user_id,
      avatar_url: data.data?.avatar_url,
      response: data
    })
    return data
  } catch (error) {
    console.error("❌ Error updating user profile:", error)
    throw error
  }
}

/**
 * Fetch all members (for members page)
 */
export async function fetchAllMembers(): Promise<UserProfile[]> {
  try {
    const response = await fetch(`${PROFILE_API_URL}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch members")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("❌ Error fetching members:", error)
    return []
  }
}
