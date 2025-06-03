"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react"

export default function AdminEntryPage() {
  const [isAgreed, setIsAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAgreeAndProceed = async () => {
    if (!isAgreed) return

    setIsLoading(true)
    setError(null)

    try {
      // 세션 ID 생성
      const sessionId = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // 쿠키 설정
      document.cookie = `admin-privacy-consent=true; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`
      document.cookie = `admin-session-id=${sessionId}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`

      console.log("Setting cookies and registering session:", sessionId)

      // 서버에 세션 등록 및 IP 검증 요청
      const response = await fetch("/api/admin/register-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          checkUnauthorizedAccess: true, // 허용되지 않은 IP 접근 검증 요청
        }),
      })

      if (response.ok) {
        console.log("Session registered successfully")
        // 로그인 페이지로 이동
        router.push("/management-portal-secure-access-2025/login")
      } else {
        const errorData = await response.json()
        console.error("Failed to register session:", errorData)
        setError(`세션 등록 실패: ${errorData.message || "알 수 없는 오류"}`)
      }
    } catch (error) {
      console.error("Error:", error)
      setError("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">관리자 시스템 접근</CardTitle>
          <CardDescription className="text-slate-300">
            보안이 강화된 관리자 시스템입니다.
            <br />
            접근하기 전에 개인정보 처리방침에 동의해주세요.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-300">
                <p className="font-medium text-yellow-500 mb-2">보안 알림</p>
                <ul className="space-y-1 text-xs">
                  <li>• 모든 접속 기록이 저장됩니다</li>
                  <li>• 비정상적인 접근 시도는 자동 차단됩니다</li>
                  <li>• 관리자 활동은 실시간 모니터링됩니다</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <h3 className="font-medium text-white mb-3 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              개인정보 처리방침
            </h3>
            <div className="text-sm text-slate-300 space-y-2 max-h-32 overflow-y-auto">
              <p>1. 수집하는 개인정보: IP 주소, 접속 시간, 브라우저 정보</p>
              <p>2. 수집 목적: 시스템 보안 및 접근 관리</p>
              <p>3. 보유 기간: 접속 종료 후 24시간</p>
              <p>4. 제3자 제공: 법적 요구가 있는 경우에만 제공</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy-agreement"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
              className="border-slate-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <label htmlFor="privacy-agreement" className="text-sm text-slate-300 cursor-pointer">
              개인정보 처리방침에 동의합니다
            </label>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-800 p-3 rounded-md text-sm text-red-200">{error}</div>
          )}

          <Button
            onClick={handleAgreeAndProceed}
            disabled={!isAgreed || isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>처리 중...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>동의하고 관리자 시스템 접근</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
