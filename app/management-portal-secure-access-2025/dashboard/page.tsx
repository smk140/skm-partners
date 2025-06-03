"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building, MessageSquare, BarChart3, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalInquiries: 0,
    totalProperties: 0,
    totalUsers: 0,
    recentActivity: 0,
  })

  useEffect(() => {
    // 임시 통계 데이터
    setStats({
      totalInquiries: 45,
      totalProperties: 23,
      totalUsers: 156,
      recentActivity: 12,
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminLoginTime")
    sessionStorage.removeItem("adminSession")
    router.push("/management-portal-secure-access-2025")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">관리자 대시보드</h1>
          <p className="text-slate-600">SKM파트너스 관리 시스템에 오신 것을 환영합니다.</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 문의</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">부동산 매물</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">방문자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 활동</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">in the last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 문의</CardTitle>
            <CardDescription>최근 접수된 고객 문의 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">김○○님</p>
                  <p className="text-sm text-slate-600">부동산 투자 상담 문의</p>
                </div>
                <span className="text-xs text-slate-500">2시간 전</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">이○○님</p>
                  <p className="text-sm text-slate-600">매물 정보 요청</p>
                </div>
                <span className="text-xs text-slate-500">5시간 전</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">박○○님</p>
                  <p className="text-sm text-slate-600">투자 컨설팅 예약</p>
                </div>
                <span className="text-xs text-slate-500">1일 전</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시스템 상태</CardTitle>
            <CardDescription>현재 시스템 운영 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">웹사이트 상태</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">정상</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">데이터베이스</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">정상</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">이메일 서비스</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">정상</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">백업 상태</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">진행중</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
