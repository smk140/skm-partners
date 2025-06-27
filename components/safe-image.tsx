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
  priority?: boolean
}

export function SafeImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  fallbackSrc,
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    console.error("이미지 로드 실패:", imgSrc)
    setHasError(true)

    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(false)
    } else {
      // 최종 fallback
      setImgSrc(`/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(alt)}`)
    }
  }

  const handleLoad = () => {
    console.log("이미지 로드 성공:", imgSrc)
    setHasError(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imgSrc || `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(alt)}`}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover ${hasError ? "opacity-50" : ""}`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        unoptimized={imgSrc.includes("placeholder.svg")}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          이미지를 불러올 수 없습니다
        </div>
      )}
    </div>
  )
}
