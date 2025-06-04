"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
  description?: string
}

export function ImageUpload({ value, onChange, label, description }: ImageUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("🔄 파일 선택됨:", file.name)
    setUploadProgress("파일 검증 중...")

    // 클라이언트 사이드 검증
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "파일 크기 오류",
        description: "파일 크기는 10MB 이하여야 합니다.",
        variant: "destructive",
      })
      resetInput()
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "파일 형식 오류",
        description: "이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive",
      })
      resetInput()
      return
    }

    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress("업로드 준비 중...")

    try {
      console.log("📤 업로드 시작:", file.name)

      const formData = new FormData()
      formData.append("file", file)

      setUploadProgress("서버로 전송 중...")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("📡 서버 응답 상태:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "서버 오류" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      setUploadProgress("응답 처리 중...")
      const result = await response.json()
      console.log("✅ 업로드 결과:", result)

      if (result.success && result.url) {
        onChange(result.url)
        toast({
          title: "업로드 완료!",
          description: `${file.name}이(가) 성공적으로 업로드되었습니다.`,
        })
        setUploadProgress("완료!")
      } else {
        throw new Error("업로드 결과가 올바르지 않습니다.")
      }
    } catch (error) {
      console.error("💥 업로드 실패:", error)
      toast({
        title: "업로드 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
      setUploadProgress("실패")
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(""), 2000)
      resetInput()
    }
  }

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = () => {
    onChange("")
    toast({
      title: "이미지 제거됨",
      description: "이미지가 제거되었습니다.",
    })
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* 라벨과 설명 */}
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>

      {/* 현재 이미지 미리보기 */}
      {value && !isUploading && (
        <div className="relative border rounded-lg p-4 bg-gray-50">
          <div className="relative h-48 w-full mb-3">
            <Image
              src={value || "/placeholder.svg"}
              alt={label}
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600 font-medium">✓ 이미지 업로드됨</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700"
            >
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
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">업로드 중...</p>
              <p className="text-xs text-gray-500">{uploadProgress}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{value ? "새 이미지로 교체" : "이미지 업로드"}</p>
              <p className="text-xs text-gray-500">JPG, PNG, WebP, GIF (최대 10MB)</p>
            </div>
            <Button type="button" variant="outline" onClick={handleButtonClick} disabled={isUploading}>
              파일 선택
            </Button>
          </div>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* 업로드 진행 상태 */}
      {uploadProgress && <div className="text-xs text-gray-500 text-center">상태: {uploadProgress}</div>}
    </div>
  )
}
