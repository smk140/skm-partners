"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"

interface SafeImageProps {
  src?: string
  alt: string
  className?: string
  fallbackClassName?: string
  width?: number
  height?: number
  priority?: boolean
}

export function SafeImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  width,
  height,
  priority = false,
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // src가 없거나 에러가 발생한 경우 fallback 표시
  if (!src || imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${fallbackClassName || className}`}
        style={width && height ? { width, height } : undefined}
      >
        <div className="text-center">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">{alt}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
          style={width && height ? { width, height } : undefined}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
            <p className="text-sm">로딩 중...</p>
          </div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        width={width}
        height={height}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.error("이미지 로드 실패:", src)
          setImageError(true)
          setIsLoading(false)
        }}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}
