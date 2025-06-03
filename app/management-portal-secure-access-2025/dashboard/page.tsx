"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Building, MessageSquare, Shield, Activity, TrendingUp, Clock } from "lucide-react"

interface DashboardStats {
  totalInquiries: number
  totalProperties: number
  recentLogins: number
  systemStatus: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    totalProperties: 0,
    recentLogins: 0,
    systemStatus: "정상",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 실제 API 호출로 통계 데이터 가져오기
        const response = await fetch("/api/admin/dashboard-stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const quickActions = [
    {
      title: "문의 관리",
      description: "고객 문의를 확인하고 관리합니다",
      icon: MessageSquare,
      href: "/management-portal-secure-access-2025/inquiries",
      color: "bg-blue-500",
    },
    {
      title: "부동산 관리",
      description: "부동산 매물을 관리합니다",
      icon: Building,
      href: "/management-portal-secure-access-2025/real-estate",
      color: "bg-green-500",
    },
    {
      title: "회사 정보",
      description: "회사 정보를 수정합니다",
      icon: Users,
      href: "/management-portal-secure-access-2025/company",
      color: "bg-purple-500",
    },
    {
      title: "시스템 로그",
      description: "시스템 접근 로그를 확인합니다",
      icon: Shield,
      href: "/management-portal-secure-access-2025/logs",
      color: "bg-red-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">SKM파트너스 관리 시스템에 오신 것을 환영합니다</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Activity className="w-4 h-4 mr-1" />
          시스템 정상
        </Badge>
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
              <TrendingUp className="inline w-3 h-3 mr-1" />
              지난 주 대비 +12%
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
            <p className="text-xs text-muted-foreground">활성 매물 기준</p>
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
            <div className="text-2xl font-bold text-green-600">{stats.systemStatus}</div>
            <p className="text-xs text-muted-foreground">모든 서비스 정상 운영</p>
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
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => (window.location.href = action.href)}>
                  바로가기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>시스템의 최근 활동 내역입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">새로운 문의가 접수되었습니다</p>
                <p className="text-xs text-gray-500">5분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">부동산 매물이 업데이트되었습니다</p>
                <p className="text-xs text-gray-500">1시간 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">시스템 백업이 완료되었습니다</p>
                <p className="text-xs text-gray-500">3시간 전</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
