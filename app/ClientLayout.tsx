"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ConsultationButton } from "@/components/consultation-button"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // 관리자 경로인지 확인
  const isAdminRoute = pathname?.startsWith("/management-portal-secure-access-2024")

  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            {/* 관리자 경로가 아닐 때만 헤더 표시 */}
            {!isAdminRoute && <SiteHeader />}
            <div className="flex-1">{children}</div>
            {/* 관리자 경로가 아닐 때만 푸터 표시 */}
            {!isAdminRoute && <SiteFooter />}
            {/* 관리자 경로가 아닐 때만 빠른 문의 버튼 표시 */}
            {!isAdminRoute && <ConsultationButton />}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
