/**
 * Profile API Helper Functions
 * Handles all profile-related API calls to WordPress REST endpoints
 */

const WP_API_URL = "https://wpyvr.bitebuddy.ca/backend/wp-json/custom-profile/v1"

export type SocialLink = {
  type: string
  url: string
}

export type UserProfile = {
  user_id: number
  nickname: string
  greeting: string
  avatar_url: string
  website: string
  job_title: string
  social_links: SocialLink[]
  last_seen_at: string | null
  updated_at: string
}

export type ProfileUpdatePayload = {
  user_id: number
  nickname: string
  greeting: string
  job_title: string
  website: string
  avatar_url: string
  social_links: SocialLink[]
}

/**
 * Fetch user profile by WordPress user ID
 */
export async function fetchUserProfile(
  userId: number,
  token: string
): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${WP_API_URL}/get?user_id=${userId}`, {
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
    const response = await fetch(`${WP_API_URL}/update`, {
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
