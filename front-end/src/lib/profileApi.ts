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
  user_id: number
  nickname: string
  bio: string
  avatar_url: string
  position: string
  specialties: string[]
  company: string
  website: string
  member_type: 'member' | 'expert'
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
  member_type: 'member' | 'expert'
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
    const response = await fetch(`${PROFILE_API_URL}/get?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Profile doesn't exist yet, return null
        return null
      }
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch profile")
    }

    const data = await response.json()
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
      throw new Error(error.message || "Failed to update profile")
    }

    const data = await response.json()
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
