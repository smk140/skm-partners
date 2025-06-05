"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"
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
  const [uploadStatus, setUploadStatus] = useState("")
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("🖼️ 파일 선택:", file.name, file.size, "bytes", file.type)

    setIsUploading(true)
    setError("")
    setUploadProgress(0)
    setUploadStatus("파일 검증 중...")

    try {
      // 클라이언트 검증
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("파일 크기는 5MB 이하여야 합니다.")
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("이미지 파일만 업로드할 수 있습니다.")
      }

      // 지원되는 형식 체크
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        throw new Error("지원하지 않는 파일 형식입니다. JPG, PNG, WebP, GIF만 가능합니다.")
      }

      setUploadStatus("파일 업로드 중...")
      setUploadProgress(25)

      const formData = new FormData()
      formData.append("file", file)

      console.log("📤 파일 업로드 시작...")
      setUploadProgress(50)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("📡 응답 상태:", response.status)
      setUploadProgress(75)

      const responseText = await response.text()
      console.log("📄 응답 내용:", responseText.substring(0, 200) + "...")

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("❌ JSON 파싱 실패:", parseError)
        throw new Error("서버 응답을 해석할 수 없습니다.")
      }

      console.log("📊 파싱된 결과:", result)
      setUploadProgress(90)

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (result.success && result.url) {
        console.log("✅ 이미지 URL 설정:", result.url.substring(0, 50) + "...")
        onChange(result.url)
        setUploadStatus("업로드 완료!")
        setUploadProgress(100)

        // 3초 후 상태 메시지 제거
        setTimeout(() => {
          setUploadStatus("")
          setUploadProgress(0)
        }, 3000)
      } else {
        throw new Error(result.error || "업로드 결과가 올바르지 않습니다.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다."
      console.error("💥 업로드 실패:", errorMessage)
      setError(errorMessage)
      setUploadStatus("")
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    console.log("🗑️ 이미지 제거")
    onChange("")
    setError("")
    setUploadStatus("")
    setUploadProgress(0)
  }

  const handleUploadClick = () => {
    setError("")
    setUploadStatus("")
    setUploadProgress(0)
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
              onLoad={() => console.log("✅ 이미지 로드 성공")}
              onError={(e) => {
                console.error("❌ 이미지 로드 실패")
                setError("이미지를 표시할 수 없습니다.")
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              이미지 업로드됨
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4 mr-1" />
              제거
            </Button>
          </div>
        </div>
      )}

      {/* 업로드 영역 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        {isUploading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">{uploadStatus}</p>
            {uploadProgress > 0 && (
              <div className="w-full max-w-xs">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
              </div>
            )}
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

      {/* 상태 메시지 */}
      {uploadStatus && !isUploading && (
        <div className="text-sm text-green-600 text-center flex items-center justify-center">
          <CheckCircle className="h-4 w-4 mr-1" />
          {uploadStatus}
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">업로드 실패</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}
