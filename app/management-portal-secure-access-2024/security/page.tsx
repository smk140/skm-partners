"use client"

import { useState, useEffect } from "react"
import { Shield, Ban, CheckCircle, AlertTriangle, Eye, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminAuthCheck } from "@/components/admin/auth-check"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
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

interface AccessLog {
  id: number
  ip_address: string
  user_agent: string
  action: string
  page: string
  success: boolean
  timestamp: string
  username?: string
}

export default function AdminSecurityPage() {
  const { toast } = useToast()
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [blockedIPs, setBlockedIPs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIP, setSelectedIP] = useState<string>("")
  const [blockReason, setBlockReason] = useState("")
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // 접속 로그 가져오기
      const logsResponse = await fetch("/api/admin/access-logs")
      if (logsResponse.ok) {
        const logsData = await logsResponse.json()
        setAccessLogs(logsData.logs || [])
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

  const getActionBadge = (action: string, success: boolean) => {
    if (action.includes("login")) {
      return success ? (
        <Badge variant="default" className="bg-green-500">
          로그인 성공
        </Badge>
      ) : (
        <Badge variant="destructive">로그인 실패</Badge>
      )
    }
    if (action.includes("access")) {
      return (
        <Badge variant="secondary" className="bg-blue-500 text-white">
          페이지 접속
        </Badge>
      )
    }
    return <Badge variant="outline">{action}</Badge>
  }

  return (
    <AdminAuthCheck>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">보안 관리</h1>
          <p className="text-slate-600 mt-2">시스템 접속 로그 및 IP 차단 관리</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">총 접속 시도</CardTitle>
              <Eye className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{accessLogs.length}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">성공한 로그인</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {accessLogs.filter((log) => log.action.includes("login") && log.success).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">실패한 로그인</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {accessLogs.filter((log) => log.action.includes("login") && !log.success).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">차단된 IP</CardTitle>
              <Ban className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{blockedIPs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* 차단된 IP 목록 */}
        {blockedIPs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                차단된 IP 목록
              </CardTitle>
              <CardDescription>현재 차단된 IP 주소 목록입니다.</CardDescription>
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
                      차단 해제
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 접속 로그 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              접속 로그
            </CardTitle>
            <CardDescription>최근 시스템 접속 기록입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-slate-500">로그를 불러오는 중...</p>
              </div>
            ) : accessLogs.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">접속 로그가 없습니다.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시간</TableHead>
                    <TableHead>IP 주소</TableHead>
                    <TableHead>액션</TableHead>
                    <TableHead>페이지</TableHead>
                    <TableHead>사용자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{formatDate(log.timestamp)}</TableCell>
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
                      <TableCell>{getActionBadge(log.action, log.success)}</TableCell>
                      <TableCell className="font-mono text-sm">{log.page}</TableCell>
                      <TableCell>{log.username || "-"}</TableCell>
                      <TableCell>
                        {log.success ? (
                          <Badge variant="default" className="bg-green-500">
                            성공
                          </Badge>
                        ) : (
                          <Badge variant="destructive">실패</Badge>
                        )}
                      </TableCell>
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
