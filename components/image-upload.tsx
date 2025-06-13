"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.")
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadProgress(10) // 시작 진행률

    try {
      // Base64로 인코딩
      const base64 = await convertToBase64(file)
      setUploadProgress(50) // 인코딩 완료

      // 서버에 업로드
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          filename: file.name,
        }),
      })

      setUploadProgress(90) // 업로드 거의 완료

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "이미지 업로드에 실패했습니다.")
      }

      const data = await response.json()
      onChange(data.url) // 업로드된 이미지 URL을 상태에 저장
      setUploadProgress(100) // 업로드 완료
    } catch (err) {
      console.error("Image upload failed:", err)
      setError(err instanceof Error ? err.message : "이미지 업로드 중 오류가 발생했습니다.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // 파일을 Base64로 변환
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div className="space-y-4">
      {label && <Label className="block font-medium">{label}</Label>}

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              업로드 중... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              이미지 업로드
            </>
          )}
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
        />

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            삭제
          </Button>
        )}
      </div>

      {isUploading && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {value && (
        <div className="mt-4 border rounded-md p-2">
          <img
            src={value || "/placeholder.svg"}
            alt="업로드된 이미지"
            className="max-h-48 object-contain mx-auto"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
              setError("이미지를 불러올 수 없습니다.")
            }}
          />
        </div>
      )}
    </div>
  )
}
