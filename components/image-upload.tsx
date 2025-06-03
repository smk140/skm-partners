"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

export function ImageUpload({ value, onChange, label = "이미지", className }: ImageUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(value || "")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "업로드에 실패했습니다.")
      }

      setPreviewUrl(result.url)
      onChange(result.url)

      toast({
        title: "업로드 완료",
        description: "이미지가 성공적으로 업로드되었습니다.",
      })
    } catch (error) {
      console.error("업로드 실패:", error)
      toast({
        title: "업로드 실패",
        description: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl("")
    onChange("")
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>

      {previewUrl ? (
        <div className="relative">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
            <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">이미지를 변경하려면 새 파일을 선택하세요</p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">이미지를 업로드하세요</p>
          <p className="text-xs text-gray-400 mb-4">JPG, PNG, WebP (최대 5MB)</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id={`file-upload-${label}`}
        />
        <Label htmlFor={`file-upload-${label}`} className="cursor-pointer">
          <Button type="button" variant="outline" disabled={isUploading} className="flex items-center gap-2" asChild>
            <span>
              <Upload className="h-4 w-4" />
              {isUploading ? "업로드 중..." : "파일 선택"}
            </span>
          </Button>
        </Label>
      </div>
    </div>
  )
}
