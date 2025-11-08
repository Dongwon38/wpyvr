"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, User, Loader2 } from "lucide-react"
import { storage, auth } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import imageCompression from "browser-image-compression"

interface AvatarUploaderProps {
  currentAvatarUrl?: string
  onAvatarChange: (url: string) => void
}

export default function AvatarUploader({
  currentAvatarUrl,
  onAvatarChange,
}: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(currentAvatarUrl || "")
  const [imageError, setImageError] = useState(false)

  // Sync previewUrl with currentAvatarUrl whenever it changes
  useEffect(() => {
    console.log("🖼️ AvatarUploader - currentAvatarUrl changed:", currentAvatarUrl)
    if (currentAvatarUrl) {
      console.log("🔍 URL validation:", {
        hasProtocol: currentAvatarUrl.startsWith('http'),
        includesFirebase: currentAvatarUrl.includes('firebasestorage'),
        includesSlashEncoding: currentAvatarUrl.includes('%2F'),
        length: currentAvatarUrl.length
      })
      setPreviewUrl(currentAvatarUrl)
      setImageError(false)
    } else {
      console.log("⚠️ No avatar URL provided")
      setPreviewUrl("")
    }
  }, [currentAvatarUrl])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if user is authenticated
    const currentUser = auth.currentUser
    if (!currentUser) {
      alert("You must be logged in to upload an avatar")
      return
    }

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

      // Generate file name with timestamp to prevent overwrite
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop() || 'jpg'
      const sanitizedFileName = `avatar_${timestamp}.${fileExtension}`
      
      // Upload to Firebase Storage with new path structure: avatars/{userId}/{fileName}
      // userId is Firebase Auth UID (not WordPress user_id)
      const filePath = `avatars/${currentUser.uid}/${sanitizedFileName}`
      const storageRef = ref(storage, filePath)
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
          console.log("✅ Avatar uploaded successfully!")
          console.log("📁 Storage path:", filePath)
          console.log("🔗 Download URL:", downloadURL)
          console.log("🔍 URL breakdown:", {
            bucket: storage.app.options.storageBucket,
            path: filePath,
            encodedPath: encodeURIComponent(filePath).replace(/%2F/g, '%2F')
          })
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
          {previewUrl && !imageError ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error("❌ Avatar image failed to load:", previewUrl)
                console.error("Image error event:", e)
                setImageError(true)
              }}
              onLoad={() => {
                console.log("✅ Avatar image loaded successfully")
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User size={48} className="text-gray-400" />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                  <p className="text-xs text-red-600 dark:text-red-400">Failed to load</p>
                </div>
              )}
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
