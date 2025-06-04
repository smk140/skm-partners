"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"

export default function TestUploadPage() {
  const [testImage, setTestImage] = useState("")

  const testAPI = async () => {
    try {
      const response = await fetch("/api/upload")
      const data = await response.json()
      console.log("API 테스트 결과:", data)
      alert(`API 상태: ${data.message}`)
    } catch (error) {
      console.error("API 테스트 실패:", error)
      alert("API 테스트 실패")
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>이미지 업로드 테스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={testAPI} variant="outline">
            API 연결 테스트
          </Button>

          <div>
            <h3 className="text-lg font-medium mb-4">이미지 업로드 테스트</h3>
            <ImageUpload
              value={testImage}
              onChange={setTestImage}
              label="테스트 이미지"
              description="이미지 업로드 기능을 테스트해보세요"
            />
          </div>

          {testImage && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">✅ 업로드 성공! 이미지 URL: {testImage.substring(0, 50)}...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
