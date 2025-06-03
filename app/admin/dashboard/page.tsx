"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building,
  MessageSquare,
  Shield,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react"

interface DashboardStats {
  totalInquiries: number
  totalRealEstate: number
  totalVacancies: number
  blockedIPs: number
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
    status: "success" | "warning" | "error"
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    totalRealEstate: 0,
    totalVacancies: 0,
    blockedIPs: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 대시보드 데이터 로드
    const loadDashboardData = async () => {
      try {
        // 실제 API 호출로 대체 가능
        setStats({
          totalInquiries: 45,
          totalRealEstate: 12,
          totalVacancies: 8,
          blockedIPs: 3,
          recentActivity: [
            {
              id: "1",
              type: "inquiry",
              message: "새로운 상담 신청이 접수되었습니다",
              timestamp: new Date().toISOString(),
              status: "success",
            },
            {
              id: "2",
              type: "security",
              message: "IP 주소가 자동 차단되었습니다",
              timestamp: new Date(Date.now() - 300000).toISOString(),
              status: "warning",
            },
            {
              id: "3",
              type: "login",
              message: "관리자 로그인이 성공했습니다",
              timestamp: new Date(Date.now() - 600000).toISOString(),
              status: "success",
            },
          ],
        })
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-1">SKM파트너스 관리 시스템에 오신 것을 환영합니다</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Activity className="w-3 h-3 mr-1" />
            시스템 정상
          </Badge>
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
              <TrendingUp className="inline w-3 h-3 mr-1" />
              전월 대비 +12%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">부동산 매물</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRealEstate}</div>
            <p className="text-xs text-muted-foreground">활성 매물 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">채용 공고</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVacancies}</div>
            <p className="text-xs text-muted-foreground">진행 중인 채용</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">차단된 IP</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.blockedIPs}</div>
            <p className="text-xs text-muted-foreground">보안 차단 목록</p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>시스템에서 발생한 최근 이벤트들</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString("ko-KR", {
                        timeZone: "Asia/Seoul",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
            <CardDescription>자주 사용하는 관리 기능들</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col">
                <MessageSquare className="w-6 h-6 mb-2" />
                <span className="text-sm">문의 관리</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Building className="w-6 h-6 mb-2" />
                <span className="text-sm">부동산 관리</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Users className="w-6 h-6 mb-2" />
                <span className="text-sm">채용 관리</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Shield className="w-6 h-6 mb-2" />
                <span className="text-sm">보안 관리</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 시스템 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 정보</CardTitle>
          <CardDescription>현재 시스템 상태 및 정보</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">마지막 업데이트: {new Date().toLocaleDateString("ko-KR")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">서버 상태: 정상</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">보안 시스템: 활성</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
