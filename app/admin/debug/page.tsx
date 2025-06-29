"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertTriangle, Github } from "lucide-react"

interface ConnectionStatus {
  success: boolean
  message: string
  details?: any
}

export default function DebugPage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/debug-github")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        success: false,
        message: "API 라우트 호출에 실패했습니다. 서버 로그를 확인하세요.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">GitHub 연동 상태</h1>
        <p className="text-gray-600 mb-8">웹사이트 데이터가 저장되는 GitHub 저장소와의 연동 상태를 확인합니다.</p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              연결 테스트 결과
            </CardTitle>
            <CardDescription>
              이곳에서 실패 메시지가 보인다면 Vercel 프로젝트의 환경 변수를 확인해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                연결 상태를 확인하는 중...
              </div>
            ) : status ? (
              <div
                className={`${status.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} p-4 rounded-md border`}
              >
                <div className="flex items-start">
                  {status.success ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className={`${status.success ? "text-green-800" : "text-red-800"} font-semibold`}>
                      {status.success ? "연결 성공" : "연결 실패"}
                    </h3>
                    <p className={`${status.success ? "text-green-700" : "text-red-700"} mt-1 text-sm`}>
                      {status.message}
                    </p>
                  </div>
                </div>
                {status.details && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">세부 정보:</h4>
                    <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(status.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p>상태 정보를 불러올 수 없습니다.</p>
            )}
            <Button onClick={checkConnection} disabled={loading} className="w-full mt-6">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              다시 확인하기
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>문제 해결 가이드</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-2">
            <p>
              1. <strong>`404` 오류:</strong> `GITHUB_REPO_OWNER` 또는 `GITHUB_REPO_NAME` 환경 변수가 잘못되었을 수
              있습니다.
            </p>
            <p>
              2. <strong>`401` 또는 `Bad credentials` 오류:</strong> `GITHUB_TOKEN`이 만료되었거나 잘못되었습니다.
            </p>
            <p>
              3. <strong>`403` 또는 권한 오류:</strong> `GITHUB_TOKEN`에 저장소에 대한 `repo` (읽기/쓰기) 권한이
              없습니다.
            </p>
            <p>
              4. <strong>환경 변수 누락 오류:</strong> Vercel 프로젝트 설정에서 `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`,
              `GITHUB_REPO_NAME`을 모두 설정했는지 확인하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
