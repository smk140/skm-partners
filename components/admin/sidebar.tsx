"use client"
import { useRouter, usePathname } from "next/navigation"
import { Building2, Home, MessageSquare, Settings, Shield, Users, MessageCircle, LogOut, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "대시보드",
    icon: Home,
    path: "/admin/dashboard",
  },
  {
    title: "문의 관리",
    icon: MessageSquare,
    path: "/admin/inquiries",
  },
  {
    title: "부동산 관리",
    icon: Building2,
    path: "/admin/real-estate",
  },
  {
    title: "회사 정보",
    icon: Users,
    path: "/admin/company",
  },
  {
    title: "보안 관리",
    icon: Shield,
    path: "/admin/security",
  },
  {
    title: "시스템 로그",
    icon: Eye,
    path: "/admin/logs",
  },
  {
    title: "사이트 설정",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    title: "디스코드 테스트",
    icon: MessageCircle,
    path: "/admin/test-discord",
  },
]

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const checkAuthAndNavigate = (path: string) => {
    // 인증 상태 확인
    const adminAuth = localStorage.getItem("adminAuth")
    const adminSession = sessionStorage.getItem("adminSession")
    const loginTime = localStorage.getItem("adminLoginTime")

    if (!adminAuth || !adminSession || adminAuth !== "true" || adminSession !== "active") {
      // 인증 정보 정리
      localStorage.removeItem("adminAuth")
      localStorage.removeItem("adminLoginTime")
      sessionStorage.removeItem("adminSession")

      router.push("/management-portal-secure-access-2025/login")
      return
    }

    // 24시간 세션 만료 체크
    if (loginTime) {
      const loginTimestamp = Number.parseInt(loginTime)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (now - loginTimestamp > twentyFourHours) {
        // 세션 만료 시 정리
        localStorage.removeItem("adminAuth")
        localStorage.removeItem("adminLoginTime")
        sessionStorage.removeItem("adminSession")

        router.push("/management-portal-secure-access-2025/login")
        return
      }
    }

    // 인증 통과 시 페이지 이동
    router.push(path)
  }

  const handleLogout = () => {
    // 인증 정보 정리
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminLoginTime")
    sessionStorage.removeItem("adminSession")

    // 개인정보 동의 쿠키도 삭제
    document.cookie = "admin-privacy-consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "admin-session-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    router.push("/management-portal-secure-access-2025")
  }

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900">
      <div className="flex h-16 items-center justify-center border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
            <span className="text-sm font-bold text-white">S</span>
          </div>
          <span className="text-lg font-semibold text-white">SKM 관리자</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white",
                isActive && "bg-slate-800 text-white",
              )}
              onClick={() => checkAuthAndNavigate(item.path)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.title}
            </Button>
          )
        })}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  )
}
