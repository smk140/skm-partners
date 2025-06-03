"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("adminAuth") === "true"
      const session = sessionStorage.getItem("adminSession") === "active"
      const loginTime = localStorage.getItem("adminLoginTime")

      // 세션이 없거나 24시간이 지났으면 로그아웃
      const isSessionValid = session && loginTime && Date.now() - Number.parseInt(loginTime) < 24 * 60 * 60 * 1000

      const isAuthenticated = auth && isSessionValid
      setIsAuthenticated(isAuthenticated)

      if (!isAuthenticated) {
        // 인증 정보 정리
        localStorage.removeItem("adminAuth")
        localStorage.removeItem("adminLoginTime")
        sessionStorage.removeItem("adminSession")
        router.push("/management-portal-secure-access-2025/login")
      } else {
        // 인증된 사용자의 관리자 패널 접속 로그
        const currentPage = window.location.pathname
        fetch("/api/admin/access-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: currentPage }),
        }).catch((error) => {
          console.error("Failed to log admin access:", error)
        })
      }
    }

    checkAuth()

    // 페이지 포커스 시 인증 상태 재확인
    const handleFocus = () => {
      checkAuth()
    }

    // 페이지 언로드 시 세션 정리 (브라우저 종료 시)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("adminSession")
    }

    window.addEventListener("focus", handleFocus)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    return null
  }

  return <>{children}</>
}
