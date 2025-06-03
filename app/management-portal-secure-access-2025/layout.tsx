"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

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
      // 메인 관리자 페이지는 사이드바 없이 표시
      if (pathname === "/management-portal-secure-access-2025") {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // 개인정보 동의 쿠키 확인
      const consentCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-privacy-consent="))
        ?.split("=")[1]

      const sessionCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-session-id="))
        ?.split("=")[1]

      // 로그인 상태 확인
      const adminAuth = localStorage.getItem("adminAuth")
      const adminSession = sessionStorage.getItem("adminSession")

      console.log("Auth check:", {
        consentCookie,
        sessionCookie: sessionCookie ? "exists" : "missing",
        adminAuth,
        adminSession,
        pathname,
      })

      // 모든 조건을 만족해야 인증된 것으로 간주
      if (consentCookie === "true" && sessionCookie && adminAuth === "true" && adminSession === "active") {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        // 인증되지 않은 상태에서 관리자 페이지 접근 시 메인으로 리디렉션
        if (
          pathname !== "/management-portal-secure-access-2025" &&
          pathname !== "/management-portal-secure-access-2025/login"
        ) {
          router.push("/management-portal-secure-access-2025")
          return
        }
      }

      setIsLoading(false)
    }

    checkAuth()

    // 스토리지 변경 감지
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    // 주기적으로 인증 상태 체크 (5초마다)
    const interval = setInterval(checkAuth, 5000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [pathname, router])

  // 로딩 중이거나 메인 관리자 페이지인 경우 사이드바 없이 표시
  if (isLoading || pathname === "/management-portal-secure-access-2025") {
    return <div className="min-h-screen bg-slate-50">{children}</div>
  }

  // 인증되지 않은 경우 사이드바 없이 표시
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-slate-50">{children}</div>
  }

  // 완전히 인증된 경우에만 사이드바와 함께 표시
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
