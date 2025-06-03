"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [failureCount, setFailureCount] = useState(0)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  // 개인정보 동의 확인
  useEffect(() => {
    const consentCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-privacy-consent="))
      ?.split("=")[1]

    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin-session-id="))
      ?.split("=")[1]

    if (!consentCookie || consentCookie !== "true" || !sessionCookie) {
      // 개인정보 동의하지 않은 경우 메인 페이지로 리디렉션
      router.push("/management-portal-secure-access-2025")
      return
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getClientIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch {
      return "unknown"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const clientIP = await getClientIP()

    const getClientInfo = () => {
      return {
        ip_address: clientIP,
        user_agent: navigator.userAgent,
      }
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (formData.username === "admin" && formData.password === "!@sigkgk18!@") {
        // 로그인 성공 시 실패 횟수 초기화
        setFailureCount(0)

        // 로그인 성공 시 세션/쿠키 설정
        const loginTime = Date.now().toString()
        localStorage.setItem("adminAuth", "true")
        localStorage.setItem("adminLoginTime", loginTime)
        sessionStorage.setItem("adminSession", "active")

        // 서버에 로그인 성공 알림
        try {
          await fetch("/api/admin/login-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: formData.username,
              success: true,
              ...getClientInfo(),
            }),
          })
        } catch (error) {
          console.error("Failed to log admin login:", error)
        }

        toast({
          title: "로그인 성공",
          description: "관리자 대시보드로 이동합니다.",
        })

        // 관리자 대시보드로 리디렉션
        router.push("/admin/dashboard")
      } else {
        // 로그인 실패 처리
        const response = await fetch("/api/admin/login-failure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            ...getClientInfo(),
          }),
        })

        const result = await response.json()

        if (result.blocked) {
          toast({
            title: "계정 차단",
            description: `로그인 3회 실패로 인해 IP가 차단되었습니다.`,
            variant: "destructive",
          })

          // 차단 페이지로 리디렉션
          setTimeout(() => {
            router.push("/blocked")
          }, 2000)
        } else {
          setFailureCount(result.attempts)
          toast({
            title: "로그인 실패",
            description: `아이디 또는 비밀번호가 올바르지 않습니다. (${result.attempts}/3)`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SKM파트너스</h1>
          <p className="text-slate-600">관리자 시스템</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">관리자 로그인</CardTitle>
            <CardDescription className="text-center text-slate-600">
              관리자 계정으로 로그인하여 시스템에 접근하세요
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700">
                  아이디
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="관리자 아이디를 입력하세요"
                    className="pl-10 h-11"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    className="pl-10 pr-10 h-11"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  ⚠️ 보안 알림: 로그인 3회 실패 시 IP가 자동으로 차단됩니다.
                  {failureCount > 0 && (
                    <span className="block mt-1 font-medium text-red-800">현재 실패 횟수: {failureCount}/3</span>
                  )}
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    로그인 중...
                  </div>
                ) : (
                  "로그인"
                )}
              </Button>
            </CardFooter>
          </form>
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
      <Toaster />
    </div>
  )
}
