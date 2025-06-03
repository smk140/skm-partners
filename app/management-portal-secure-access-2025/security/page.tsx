"use client"

import { useState, useEffect } from "react"
import { Shield, Ban, CheckCircle, AlertTriangle, Eye, Clock, Globe, Activity, Users, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminAuthCheck } from "@/components/admin/auth-check"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SecurityLog {
  id: number
  type: string
  ip_address: string
  user_agent?: string
  username?: string
  details?: string
  admin?: string
  timestamp: string
}

interface AccessLog {
  id: number
  type: string
  ip_address: string
  user_agent?: string
  path: string
  method?: string
  status?: number
  details?: string
  timestamp: string
}

interface AdminLog {
  id: number
  type: string
  admin: string
  ip_address: string
  details: string
  before_data?: any
  after_data?: any
  timestamp: string
}

interface SecurityStats {
  total_events: number
  today_events: number
  login_failures: number
  blocked_ips: number
  unauthorized_access: number
}

export default function AdminSecurityPage() {
  const { toast } = useToast()
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([])
  const [securityStats, setSecurityStats] = useState<SecurityStats>({
    total_events: 0,
    today_events: 0,
    login_failures: 0,
    blocked_ips: 0,
    unauthorized_access: 0,
  })
  const [blockedIPs, setBlockedIPs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIP, setSelectedIP] = useState<string>("")
  const [blockReason, setBlockReason] = useState("")
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false)

  useEffect(() => {
    fetchData()
    // 30초마다 자동 새로고침
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // 보안 로그 가져오기
      const securityResponse = await fetch("/api/admin/security-logs")
      if (securityResponse.ok) {
        const securityData = await securityResponse.json()
        setSecurityLogs(securityData.logs || [])
        setSecurityStats(securityData.stats || {})
      }

      // 접속 로그 가져오기
      const accessResponse = await fetch("/api/admin/access-logs")
      if (accessResponse.ok) {
        const accessData = await accessResponse.json()
        setAccessLogs(accessData.logs || [])
      }

      // 관리자 활동 로그 가져오기
      const adminResponse = await fetch("/api/admin/admin-logs")
      if (adminResponse.ok) {
        const adminData = await adminResponse.json()
        setAdminLogs(adminData.logs || [])
      }

      // 차단된 IP 목록 가져오기
      const blockedResponse = await fetch("/api/admin/ip-block")
      if (blockedResponse.ok) {
        const blockedData = await blockedResponse.json()
        setBlockedIPs(blockedData.blockedIPs || [])
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error)
      toast({
        title: "데이터 로드 실패",
        description: "보안 로그를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlockIP = async () => {
    if (!selectedIP || !blockReason.trim()) {
      toast({
        title: "정보 부족",
        description: "IP 주소와 차단 사유를 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/admin/ip-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip: selectedIP,
          action: "block",
          reason: blockReason,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setBlockedIPs(result.blockedIPs)
        setIsBlockDialogOpen(false)
        setSelectedIP("")
        setBlockReason("")
        toast({
          title: "IP 차단 완료",
          description: `${selectedIP}가 성공적으로 차단되었습니다.`,
        })
        fetchData() // 데이터 새로고침
      } else {
        throw new Error("IP 차단에 실패했습니다.")
      }
    } catch (error) {
      toast({
        title: "차단 실패",
        description: "IP 차단 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleUnblockIP = async () => {
    if (!selectedIP) return

    try {
      const response = await fetch("/api/admin/ip-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip: selectedIP,
          action: "unblock",
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setBlockedIPs(result.blockedIPs)
        setIsUnblockDialogOpen(false)
        setSelectedIP("")
        toast({
          title: "IP 차단 해제 완료",
          description: `${selectedIP}의 차단이 해제되었습니다.`,
        })
        fetchData() // 데이터 새로고침
      } else {
        throw new Error("IP 차단 해제에 실패했습니다.")
      }
    } catch (error) {
      toast({
        title: "차단 해제 실패",
        description: "IP 차단 해제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
  }

  const getLogTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; variant: any; color: string }> = {
      login_success: { label: "로그인 성공", variant: "default", color: "bg-green-500" },
      login_failure: { label: "로그인 실패", variant: "destructive", color: "bg-red-500" },
      ip_blocked: { label: "IP 차단", variant: "destructive", color: "bg-orange-500" },
      ip_unblocked: { label: "IP 해제", variant: "default", color: "bg-blue-500" },
      unauthorized_access: { label: "무단 접근", variant: "destructive", color: "bg-red-600" },
      page_access: { label: "페이지 접속", variant: "secondary", color: "bg-gray-500" },
      api_call: { label: "API 호출", variant: "outline", color: "bg-purple-500" },
      admin_access: { label: "관리자 접속", variant: "default", color: "bg-blue-600" },
      company_update: { label: "회사정보 수정", variant: "default", color: "bg-green-600" },
      property_update: { label: "매물정보 수정", variant: "default", color: "bg-yellow-600" },
      inquiry_update: { label: "문의 처리", variant: "default", color: "bg-indigo-600" },
      settings_change: { label: "설정 변경", variant: "destructive", color: "bg-red-600" },
    }

    const config = typeMap[type] || { label: type, variant: "outline", color: "bg-gray-500" }
    return (
      <Badge variant={config.variant} className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <AdminAuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">보안 데이터를 불러오는 중...</p>
          </div>
        </div>
      </AdminAuthCheck>
    )
  }

  return (
    <AdminAuthCheck>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">보안 관리 센터</h1>
            <p className="text-slate-600 mt-2">실시간 보안 모니터링 및 접속 로그 관리</p>
          </div>
          <Button onClick={fetchData} variant="outline" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            실시간 새로고침
          </Button>
        </div>

        {/* 보안 통계 카드 */}
        <div className="grid gap-6 md:grid-cols-5">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">총 보안 이벤트</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{securityStats.total_events}</div>
              <p className="text-xs text-slate-500">전체 기간</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">오늘 이벤트</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{securityStats.today_events}</div>
              <p className="text-xs text-slate-500">24시간 내</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">로그인 실패</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{securityStats.login_failures}</div>
              <p className="text-xs text-slate-500">누적</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">차단된 IP</CardTitle>
              <Ban className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{blockedIPs.length}</div>
              <p className="text-xs text-slate-500">현재 활성</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">무단 접근</CardTitle>
              <Lock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{securityStats.unauthorized_access}</div>
              <p className="text-xs text-slate-500">누적</p>
            </CardContent>
          </Card>
        </div>

        {/* 차단된 IP 목록 */}
        {blockedIPs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                현재 차단된 IP 목록
              </CardTitle>
              <CardDescription>현재 시스템 접근이 차단된 IP 주소 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {blockedIPs.map((ip) => (
                  <div
                    key={ip}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                  >
                    <Globe className="h-4 w-4 text-red-500" />
                    <span className="font-mono text-sm">{ip}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedIP(ip)
                        setIsUnblockDialogOpen(true)
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                    >
                      해제
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 로그 탭 */}
        <Tabs defaultValue="security" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security">보안 로그</TabsTrigger>
            <TabsTrigger value="access">접속 로그</TabsTrigger>
            <TabsTrigger value="admin">관리자 활동</TabsTrigger>
          </TabsList>

          {/* 보안 로그 탭 */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  보안 이벤트 로그
                </CardTitle>
                <CardDescription>로그인 실패, IP 차단, 무단 접근 등 보안 관련 이벤트</CardDescription>
              </CardHeader>
              <CardContent>
                {securityLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">보안 로그가 없습니다.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시간</TableHead>
                        <TableHead>이벤트 유형</TableHead>
                        <TableHead>IP 주소</TableHead>
                        <TableHead>사용자</TableHead>
                        <TableHead>세부사항</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{formatDate(log.timestamp)}</TableCell>
                          <TableCell>{getLogTypeBadge(log.type)}</TableCell>
                          <TableCell className="font-mono">
                            <div className="flex items-center gap-2">
                              {log.ip_address}
                              {blockedIPs.includes(log.ip_address) && (
                                <Badge variant="destructive" className="text-xs">
                                  차단됨
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{log.username || log.admin || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">{log.details || "-"}</TableCell>
                          <TableCell className="text-right">
                            {!blockedIPs.includes(log.ip_address) ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedIP(log.ip_address)
                                  setIsBlockDialogOpen(true)
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                차단
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedIP(log.ip_address)
                                  setIsUnblockDialogOpen(true)
                                }}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                해제
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 접속 로그 탭 */}
          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  접속 로그
                </CardTitle>
                <CardDescription>페이지 접속, API 호출 등 모든 접속 기록</CardDescription>
              </CardHeader>
              <CardContent>
                {accessLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">접속 로그가 없습니다.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시간</TableHead>
                        <TableHead>유형</TableHead>
                        <TableHead>IP 주소</TableHead>
                        <TableHead>경로</TableHead>
                        <TableHead>메소드</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{formatDate(log.timestamp)}</TableCell>
                          <TableCell>{getLogTypeBadge(log.type)}</TableCell>
                          <TableCell className="font-mono">{log.ip_address}</TableCell>
                          <TableCell className="font-mono text-sm">{log.path}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.method || "GET"}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={log.status && log.status < 400 ? "default" : "destructive"}
                              className={log.status && log.status < 400 ? "bg-green-500" : ""}
                            >
                              {log.status || 200}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 관리자 활동 탭 */}
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  관리자 활동 로그
                </CardTitle>
                <CardDescription>관리자의 모든 활동 및 데이터 변경 기록</CardDescription>
              </CardHeader>
              <CardContent>
                {adminLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">관리자 활동 로그가 없습니다.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>시간</TableHead>
                        <TableHead>활동 유형</TableHead>
                        <TableHead>관리자</TableHead>
                        <TableHead>IP 주소</TableHead>
                        <TableHead>세부사항</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{formatDate(log.timestamp)}</TableCell>
                          <TableCell>{getLogTypeBadge(log.type)}</TableCell>
                          <TableCell className="font-medium">{log.admin}</TableCell>
                          <TableCell className="font-mono">{log.ip_address}</TableCell>
                          <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* IP 차단 다이얼로그 */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              IP 주소 차단
            </DialogTitle>
            <DialogDescription>
              다음 IP 주소를 차단하시겠습니까? 차단된 IP는 시스템에 접속할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ip-address">IP 주소</Label>
              <Input id="ip-address" value={selectedIP} disabled className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="block-reason">차단 사유 *</Label>
              <Textarea
                id="block-reason"
                placeholder="차단 사유를 입력하세요 (예: 무단 접속 시도, 의심스러운 활동 등)"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleBlockIP}>
              <Ban className="h-4 w-4 mr-2" />
              차단하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* IP 차단 해제 다이얼로그 */}
      <Dialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              IP 차단 해제
            </DialogTitle>
            <DialogDescription>
              다음 IP 주소의 차단을 해제하시겠습니까? 해제 후 해당 IP에서 시스템에 접속할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unblock-ip-address">IP 주소</Label>
              <Input id="unblock-ip-address" value={selectedIP} disabled className="font-mono" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnblockDialogOpen(false)}>
              취소
            </Button>
            <Button variant="default" onClick={handleUnblockIP} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              차단 해제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminAuthCheck>
  )
}
