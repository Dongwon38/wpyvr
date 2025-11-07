"use client"

import { useState } from "react"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      console.log("✅ Firebase Auth Success")
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4">{isSignUp ? "Sign Up" : "Log In"}</h2>

      <form onSubmit={handleEmailAuth} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isSignUp ? "Create Account" : "Login"}
        </button>
      </form>

      <button
        onClick={handleGoogle}
        className="w-full bg-red-500 text-white mt-3 py-2 rounded hover:bg-red-600"
      >
        Continue with Google
      </button>

      <p className="text-center mt-4 text-sm text-gray-600">
        {isSignUp ? "Already have an account?" : "New here?"}{" "}
        <span
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 cursor-pointer"
        >
          {isSignUp ? "Log in" : "Sign up"}
        </span>
      </p>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  )
}
