"use client"

import Image from "next/image"
import { useState } from "react"
import { ImageIcon } from "lucide-react"

interface SafeImageProps {
  src?: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function SafeImage({ src, alt, fill, width, height, className = "", priority = false }: SafeImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // src가 없거나 빈 문자열인 경우 플레이스홀더 표시
  if (!src || src.trim() === "") {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">이미지 없음</p>
        </div>
      </div>
    )
  }

  // 에러가 발생한 경우 플레이스홀더 표시
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">이미지 로드 실패</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse ${className}`}>
          <div className="text-center text-gray-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-1" />
            <p className="text-xs">로딩 중...</p>
          </div>
        </div>
      )}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}
