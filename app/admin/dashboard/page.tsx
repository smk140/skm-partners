"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Building, MessageSquare, Shield, Activity, Clock, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalInquiries: number
  totalProperties: number
  recentLogins: number
  systemStatus: string
  pendingInquiries: number
  activeProperties: number
}

interface RecentActivity {
  id: number
  type: string
  message: string
  timestamp: string
  status: "success" | "warning" | "info"
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    totalProperties: 0,
    recentLogins: 0,
    systemStatus: "로딩중",
    pendingInquiries: 0,
    activeProperties: 0,
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // 실제 통계 데이터 가져오기
      const [statsResponse, activitiesResponse] = await Promise.all([
        fetch("/api/admin/dashboard-stats"),
        fetch("/api/admin/recent-activities"),
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json()
        setRecentActivities(activitiesData.activities || [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      // 기본값 설정
      setStats({
        totalInquiries: 0,
        totalProperties: 0,
        recentLogins: 0,
        systemStatus: "오류",
        pendingInquiries: 0,
        activeProperties: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminLoginTime")
    sessionStorage.removeItem("adminSession")
    document.cookie = "admin-privacy-consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "admin-session-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/management-portal-secure-access-2025")
  }

  const quickActions = [
    {
      title: "문의 관리",
      description: "고객 문의를 확인하고 관리합니다",
      icon: MessageSquare,
      href: "/admin/inquiries",
      color: "bg-blue-500",
      count: stats.pendingInquiries,
    },
    {
      title: "부동산 관리",
      description: "부동산 매물을 관리합니다",
      icon: Building,
      href: "/admin/real-estate",
      color: "bg-green-500",
      count: stats.activeProperties,
    },
    {
      title: "회사 정보",
      description: "회사 정보를 수정합니다",
      icon: Users,
      href: "/admin/company",
      color: "bg-purple-500",
      count: null,
    },
    {
      title: "시스템 로그",
      description: "시스템 접근 로그를 확인합니다",
      icon: Shield,
      href: "/admin/logs",
      color: "bg-red-500",
      count: stats.recentLogins,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "정상":
        return "text-green-600 border-green-600"
      case "경고":
        return "text-yellow-600 border-yellow-600"
      case "오류":
        return "text-red-600 border-red-600"
      default:
        return "text-gray-600 border-gray-600"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "inquiry":
        return "🔵"
      case "property":
        return "🟢"
      case "login":
        return "🟡"
      case "system":
        return "🔴"
      default:
        return "⚪"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">SKM파트너스 관리 시스템에 오신 것을 환영합니다</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className={getStatusColor(stats.systemStatus)}>
            <Activity className="w-4 h-4 mr-1" />
            시스템 {stats.systemStatus}
          </Badge>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 문의</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">대기중: {stats.pendingInquiries}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 매물</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">활성: {stats.activeProperties}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 로그인</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentLogins}</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline w-3 h-3 mr-1" />
              지난 24시간
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">시스템 상태</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.systemStatus === "정상" ? "text-green-600" : "text-red-600"}`}>
              {stats.systemStatus}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.systemStatus === "정상" ? "모든 서비스 정상 운영" : "시스템 점검 필요"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 작업 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  {action.count !== null && (
                    <Badge variant="secondary" className="text-xs">
                      {action.count}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => router.push(action.href)}>
                  바로가기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>시스템의 최근 활동 내역입니다</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            새로고침
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">데이터를 불러오는 중...</p>
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">최근 활동이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "success"
                        ? "default"
                        : activity.status === "warning"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {activity.status === "success" ? "성공" : activity.status === "warning" ? "경고" : "정보"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
