"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, Lock } from "lucide-react"

export default function AdminPrivacyConsentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [consent, setConsent] = useState(false)

  const handleConsent = async () => {
    if (!consent) return

    setIsLoading(true)

    try {
      // 세션 ID 생성
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

      // 개인정보 동의 쿠키 설정
      document.cookie = "admin-privacy-consent=true; path=/; max-age=86400; SameSite=Strict"
      document.cookie = `admin-session-id=${sessionId}; path=/; max-age=86400; SameSite=Strict`

      console.log("Privacy consent given, session ID:", sessionId)

      // 로그인 페이지로 이동
      router.push("/management-portal-secure-access-2025/login")
    } catch (error) {
      console.error("Error during consent:", error)
      alert("개인정보 동의 처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SKM파트너스</h1>
          <p className="text-slate-300">관리자 시스템 접근</p>
        </div>

        <Card className="shadow-xl border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">개인정보 수집 및 이용 동의</CardTitle>
            <CardDescription className="text-center text-slate-300">
              관리자 시스템 이용을 위해 개인정보 수집 및 이용에 동의해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-200">
                <p className="font-medium">보안 알림</p>
                <p className="mt-1">
                  이 페이지는 관리자 전용 페이지입니다. 허가되지 않은 접근은 법적 제재를 받을 수 있습니다.
                </p>
              </div>
            </div>

            <div className="border border-slate-600 rounded-lg p-4 h-48 overflow-y-auto text-sm text-slate-300 bg-slate-700/30">
              <h3 className="font-bold mb-2 text-white">개인정보 수집 및 이용 동의</h3>
              <p className="mb-2">SKM파트너스는 관리자 시스템 이용을 위해 아래와 같이 개인정보를 수집 및 이용합니다.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>수집항목: IP 주소, 브라우저 정보, 접속 로그, 관리자 활동 기록</li>
                <li>수집목적: 관리자 인증, 보안 로그 기록, 부정 접속 방지, 시스템 보안 강화</li>
                <li>보유기간: 접속일로부터 1년</li>
                <li>제3자 제공: 법적 요구가 있는 경우에만 제공</li>
              </ul>
              <p className="mt-2">
                위 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 동의 거부 시 관리자 시스템을 이용할 수
                없습니다.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(!!checked)}
                className="border-slate-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
              <Label htmlFor="consent" className="text-sm font-medium text-slate-300">
                위 개인정보 수집 및 이용에 동의합니다.
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleConsent}
              disabled={!consent || isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>처리 중...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>동의하고 관리자 시스템 접근</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            문제가 있으신가요?{" "}
            <a href="mailto:bykim@skm.kr" className="text-red-400 hover:text-red-300">
              관리자에게 문의
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
