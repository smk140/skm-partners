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
      console.log("Checking auth for admin layout:", pathname)

      // 인증 상태 확인
      const adminAuth = localStorage.getItem("adminAuth")
      const adminSession = sessionStorage.getItem("adminSession")
      const consentCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-privacy-consent="))
        ?.split("=")[1]

      console.log("Auth state:", { adminAuth, adminSession, consentCookie })

      // 인증되지 않은 경우 로그인 페이지로 리디렉션
      if (adminAuth !== "true" || adminSession !== "active" || consentCookie !== "true") {
        console.log("Not authenticated, redirecting to consent page")
        setIsAuthenticated(false)
        router.push("/management-portal-secure-access-2025")
        return
      }

      // 인증된 경우
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
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

  // 인증되지 않은 경우 (리디렉션 중)
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

  // 인증된 경우 사이드바와 함께 표시
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
