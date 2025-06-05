"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  description?: string
}

export function ImageUpload({ label, value, onChange, description }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("파일 선택됨:", file.name)
    setIsUploading(true)
    setError("")

    try {
      // 클라이언트 검증
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("파일 크기는 5MB 이하여야 합니다.")
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("이미지 파일만 업로드할 수 있습니다.")
      }

      const formData = new FormData()
      formData.append("file", file)

      console.log("업로드 시작...")
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("응답 상태:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "업로드 실패" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log("업로드 결과:", result.success ? "성공" : "실패")

      if (result.success && result.url) {
        console.log("이미지 URL 설정 완료")
        onChange(result.url)
      } else {
        throw new Error(result.error || "업로드 결과가 올바르지 않습니다.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다."
      console.error("업로드 실패:", errorMessage)
      setError(errorMessage)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    console.log("이미지 제거")
    onChange("")
    setError("")
  }

  const handleUploadClick = () => {
    setError("")
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>

      {/* 현재 이미지 표시 */}
      {value && !isUploading && (
        <div className="relative border rounded-lg p-3 bg-gray-50">
          <div className="relative h-32 w-full mb-2">
            <img
              src={value || "/placeholder.svg"}
              alt="업로드된 이미지"
              className="w-full h-full object-cover rounded"
              onLoad={() => console.log("이미지 로드 성공")}
              onError={(e) => {
                console.error("이미지 로드 실패")
                setError("이미지를 표시할 수 없습니다.")
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-600 text-sm">✅ 이미지 업로드됨</span>
            <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4 mr-1" />
              제거
            </Button>
          </div>
        </div>
      )}

      {/* 업로드 영역 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">업로드 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{value ? "새 이미지로 교체" : "이미지 업로드"}</p>
              <p className="text-xs text-gray-500">JPG, PNG, WebP, GIF (최대 5MB)</p>
            </div>
            <Button type="button" variant="outline" onClick={handleUploadClick} disabled={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              파일 선택
            </Button>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">{error}</div>}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}
