"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Play, ImageIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  acceptVideo?: boolean
}

export function ImageUpload({ images, onImagesChange, maxImages = 10, acceptVideo = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "mahadev_baby_shop")

    const resourceType = file.type.startsWith("video/") ? "video" : "image"


    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    )
    // console.log("\n\n\nNEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    
    
    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const data = await response.json()
    return data.secure_url
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} files allowed`)
      return
    }

    setIsUploading(true)
    try {
      const uploadPromises = files.map(uploadToCloudinary)
      const fileUrls = await Promise.all(uploadPromises)
      onImagesChange([...images, ...fileUrls])
      toast.success(`${files.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error("Error uploading files:", error)
      toast.error("Failed to upload files")
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ""
    }
  }

  const removeFile = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const isVideo = (url: string) => {
    return url.includes(".mp4") || url.includes(".webm") || url.includes(".mov") || url.includes("video")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          Product Media ({images.length}/{maxImages})
        </Label>
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("media-upload")?.click()}
          disabled={isUploading || images.length >= maxImages}
          className="rounded-xl"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload Media"}
        </Button>
      </div>

      <input
        id="media-upload"
        type="file"
        multiple
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
        onChange={handleFileUpload}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                {isVideo(url) ? (
                  <div className="relative w-full h-full">
                    <video src={url} className="w-full h-full object-cover" controls={false} muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={url || "/placeholder.svg"}
                    alt={`Product media ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>

              <div className="absolute bottom-2 left-2">
                {isVideo(url) ? (
                  <Play className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-white bg-black/50 rounded p-0.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No media uploaded yet</p>
          <p className="text-sm text-gray-400">Click "Upload Media" to add images or videos</p>
        </div>
      )}
    </div>
  )
}
