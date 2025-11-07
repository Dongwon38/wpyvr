"use client"

import { useState, useRef } from "react"
import { Upload, User, Loader2 } from "lucide-react"
import { storage } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import imageCompression from "browser-image-compression"

interface AvatarUploaderProps {
  currentAvatarUrl?: string
  onAvatarChange: (url: string) => void
  userId: number
}

export default function AvatarUploader({
  currentAvatarUrl,
  onAvatarChange,
  userId,
}: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(currentAvatarUrl || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      // Compress image
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 512,
        useWebWorker: true,
        quality: 0.8,
      }

      console.log("Compressing image...")
      const compressedFile = await imageCompression(file, options)
      console.log(`Compressed from ${file.size} to ${compressedFile.size} bytes`)

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(compressedFile)

      // Upload to Firebase Storage
      const timestamp = Date.now()
      const fileName = `avatars/${userId}_${timestamp}.jpg`
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, compressedFile)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(Math.round(progress))
        },
        (error) => {
          console.error("Upload error:", error)
          alert("Failed to upload image. Please try again.")
          setUploading(false)
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          console.log("✅ Avatar uploaded:", downloadURL)
          onAvatarChange(downloadURL)
          setUploading(false)
          setUploadProgress(0)
        }
      )
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Failed to process image. Please try again.")
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Avatar Preview */}
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200 bg-gradient-to-br from-blue-100 to-purple-100 dark:border-gray-700 dark:from-blue-900 dark:to-purple-900">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User size={48} className="text-gray-400" />
            </div>
          )}

          {/* Upload Progress Overlay */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white">
                <Loader2 size={32} className="mx-auto animate-spin" />
                <p className="mt-2 text-sm font-semibold">{uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {!uploading && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Upload avatar"
          >
            <Upload size={20} />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Profile Photo
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          JPG, PNG or GIF • Max 5MB • 512×512px
        </p>
      </div>
    </div>
  )
}
