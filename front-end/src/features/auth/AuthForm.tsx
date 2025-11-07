"use client"

import { useState } from "react"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "@/context/AuthContext"

interface AuthFormProps {
  onSuccess?: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const { syncWithWordPress } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      let userCredential
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
      }
      
      console.log("✅ Firebase Auth Success")
      
      // Sync with WordPress
      await syncWithWordPress(userCredential.user)
      
      // Clear form
      setEmail("")
      setPassword("")
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error("❌ Auth error:", err)
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Try logging in instead.")
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.")
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.")
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.")
      } else if (err.message?.includes("WordPress")) {
        setError("Authentication succeeded, but WordPress sync failed. Please try again.")
      } else {
        setError(err.message || "Authentication failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setLoading(true)
    
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      console.log("✅ Google Auth Success")
      
      // Sync with WordPress
      await syncWithWordPress(userCredential.user)
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error("❌ Google auth error:", err)
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled.")
      } else if (err.message?.includes("WordPress")) {
        setError("Authentication succeeded, but WordPress sync failed. Please try again.")
      } else {
        setError(err.message || "Google sign-in failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        {isSignUp ? "Sign Up" : "Log In"}
      </h2>

      <form onSubmit={handleEmailAuth} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          minLength={6}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Processing..." : (isSignUp ? "Create Account" : "Login")}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
        </div>
      </div>

      <button
        onClick={handleGoogle}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={loading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? "Processing..." : "Continue with Google"}
      </button>

      <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        {isSignUp ? "Already have an account?" : "New here?"}{" "}
        <span
          onClick={() => {
            if (!loading) {
              setIsSignUp(!isSignUp)
              setError("")
            }
          }}
          className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
        >
          {isSignUp ? "Log in" : "Sign up"}
        </span>
      </p>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
