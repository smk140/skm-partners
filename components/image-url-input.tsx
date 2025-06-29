"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SafeImage } from "@/components/safe-image"

interface ImageUrlInputProps {
  label: string
  value: string
  onChange: (url: string) => void
  description?: string
}

export function ImageUrlInput({ label, value, onChange, description }: ImageUrlInputProps) {
  const [isValidUrl, setIsValidUrl] = useState(false)

  const handleUrlChange = (url: string) => {
    onChange(url)

    // URL 유효성 검사
    try {
      if (url && (new URL(url) || url.includes("placeholder.svg"))) {
        setIsValidUrl(true)
      } else {
        setIsValidUrl(false)
      }
    } catch {
      setIsValidUrl(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`url-${label}`}>이미지 URL</Label>
          <Input
            id={`url-${label}`}
            type="url"
            placeholder="https://example.com/image.jpg"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>

        {value && isValidUrl && (
          <div className="space-y-2">
            <Label>미리보기</Label>
            <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
              <SafeImage src={value} alt={label} className="w-full h-full" fallbackText={`${label} 미리보기`} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
