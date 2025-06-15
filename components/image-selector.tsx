"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Check } from "lucide-react"

interface ImageSelectorProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

// 미리 정의된 이미지 목록
const AVAILABLE_IMAGES = [
  "/placeholder.svg?height=400&width=600&text=회사+건물+외관",
  "/placeholder.svg?height=400&width=600&text=사무실+내부",
  "/placeholder.svg?height=400&width=600&text=팀+단체+사진",
  "/placeholder.svg?height=400&width=600&text=회의실",
  "/placeholder.svg?height=400&width=600&text=로비",
  "/placeholder.svg?height=400&width=600&text=작업+공간",
  "/placeholder.svg?height=400&width=600&text=건물+관리+현장",
  "/placeholder.svg?height=400&width=600&text=서비스+현장",
  "/placeholder.svg?height=400&width=600&text=고객+상담",
  "/placeholder.svg?height=400&width=600&text=기술+장비",
  "/placeholder.svg?height=400&width=600&text=안전+점검",
  "/placeholder.svg?height=400&width=600&text=유지+보수",
  "/placeholder.svg?height=400&width=600&text=청소+서비스",
  "/placeholder.svg?height=400&width=600&text=보안+시설",
]

export function ImageSelector({ value, onChange, label }: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleImageSelect = (imageUrl: string) => {
    onChange(imageUrl)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange("")
  }

  return (
    <div className="space-y-4">
      {label && <Label className="block font-medium">{label}</Label>}

      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
          이미지 선택
        </Button>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            선택 해제
          </Button>
        )}
      </div>

      {/* 선택된 이미지 미리보기 */}
      {value && (
        <div className="mt-4 border rounded-md p-2">
          <img src={value || "/placeholder.svg"} alt="선택된 이미지" className="max-h-48 object-contain mx-auto" />
          <p className="text-xs text-gray-500 mt-2 text-center">선택된 이미지</p>
        </div>
      )}

      {/* 이미지 선택 그리드 */}
      {isOpen && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {AVAILABLE_IMAGES.map((imageUrl, index) => (
              <div
                key={index}
                className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:border-blue-300 ${
                  value === imageUrl ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                }`}
                onClick={() => handleImageSelect(imageUrl)}
              >
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`이미지 옵션 ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                {value === imageUrl && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              닫기
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
