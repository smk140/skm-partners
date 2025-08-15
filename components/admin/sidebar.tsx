"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MessageSquare, Settings, Shield, FileText, Activity, Building2 } from "lucide-react"

const navigation = [
  {
    name: "대시보드",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "회사 정보",
    href: "/admin/company",
    icon: Building2,
  },
  {
    name: "문의 관리",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    name: "로그 관리",
    href: "/admin/logs",
    icon: FileText,
  },
  {
    name: "보안 관리",
    href: "/admin/security",
    icon: Shield,
  },
  {
    name: "시스템 설정",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    name: "디버그",
    href: "/admin/debug",
    icon: Activity,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">SKM 관리자</h1>
      </div>
      <nav className="flex flex-1 flex-col px-6 pb-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
