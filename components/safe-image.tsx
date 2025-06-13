"use client"

import { useState } from "react"
import { ImageIcon } from "lucide-react"

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  fallbackText?: string
  width?: number
  height?: number
}

export function SafeImage({ src, alt, className = "", fallbackText, width, height }: SafeImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center text-slate-500">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">{fallbackText || "이미지를 불러올 수 없습니다"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 bg-slate-100 flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
      />
    </div>
  )
}
