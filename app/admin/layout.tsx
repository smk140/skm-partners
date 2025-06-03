import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AdminAuthCheck } from "@/components/admin/auth-check"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SKM파트너스 - 관리자 페이지",
  description: "SKM파트너스 관리자 페이지입니다.",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AdminAuthCheck>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 ml-0 md:ml-64 p-6 md:p-8 overflow-auto">{children}</main>
        <Toaster />
      </div>
    </AdminAuthCheck>
  )
}
