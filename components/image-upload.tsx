"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "파일 크기 오류",
        description: "파일 크기는 5MB 이하여야 합니다.",
        variant: "destructive",
      })
      return
    }

    // 파일 형식 체크
    if (!file.type.startsWith("image/")) {
      toast({
        title: "파일 형식 오류",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("업로드 시작:", file.name, file.size, file.type)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("응답 상태:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("업로드 실패 응답:", errorText)
        throw new Error(`업로드 실패: ${response.status}`)
      }

      const result = await response.json()
      console.log("업로드 성공:", result)

      if (result.success && result.url) {
        onChange(result.url)
        toast({
          title: "업로드 완료",
          description: "이미지가 성공적으로 업로드되었습니다.",
        })
      } else {
        throw new Error("업로드 결과가 올바르지 않습니다.")
      }
    } catch (error) {
      console.error("업로드 오류:", error)
      toast({
        title: "업로드 실패",
        description: error instanceof Error ? error.message : "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // 파일 입력 초기화
      event.target.value = ""
    }
  }

  const handleRemove = () => {
    onChange("")
    toast({
      title: "이미지 제거",
      description: "이미지가 제거되었습니다.",
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>

      {/* 현재 이미지 표시 */}
      {value && (
        <div className="relative border rounded-lg p-4 bg-gray-50">
          <div className="relative h-48 w-full mb-2">
            <Image
              src={value || "/placeholder.svg"}
              alt={label}
              fill
              className="object-contain rounded"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">현재 이미지</p>
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
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <p className="text-sm text-gray-600">업로드 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-900 mb-1">{value ? "새 이미지로 교체" : "이미지 업로드"}</p>
            <p className="text-xs text-gray-500 mb-4">JPG, PNG, WebP (최대 5MB)</p>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button type="button" variant="outline" disabled={isUploading}>
                파일 선택
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
