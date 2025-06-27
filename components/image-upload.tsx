"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, Loader2, AlertCircle, ExternalLink, Settings, Eye, EyeOff, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  label: string
  value?: string
  onChange: (url: string) => void
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(value || "")
  const [error, setError] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")
    setDebugInfo(null)

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      const errorMsg = "이미지 파일만 업로드할 수 있습니다."
      setError(errorMsg)
      toast({
        title: "오류",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = "파일 크기는 10MB 이하여야 합니다."
      setError(errorMsg)
      toast({
        title: "오류",
        description: errorMsg,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      console.log("🔥 이미지 업로드 시작:", file.name)

      // 파일을 Base64로 변환
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string
        console.log("🔄 Base64 변환 완료")

        try {
          // 서버에 업로드
          const response = await fetch("/api/admin/upload-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64Data,
              filename: file.name,
            }),
          })

          const result = await response.json()
          console.log("📥 업로드 응답:", result)

          if (result.success) {
            console.log("✅ 이미지 업로드 성공:", result.url)
            setPreviewUrl(result.url)
            onChange(result.url)
            setError("")
            setDebugInfo(null)
            toast({
              title: "업로드 완료",
              description: "이미지가 성공적으로 업로드되었습니다.",
            })
          } else {
            console.error("💥 이미지 업로드 실패:", result)
            setError(result.error || "업로드 실패")
            setDebugInfo(result.debugInfo)
            throw new Error(result.error || "업로드 실패")
          }
        } catch (error: any) {
          console.error("💥 이미지 업로드 실패:", error)
          const errorMsg = error.message || "이미지 업로드에 실패했습니다."
          setError(errorMsg)
          toast({
            title: "업로드 실패",
            description: errorMsg,
            variant: "destructive",
          })
        } finally {
          setIsUploading(false)
        }
      }

      reader.onerror = () => {
        console.error("💥 파일 읽기 실패")
        const errorMsg = "파일을 읽을 수 없습니다."
        setError(errorMsg)
        toast({
          title: "오류",
          description: errorMsg,
          variant: "destructive",
        })
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error: any) {
      console.error("💥 파일 처리 실패:", error)
      const errorMsg = "파일 처리 중 오류가 발생했습니다."
      setError(errorMsg)
      toast({
        title: "오류",
        description: errorMsg,
        variant: "destructive",
      })
      setIsUploading(false)
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = () => {
    setPreviewUrl("")
    onChange("")
    setError("")
    setDebugInfo(null)
    toast({
      title: "삭제 완료",
      description: "이미지가 제거되었습니다.",
    })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDebugGitHub = async () => {
    try {
      console.log("🔍 GitHub 디버깅 정보 요청...")
      const response = await fetch("/api/admin/debug-github")
      const result = await response.json()
      console.log("🔍 GitHub 디버깅 결과:", result)

      if (result.success) {
        setDebugInfo(result)
        toast({
          title: "디버깅 정보 수집 완료",
          description: "콘솔에서 자세한 정보를 확인하세요.",
        })
      }
    } catch (error) {
      console.error("💥 GitHub 디버깅 실패:", error)
      toast({
        title: "디버깅 실패",
        description: "GitHub 디버깅 정보를 가져올 수 없습니다.",
        variant: "destructive",
      })
    }
  }

  const renderErrorAlert = () => {
    if (!error) return null

    const isRepoNotFound = debugInfo?.connectionTest?.step === "REPO_NOT_FOUND"
    const isTokenInvalid = debugInfo?.connectionTest?.step === "TOKEN_INVALID"
    const isFineGrainedToken = debugInfo?.debugInfo?.tokenType === "fine-grained"
    const isPrivateRepo = debugInfo?.connectionTest?.repoPrivate

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-3">
            <p className="font-medium">{error}</p>

            {/* Fine-grained 토큰 경고 */}
            {isFineGrainedToken && (
              <div className="bg-orange-50 p-4 rounded-md border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Fine-grained 토큰 감지됨
                </h4>
                <p className="text-sm text-orange-700 mb-3">
                  Fine-grained 토큰은 베타 기능이며 복잡한 권한 설정이 필요합니다.{" "}
                  <strong>Classic 토큰 사용을 강력히 권장</strong>합니다.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-700 border-orange-300 hover:bg-orange-50 bg-transparent"
                  onClick={() => window.open("https://github.com/settings/tokens/new", "_blank")}
                >
                  <Key className="h-3 w-3 mr-1" />
                  Classic 토큰 생성하기
                </Button>
              </div>
            )}

            {/* 저장소 접근 문제 */}
            {isRepoNotFound && !isFineGrainedToken && (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <EyeOff className="h-4 w-4 mr-2" />
                  저장소 접근 문제
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  저장소 <code className="bg-red-100 px-1 rounded">smk140/skm-partners</code>에 접근할 수 없습니다.
                </p>

                <div className="space-y-3">
                  <div className="bg-red-100 p-3 rounded border border-red-200">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      <Eye className="h-3 w-3 inline mr-1" />
                      해결 방법 1: 저장소를 공개로 변경 (권장)
                    </p>
                    <ol className="list-decimal list-inside text-sm text-red-700 space-y-1 ml-4">
                      <li>GitHub 저장소 페이지로 이동</li>
                      <li>Settings 탭 클릭</li>
                      <li>하단 "Danger Zone"에서 "Change visibility"</li>
                      <li>"Make public" 선택</li>
                    </ol>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                      onClick={() => window.open("https://github.com/smk140/skm-partners/settings", "_blank")}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      저장소 설정으로 이동
                    </Button>
                  </div>

                  <div className="bg-red-100 p-3 rounded border border-red-200">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      <Key className="h-3 w-3 inline mr-1" />
                      해결 방법 2: Classic 토큰 권한 확인
                    </p>
                    <div className="text-sm text-red-700 space-y-2">
                      <p>새 Classic 토큰 생성 시 다음 권한 필수:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>
                          <strong>repo</strong> - Full control of private repositories
                        </li>
                        <li>
                          <strong>workflow</strong> - Update GitHub Action workflows
                        </li>
                      </ul>
                      <div className="bg-red-200 p-2 rounded mt-2 font-mono text-xs">
                        <div>토큰 형식: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
                        <div>Fine-grained 토큰(github_pat_)은 사용하지 마세요!</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                      onClick={() => window.open("https://github.com/settings/tokens/new", "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Classic 토큰 생성
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 토큰 무효 */}
            {isTokenInvalid && (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  토큰 인증 실패
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  GitHub 토큰이 유효하지 않거나 만료되었습니다. 새로운 Classic 토큰을 생성하세요.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-700 border-red-300 hover:bg-red-50 bg-transparent"
                  onClick={() => window.open("https://github.com/settings/tokens/new", "_blank")}
                >
                  <Key className="h-3 w-3 mr-1" />새 Classic 토큰 생성
                </Button>
              </div>
            )}

            {/* 권장사항 표시 */}
            {debugInfo?.recommendations && debugInfo.recommendations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">추가 권장사항:</p>
                {debugInfo.recommendations.slice(0, 3).map((rec: any, index: number) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm border ${
                      rec.priority === "high"
                        ? "bg-red-50 border-red-200"
                        : rec.priority === "medium"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-gray-600 text-xs">{rec.description}</p>
                    {rec.url && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-blue-600 text-xs"
                        onClick={() => window.open(rec.url, "_blank")}
                      >
                        {rec.action} <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {debugInfo && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">기술적 디버깅 정보 보기</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40 text-gray-800">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>

      {renderErrorAlert()}

      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="미리보기"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    console.error("이미지 로드 실패:", previewUrl)
                    e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    제거
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="truncate">URL: {previewUrl}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">이미지를 업로드하세요</p>
              <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF 파일 (최대 10MB)</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              variant={previewUrl ? "outline" : "default"}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {previewUrl ? "다른 이미지 선택" : "이미지 업로드"}
                </>
              )}
            </Button>

            {error && (
              <Button onClick={handleDebugGitHub} variant="outline" size="sm" className="w-full text-xs bg-transparent">
                <AlertCircle className="h-3 w-3 mr-2" />
                GitHub 설정 진단
              </Button>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}
