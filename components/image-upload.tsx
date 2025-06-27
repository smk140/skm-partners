"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  imageType: string
  currentImage?: string
  onImageUploaded: (url: string) => void
  label: string
}

export function ImageUpload({ imageType, currentImage, onImageUploaded, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "파일 크기는 10MB 이하여야 합니다.",
        variant: "destructive",
      })
      return
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      toast({
        title: "잘못된 파일 형식",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      })
      return
    }

    console.log("🔥 이미지 업로드 시작:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      imageType: imageType,
    })

    setIsUploading(true)

    try {
      // 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // FormData 생성
      const formData = new FormData()
      formData.append("file", file)
      formData.append("imageType", imageType)

      console.log("📤 서버로 업로드 요청 전송...")

      // 서버로 업로드
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      console.log("📥 서버 응답:", result)

      if (result.success) {
        console.log("✅ 이미지 업로드 성공:", result.url)
        onImageUploaded(result.url)
        toast({
          title: "업로드 성공",
          description: "이미지가 성공적으로 업로드되었습니다.",
        })
      } else {
        console.error("❌ 이미지 업로드 실패:", result.error)
        throw new Error(result.error || "업로드 실패")
      }
    } catch (error: any) {
      console.error("💥 이미지 업로드 오류:", error)
      toast({
        title: "업로드 실패",
        description: error.message || "이미지 업로드에 실패했습니다.",
        variant: "destructive",
      })
      setPreviewUrl(currentImage || "")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl("")
    onImageUploaded("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{label}</h3>
            {previewUrl && (
              <Button variant="outline" size="sm" onClick={handleRemoveImage} disabled={isUploading}>
                <X className="h-4 w-4 mr-2" />
                제거
              </Button>
            )}
          </div>

          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={label}
                className="w-full h-48 object-cover rounded-lg border"
                onError={(e) => {
                  console.error("이미지 로드 실패:", previewUrl)
                  e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p>업로드 중...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">클릭하여 이미지를 선택하세요</p>
              <p className="text-sm text-gray-500">JPG, PNG, GIF (최대 10MB)</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "업로드 중..." : "이미지 선택"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
