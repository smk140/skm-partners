"use client"

import { useState } from "react"
import { ImageUpload } from "@/components/image-upload"
import { Button } from "@/components/ui/button"

export default function TestUploadPage() {
  const [imageUrl, setImageUrl] = useState("")
  const [testResult, setTestResult] = useState("")

  const testAPI = async () => {
    try {
      setTestResult("API 테스트 중...")
      const response = await fetch("/api/upload")
      const result = await response.json()
      setTestResult(`API 상태: ${result.status} - ${result.message}`)
    } catch (error) {
      setTestResult(`API 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">이미지 업로드 테스트</h1>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">API 상태 확인</h2>
          <Button onClick={testAPI} className="mb-2">
            API 테스트
          </Button>
          {testResult && <p className="text-sm text-gray-600">{testResult}</p>}
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">이미지 업로드 테스트</h2>
          <ImageUpload
            label="테스트 이미지"
            value={imageUrl}
            onChange={setImageUrl}
            description="이미지 업로드 기능을 테스트합니다."
          />
        </div>

        {imageUrl && (
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">업로드 결과</h2>
            <p className="text-sm text-gray-600 mb-2">이미지 URL:</p>
            <p className="text-xs bg-gray-100 p-2 rounded break-all">{imageUrl}</p>
          </div>
        )}
      </div>
    </div>
  )
}
