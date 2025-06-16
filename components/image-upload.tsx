"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, AlertCircle, ImageIcon, CheckCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // value prop이 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setImageUrl(value)
    console.log("ImageUpload value 변경됨:", value)
  }, [value])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log("파일 선택됨:", file.name, file.size, file.type)

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("파일 크기는 10MB 이하여야 합니다.")
      return
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)
    setWarning(null)

    try {
      console.log("Base64 변환 시작...")
      // Base64로 인코딩
      const base64 = await convertToBase64(file)
      console.log("Base64 변환 완료, 길이:", base64.length)

      // 미리보기를 위해 즉시 로컬 상태 업데이트
      setImageUrl(base64)

      console.log("서버 업로드 시작...")
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

      console.log("서버 응답 상태:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("서버 오류 응답:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }

        throw new Error(errorData.error || `서버 오류: ${response.status}`)
      }

      const data = await response.json()
      console.log("업로드 성공 데이터:", data)

      if (!data.success) {
        throw new Error(data.error || "업로드에 실패했습니다.")
      }

      // 성공 시 URL 업데이트
      const finalUrl = data.url
      setImageUrl(finalUrl)
      onChange(finalUrl) // 부모 컴포넌트에 즉시 알림

      if (data.temporary) {
        setWarning("이미지가 임시로 저장되었습니다. 새로고침 시 사라질 수 있으니 빠른 시일 내에 저장해주세요.")
      } else {
        setSuccess(`이미지가 성공적으로 업로드되었습니다: ${data.filename}`)
      }
      setError(null)

      console.log("최종 이미지 URL:", finalUrl)
      console.log("onChange 호출됨:", finalUrl)

      // 메시지를 5초 후 자동으로 숨김
      setTimeout(() => {
        setSuccess(null)
        setWarning(null)
      }, 5000)
    } catch (err) {
      console.error("업로드 실패:", err)
      setError(err instanceof Error ? err.message : "이미지 업로드 중 오류가 발생했습니다.")
      setImageUrl(value) // 원래 값으로 복원
    } finally {
      setIsUploading(false)
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
      reader.onload = () => {
        console.log("FileReader 성공")
        resolve(reader.result as string)
      }
      reader.onerror = (error) => {
        console.error("FileReader 오류:", error)
        reject(error)
      }
    })
  }

  const handleRemove = () => {
    setImageUrl("")
    onChange("")
    setSuccess(null)
    setError(null)
    setWarning(null)
    console.log("이미지 제거됨")
  }

  return (
    <div className="space-y-4">
      {label && <Label className="block font-medium text-sm">{label}</Label>}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        {imageUrl ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="업로드된 이미지"
                className="max-h-48 max-w-full object-contain mx-auto rounded-lg"
                onLoad={() => {
                  console.log("이미지 로드 성공:", imageUrl)
                }}
                onError={(e) => {
                  console.error("이미지 로드 실패:", imageUrl)
                  e.currentTarget.src = "/placeholder.svg"
                  setError("이미지를 불러올 수 없습니다.")
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                다른 이미지 선택
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700"
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-1" />
                삭제
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <ImageIcon className="w-full h-full" />
            </div>
            <div>
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
                    업로드 중...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    이미지 업로드
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG, GIF 파일을 선택하세요 (최대 10MB)</p>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
        />
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {warning && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">{warning}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
