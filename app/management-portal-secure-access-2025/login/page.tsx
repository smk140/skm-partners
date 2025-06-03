"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Lock, AlertTriangle } from "lucide-react"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        const data = await response.json()

        // 로그인 성공 시 인증 정보 저장
        localStorage.setItem("adminAuth", "true")
        localStorage.setItem("adminLoginTime", Date.now().toString())
        sessionStorage.setItem("adminSession", "active")

        console.log("Login successful, redirecting to dashboard")

        // 대시보드로 리디렉션
        router.push("/management-portal-secure-access-2025/dashboard")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "로그인에 실패했습니다.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("로그인 중 오류가 발생했습니다.")
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
          <CardTitle className="text-2xl font-bold text-white">관리자 로그인</CardTitle>
          <CardDescription className="text-slate-300">관리자 계정으로 로그인하세요</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-300">
                <p className="font-medium text-yellow-500 mb-2">보안 알림</p>
                <ul className="space-y-1 text-xs">
                  <li>• 모든 로그인 시도가 기록됩니다</li>
                  <li>• 잘못된 로그인 시도 시 계정이 잠길 수 있습니다</li>
                  <li>• 세션은 24시간 후 자동 만료됩니다</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">
                사용자명
              </Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="관리자 사용자명을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-800 p-3 rounded-md text-sm text-red-200">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>로그인 중...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>로그인</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
