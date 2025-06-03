"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminAuthCheck } from "@/components/admin/auth-check"
import { useToast } from "@/components/ui/use-toast"

export default function TestDiscordPage() {
  const { toast } = useToast()
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const handleTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/test-discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      })

      const result = await response.json()
      setTestResult(result)

      if (response.ok) {
        toast({
          title: "테스트 완료",
          description: "디스코드 웹훅 테스트가 완료되었습니다.",
        })
      } else {
        toast({
          title: "테스트 실패",
          description: result.error || "테스트 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "테스트 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminAuthCheck>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">디스코드 웹훅 테스트</h1>
          <p className="text-slate-600 mt-2">디스코드 웹훅이 정상적으로 작동하는지 테스트합니다.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>웹훅 테스트</CardTitle>
            <CardDescription>디스코드 웹훅 URL을 입력하고 테스트 메시지를 전송해보세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">디스코드 웹훅 URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>

            <Button onClick={handleTest} disabled={isLoading || !webhookUrl} className="w-full">
              {isLoading ? "테스트 중..." : "웹훅 테스트"}
            </Button>

            {testResult && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold mb-2">테스트 결과</h3>
                <pre className="text-sm overflow-auto">{JSON.stringify(testResult, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>문제 해결 가이드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">1. 웹훅 URL 확인</h4>
                <p className="text-sm text-slate-600">
                  디스코드에서 웹훅을 생성하고 올바른 URL을 복사했는지 확인하세요.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">2. 권한 확인</h4>
                <p className="text-sm text-slate-600">웹훅이 생성된 채널에 메시지를 보낼 권한이 있는지 확인하세요.</p>
              </div>

              <div>
                <h4 className="font-semibold">3. 환경변수 확인</h4>
                <p className="text-sm text-slate-600">
                  Vercel 대시보드에서 DISCORD_WEBHOOK_URL 환경변수가 올바르게 설정되었는지 확인하세요.
                </p>
              </div>

              <div>
                <h4 className="font-semibold">4. 배포 확인</h4>
                <p className="text-sm text-slate-600">환경변수 변경 후 새로 배포했는지 확인하세요.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminAuthCheck>
  )
}
