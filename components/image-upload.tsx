"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  label: string
  value?: string
  onChange: (url: string) => void
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(value || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      toast({
        title: "오류",
        description: "이미지 파일만 업로드할 수 있습니다.",
        variant: "destructive",
      })
      return
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "파일 크기는 10MB 이하여야 합니다.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      console.log("🔥 이미지 업로드 시작:", file.name)

      // 파일을 Base64로 변환
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string
        console.log("🔄 Base64 변환 완료")

        try {
          // 서버에 업로드
          const response = await fetch("/api/admin/upload-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64Data,
              filename: file.name,
            }),
          })

          const result = await response.json()
          console.log("📥 업로드 응답:", result)

          if (result.success) {
            console.log("✅ 이미지 업로드 성공:", result.url)
            setPreviewUrl(result.url)
            onChange(result.url)
            toast({
              title: "업로드 완료",
              description: "이미지가 성공적으로 업로드되었습니다.",
            })
          } else {
            throw new Error(result.error || "업로드 실패")
          }
        } catch (error: any) {
          console.error("💥 이미지 업로드 실패:", error)
          toast({
            title: "업로드 실패",
            description: error.message || "이미지 업로드에 실패했습니다.",
            variant: "destructive",
          })
        } finally {
          setIsUploading(false)
        }
      }

      reader.onerror = () => {
        console.error("💥 파일 읽기 실패")
        toast({
          title: "오류",
          description: "파일을 읽을 수 없습니다.",
          variant: "destructive",
        })
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error: any) {
      console.error("💥 파일 처리 실패:", error)
      toast({
        title: "오류",
        description: "파일 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setIsUploading(false)
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = () => {
    setPreviewUrl("")
    onChange("")
    toast({
      title: "삭제 완료",
      description: "이미지가 제거되었습니다.",
    })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>

      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="미리보기"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    console.error("이미지 로드 실패:", previewUrl)
                    e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    제거
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="truncate">URL: {previewUrl}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">이미지를 업로드하세요</p>
              <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF 파일 (최대 10MB)</p>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              variant={previewUrl ? "outline" : "default"}
              className="w-full max-w-xs"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {previewUrl ? "다른 이미지 선택" : "이미지 업로드"}
                </>
              )}
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}
