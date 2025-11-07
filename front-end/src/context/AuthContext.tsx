"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { fetchUserProfile, type UserProfile } from "@/lib/profileApi"

type WordPressUser = {
  wp_user_id: number
  email: string
  display_name: string
  roles: string[]
  jwt: string
}

type AuthContextType = {
  user: User | null
  wpUser: WordPressUser | null
  userProfile: UserProfile | null
  loading: boolean
  syncWithWordPress: (firebaseUser: User) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  wpUser: null,
  userProfile: null,
  loading: true,
  syncWithWordPress: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
})

const WP_API_URL = "https://wpyvr.bitebuddy.ca/backend/wp-json/custom-auth/v1"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [wpUser, setWpUser] = useState<WordPressUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Load WordPress JWT from localStorage on mount
  useEffect(() => {
    const storedWpUser = localStorage.getItem("wp_user")
    if (storedWpUser) {
      try {
        setWpUser(JSON.parse(storedWpUser))
      } catch (e) {
        localStorage.removeItem("wp_user")
      }
    }
  }, [])

  // Fetch user profile
  const loadUserProfile = async (wpUserData: WordPressUser) => {
    try {
      const profile = await fetchUserProfile(wpUserData.wp_user_id, wpUserData.jwt)
      setUserProfile(profile)
      console.log("✅ User profile loaded")
    } catch (error) {
      console.error("❌ Failed to load user profile:", error)
      // Profile might not exist yet, which is fine
      setUserProfile(null)
    }
  }

  // Refresh profile (can be called from components after update)
  const refreshProfile = async () => {
    if (wpUser) {
      await loadUserProfile(wpUser)
    }
  }

  // Sync Firebase user with WordPress
  const syncWithWordPress = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken()
      
      const response = await fetch(`${WP_API_URL}/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "WordPress sync failed")
      }

      const data = await response.json()
      
      // Store WordPress user data and JWT
      const wpUserData: WordPressUser = {
        wp_user_id: data.wp_user_id,
        email: data.email,
        display_name: data.display_name,
        roles: data.roles,
        jwt: data.jwt,
      }
      
      setWpUser(wpUserData)
      localStorage.setItem("wp_user", JSON.stringify(wpUserData))
      
      console.log("✅ WordPress sync successful")

      // Load user profile after successful sync
      await loadUserProfile(wpUserData)
    } catch (error) {
      console.error("❌ WordPress sync error:", error)
      throw error
    }
  }

  // Logout from both Firebase and WordPress
  const logout = async () => {
    try {
      await firebaseSignOut(auth)
      setWpUser(null)
      setUserProfile(null)
      localStorage.removeItem("wp_user")
      console.log("✅ Logged out successfully")
    } catch (error) {
      console.error("❌ Logout error:", error)
      throw error
    }
  }

  useEffect(() => {
    let isInitialLoad = true
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      // Only auto-sync on initial load if user exists in Firebase
      if (firebaseUser && isInitialLoad) {
        const storedWpUser = localStorage.getItem("wp_user")
        if (!storedWpUser) {
          try {
            await syncWithWordPress(firebaseUser)
          } catch (error) {
            console.error("Auto-sync failed:", error)
          }
        } else {
          // If we have stored WP user, load their profile
          try {
            const wpUserData = JSON.parse(storedWpUser)
            await loadUserProfile(wpUserData)
          } catch (error) {
            console.error("Failed to load profile on mount:", error)
          }
        }
      }
      
      // If user logged out from Firebase, clear WordPress data
      if (!firebaseUser) {
        setWpUser(null)
        setUserProfile(null)
        localStorage.removeItem("wp_user")
      }
      
      isInitialLoad = false
      setLoading(false)
    })
    
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, wpUser, userProfile, loading, syncWithWordPress, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
