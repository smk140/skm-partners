"use client"

import { useState } from "react"
import Image from "next/image"

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  fallbackText?: string
  priority?: boolean
}

export function SafeImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  fallbackSrc,
  fallbackText,
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    console.error("이미지 로드 실패:", imgSrc)
    setHasError(true)
    setIsLoading(false)

    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(false)
      setIsLoading(true)
    } else {
      // 최종 fallback
      setImgSrc(`/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(alt)}`)
      setIsLoading(true)
      setHasError(false)
    }
  }

  const handleLoad = () => {
    console.log("이미지 로드 성공:", imgSrc)
    setHasError(false)
    setIsLoading(false)
  }

  const handleLoadStart = () => {
    setIsLoading(true)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="text-gray-400 text-sm">이미지 로딩 중...</div>
        </div>
      )}

      <Image
        src={imgSrc || `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(alt)}`}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${hasError ? "opacity-50" : ""}`}
        onError={handleError}
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
        priority={priority}
        unoptimized={imgSrc.includes("placeholder.svg")}
      />

      {hasError && fallbackText && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          {fallbackText}
        </div>
      )}
    </div>
  )
}
