"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle } from "lucide-react"

export default function AdminPrivacyConsentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [consent, setConsent] = useState(false)

  // 이미 동의했는지 확인
  useEffect(() => {
    const consentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-privacy-consent="))
      ?.split("=")[1]

    const adminAuth = localStorage.getItem("adminAuth")
    const adminSession = sessionStorage.getItem("adminSession")

    if (consentCookie === "true") {
      // 이미 동의했고 로그인도 되어 있으면 대시보드로 이동
      if (adminAuth === "true" && adminSession === "active") {
        console.log("Already consented and logged in, redirecting to dashboard")
        router.push("/admin/dashboard")
      } else {
        // 동의만 했고 로그인은 안 했으면 로그인 페이지로 이동
        console.log("Already consented but not logged in, redirecting to login")
        router.push("/management-portal-secure-access-2025/login")
      }
    }
  }, [router])

  const handleConsent = async () => {
    if (!consent) return

    setIsLoading(true)

    try {
      // 세션 ID 생성
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

      // 개인정보 동의 쿠키 설정
      document.cookie = "admin-privacy-consent=true; path=/; max-age=86400"
      document.cookie = `admin-session-id=${sessionId}; path=/; max-age=86400`

      // 서버에 세션 등록 (실제로는 API 호출해야 함)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SKM파트너스</h1>
          <p className="text-slate-600">관리자 시스템</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">개인정보 수집 및 이용 동의</CardTitle>
            <CardDescription className="text-center">
              관리자 시스템 이용을 위해 개인정보 수집 및 이용에 동의해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">보안 알림</p>
                <p className="mt-1">
                  이 페이지는 관리자 전용 페이지입니다. 허가되지 않은 접근은 법적 제재를 받을 수 있습니다.
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 h-48 overflow-y-auto text-sm text-slate-700 bg-slate-50">
              <h3 className="font-bold mb-2">개인정보 수집 및 이용 동의</h3>
              <p className="mb-2">SKM파트너스는 관리자 시스템 이용을 위해 아래와 같이 개인정보를 수집 및 이용합니다.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>수집항목: IP 주소, 브라우저 정보, 접속 로그</li>
                <li>수집목적: 관리자 인증, 보안 로그 기록, 부정 접속 방지</li>
                <li>보유기간: 접속일로부터 1년</li>
              </ul>
              <p className="mt-2">
                위 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 동의 거부 시 관리자 시스템을 이용할 수
                없습니다.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(!!checked)} />
              <Label htmlFor="consent" className="text-sm font-medium">
                위 개인정보 수집 및 이용에 동의합니다.
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleConsent}
              disabled={!consent || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "처리 중..." : "동의하고 계속하기"}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            문제가 있으신가요?{" "}
            <a href="mailto:bykim@skm.kr" className="text-blue-600 hover:text-blue-700">
              관리자에게 문의
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
