"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  fallbackSrc?: string
  fallbackText?: string
  onLoad?: () => void
  onError?: () => void
}

export function SafeImage({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  fallbackSrc,
  fallbackText,
  onLoad,
  onError,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || "")
  const [hasError, setHasError] = useState(!src)

  useEffect(() => {
    setImgSrc(src || "")
    setHasError(!src)
  }, [src])

  const handleError = () => {
    console.log(`❌ Image failed to load: ${imgSrc}`)
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      console.log(`🔄 Trying fallback image: ${fallbackSrc}`)
      setImgSrc(fallbackSrc)
    } else {
      setHasError(true)
    }
    onError?.()
  }

  const handleLoad = () => {
    console.log(`✅ Image loaded successfully: ${imgSrc}`)
    setHasError(false)
    onLoad?.()
  }

  if (hasError || !imgSrc) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 rounded-lg ${className}`}>
        <ImageIcon className="h-8 w-8 mb-2" />
        <span className="text-xs text-center px-2">{fallbackText || "이미지 없음"}</span>
      </div>
    )
  }

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      className={`object-cover ${className}`}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      priority={priority}
      onError={handleError}
      onLoad={handleLoad}
      unoptimized // 외부 URL 최적화 비활성화
    />
  )
}
