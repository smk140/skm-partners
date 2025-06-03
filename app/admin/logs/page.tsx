"use client"

import { useEffect, useState } from "react"
import { Eye, Calendar, Globe, Monitor, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminAuthCheck } from "@/components/admin/auth-check"

interface LogEntry {
  id: number
  type: string
  username?: string
  sessionId?: string
  ip_address: string
  user_agent: string
  timestamp: string
  details: string
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedLog, setExpandedLog] = useState<number | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/admin/logs")
        const data = await response.json()
        setLogs(data.logs || [])
      } catch (error) {
        console.error("로그 데이터 로드 실패:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case "login_success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "login_failure":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "privacy_consent":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "ip_block":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogTypeBadge = (type: string) => {
    switch (type) {
      case "login_success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            로그인 성공
          </Badge>
        )
      case "login_failure":
        return <Badge variant="destructive">로그인 실패</Badge>
      case "privacy_consent":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            개인정보 동의
          </Badge>
        )
      case "ip_block":
        return (
          <Badge variant="destructive" className="bg-orange-100 text-orange-800">
            IP 차단
          </Badge>
        )
      default:
        return <Badge variant="outline">기타</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const toggleLogDetails = (logId: number) => {
    setExpandedLog(expandedLog === logId ? null : logId)
  }

  if (loading) {
    return (
      <AdminAuthCheck>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">로그 데이터를 불러오는 중...</p>
          </div>
        </div>
      </AdminAuthCheck>
    )
  }

  return (
    <AdminAuthCheck>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">시스템 로그</h1>
          <p className="text-slate-600 mt-2">최근 30일간의 시스템 활동 로그입니다. (삭제 불가)</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              활동 로그
            </CardTitle>
            <CardDescription>총 {logs.length}개의 로그 항목 (최근 30일)</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <Monitor className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">로그 데이터가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getLogTypeIcon(log.type)}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getLogTypeBadge(log.type)}
                            <span className="text-sm text-slate-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-900">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {log.ip_address}
                            </span>
                            {log.username && <span>사용자: {log.username}</span>}
                            {log.sessionId && <span>세션: {log.sessionId.substring(0, 8)}...</span>}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLogDetails(log.id)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    {expandedLog === log.id && (
                      <div className="mt-3 pt-3 border-t bg-slate-50 rounded p-3">
                        <h4 className="font-medium text-slate-900 mb-2">상세 정보</h4>
                        <div className="grid gap-2 text-sm">
                          <div>
                            <span className="font-medium text-slate-700">IP 주소:</span>
                            <span className="ml-2 text-slate-600">{log.ip_address}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">User-Agent:</span>
                            <span className="ml-2 text-slate-600 break-all">{log.user_agent}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-700">타임스탬프:</span>
                            <span className="ml-2 text-slate-600">{log.timestamp}</span>
                          </div>
                          {log.username && (
                            <div>
                              <span className="font-medium text-slate-700">사용자명:</span>
                              <span className="ml-2 text-slate-600">{log.username}</span>
                            </div>
                          )}
                          {log.sessionId && (
                            <div>
                              <span className="font-medium text-slate-700">세션 ID:</span>
                              <span className="ml-2 text-slate-600 font-mono">{log.sessionId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminAuthCheck>
  )
}
