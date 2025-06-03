"use client"

import { useEffect, useState } from "react"
import { Shield, AlertTriangle, Clock, Mail, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BlockInfo {
  reason: string
  blockedAt: string
  ip: string
}

export default function BlockedPage() {
  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 현재 IP의 차단 정보 가져오기
    const fetchBlockInfo = async () => {
      try {
        const response = await fetch("/api/admin/block-info")
        if (response.ok) {
          const data = await response.json()
          setBlockInfo(data)
        }
      } catch (error) {
        console.error("Failed to fetch block info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlockInfo()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-red-200">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-red-700 mb-2">접속이 차단되었습니다</CardTitle>
            <CardDescription className="text-lg text-red-600">
              보안상의 이유로 귀하의 IP 주소에서의 접속이 제한되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                  <span className="text-gray-600">차단 정보를 불러오는 중...</span>
                </div>
              </div>
            ) : blockInfo ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-6 h-6 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">차단 정보</h3>
                    <div className="text-sm text-red-700 space-y-2">
                      <div>
                        <span className="font-medium">IP 주소:</span> {blockInfo.ip}
                      </div>
                      <div>
                        <span className="font-medium">차단 사유:</span> {blockInfo.reason}
                      </div>
                      <div>
                        <span className="font-medium">차단 시간:</span>{" "}
                        {new Date(blockInfo.blockedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">일반적인 차단 사유</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• 관리자 로그인 연속 실패</li>
                      <li>• 의심스러운 접속 패턴 감지</li>
                      <li>• 보안 정책 위반</li>
                      <li>• 관리자에 의한 수동 차단</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">차단 해제 방법</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    정당한 사용자이시라면 아래 연락처로 문의하여 차단 해제를 요청하실 수 있습니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <Mail className="w-4 h-4" />
                      <span>이메일: bykim@skm.kr</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <span>📞</span>
                      <span>전화: 02-1234-5678</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => (window.location.href = "mailto:bykim@skm.kr?subject=IP 차단 해제 요청")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                차단 해제 요청하기
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              <p>현재 시간: {new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</p>
              <p className="mt-1">SKM파트너스 보안 시스템</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
