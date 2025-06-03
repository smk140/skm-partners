"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      console.log("Checking auth for pathname:", pathname)

      // 메인 관리자 페이지와 로그인 페이지는 인증 없이 접근 가능
      if (
        pathname === "/management-portal-secure-access-2025" ||
        pathname === "/management-portal-secure-access-2025/login"
      ) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // 다른 관리자 페이지들은 인증 필요
      const consentCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-privacy-consent="))
        ?.split("=")[1]

      const sessionCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-session-id="))
        ?.split("=")[1]

      const adminAuth = localStorage.getItem("adminAuth")
      const adminSession = sessionStorage.getItem("adminSession")

      console.log("Auth check details:", {
        consentCookie,
        sessionCookie: sessionCookie ? "exists" : "missing",
        adminAuth,
        adminSession,
        pathname,
      })

      // 모든 조건을 만족해야 인증된 것으로 간주
      const isFullyAuthenticated =
        consentCookie === "true" && sessionCookie && adminAuth === "true" && adminSession === "active"

      if (isFullyAuthenticated) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        // 인증되지 않은 상태에서 보호된 페이지 접근 시 로그인으로 리디렉션
        console.log("Not authenticated, redirecting to login")
        router.push("/management-portal-secure-access-2025/login")
        return
      }

      setIsLoading(false)
    }

    // 초기 체크
    checkAuth()

    // 스토리지 변경 감지
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    // 주기적으로 인증 상태 체크 (3초마다)
    const interval = setInterval(checkAuth, 3000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [pathname, router])

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  // 메인 관리자 페이지나 로그인 페이지는 사이드바 없이 표시
  if (
    pathname === "/management-portal-secure-access-2025" ||
    pathname === "/management-portal-secure-access-2025/login"
  ) {
    return <div className="min-h-screen bg-slate-50">{children}</div>
  }

  // 인증되지 않은 경우 로그인 페이지로 리디렉션 (이미 위에서 처리됨)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">로그인 페이지로 이동 중...</p>
        </div>
      </div>
    )
  }

  // 완전히 인증된 경우에만 사이드바와 함께 표시
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
