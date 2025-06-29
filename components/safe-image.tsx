"use client"

import { useState } from "react"
import Image from "next/image"

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
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
  fill = false,
  className = "",
  fallbackSrc,
  fallbackText,
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)

    // One retry with fallbackSrc
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setHasError(false)
      setIsLoading(true)
    } else {
      // Final fallback: generated placeholder
      setImgSrc(`/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(alt)}`)
      setHasError(false)
      setIsLoading(true)
    }
  }

  const handleLoad = () => {
    setHasError(false)
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse text-gray-400 text-sm">
          이미지 로딩 중...
        </div>
      )}

      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        {...(fill ? { fill: true, sizes: "(max-width:768px) 100vw, 50vw" } : { width, height })}
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${hasError ? "opacity-50" : ""}`}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
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
