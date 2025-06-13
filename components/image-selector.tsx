"use client"
import { Button } from "@/components/ui/button"

interface ImageSelectorProps {
  value: string
  onChange: (url: string) => void
}

// 단순 이미지 목록
const IMAGES = [
  "/placeholder.svg?height=300&width=400&text=이미지1",
  "/placeholder.svg?height=300&width=400&text=이미지2",
  "/placeholder.svg?height=300&width=400&text=이미지3",
  "/placeholder.svg?height=300&width=400&text=이미지4",
  "/placeholder.svg?height=300&width=400&text=이미지5",
  "/placeholder.svg?height=300&width=400&text=이미지6",
]

export function ImageSelector({ value, onChange }: ImageSelectorProps) {
  return (
    <div>
      {/* 이미지 선택 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {IMAGES.map((image, index) => (
          <div
            key={index}
            onClick={() => onChange(image)}
            className={`cursor-pointer border ${value === image ? "border-blue-500 border-2" : "border-gray-200"}`}
          >
            <img src={image || "/placeholder.svg"} alt={`이미지 ${index + 1}`} className="w-full h-auto" />
          </div>
        ))}
      </div>

      {/* 선택 취소 버튼 */}
      {value && (
        <Button variant="outline" size="sm" onClick={() => onChange("")} className="mt-2">
          선택 취소
        </Button>
      )}
    </div>
  )
}
