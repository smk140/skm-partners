"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, ExternalLink, Check, X } from "lucide-react"

interface ImageUrlInputProps {
  label: string
  value: string
  onChange: (url: string) => void
  description?: string
}

export function ImageUrlInput({ label, value, onChange, description }: ImageUrlInputProps) {
  const [inputUrl, setInputUrl] = useState(value)
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validateImage = async (url: string) => {
    if (!url.trim()) {
      setIsValid(null)
      return
    }

    setIsValidating(true)
    try {
      const img = new Image()
      img.crossOrigin = "anonymous"

      const isValidImage = await new Promise<boolean>((resolve) => {
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = url
      })

      setIsValid(isValidImage)
    } catch (error) {
      setIsValid(false)
    } finally {
      setIsValidating(false)
    }
  }

  const handleUrlChange = (url: string) => {
    setInputUrl(url)
    validateImage(url)
  }

  const handleApply = () => {
    onChange(inputUrl)
  }

  const handleClear = () => {
    setInputUrl("")
    setIsValid(null)
    onChange("")
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={inputUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValidating ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : isValid === true ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : isValid === false ? (
                <X className="w-4 h-4 text-red-500" />
              ) : null}
            </div>
          </div>
          <Button onClick={handleApply} disabled={!inputUrl.trim() || isValid === false}>
            적용
          </Button>
          {inputUrl && (
            <Button variant="outline" onClick={handleClear}>
              지우기
            </Button>
          )}
        </div>

        {inputUrl && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            <span className="truncate">{inputUrl}</span>
          </div>
        )}
      </div>

      {/* 이미지 미리보기 */}
      {value && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">미리보기</p>
              <div className="relative">
                <img
                  src={value || "/placeholder.svg"}
                  alt="미리보기"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling?.classList.remove("hidden")
                  }}
                />
                <div className="hidden w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">이미지를 불러올 수 없습니다</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
