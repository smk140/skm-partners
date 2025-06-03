import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminAuthCheck } from "@/components/admin/auth-check"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthCheck>
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </div>
    </AdminAuthCheck>
  )
}
