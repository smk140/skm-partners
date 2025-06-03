"use client"

import { useState, useEffect } from "react"
import { Copy, Check, TestTube, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminAuthCheck } from "@/components/admin/auth-check"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    inquiry_webhook_url: "",
    admin_webhook_url: "",
    security_webhook_url: "", // 새로 추가
  })
  const [copiedField, setCopiedField] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState("")

  useEffect(() => {
    // 로컬 스토리지에서 설정 불러오기
    const savedSettings = localStorage.getItem("webhook_settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // 로컬 스토리지에 저장
      localStorage.setItem("webhook_settings", JSON.stringify(settings))

      toast({
        title: "설정 저장 완료",
        description: "웹훅 설정이 성공적으로 저장되었습니다. 환경 변수도 확인해주세요.",
      })
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "설정 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testWebhook = async (type: "inquiry" | "admin" | "security") => {
    let webhookUrl = ""

    if (type === "inquiry") {
      webhookUrl = settings.inquiry_webhook_url
    } else if (type === "admin") {
      webhookUrl = settings.admin_webhook_url
    } else if (type === "security") {
      webhookUrl = settings.security_webhook_url
    }

    if (!webhookUrl) {
      toast({
        title: "웹훅 URL이 없습니다",
        description: "먼저 웹훅 URL을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsTesting(type)
    try {
      const response = await fetch("/api/admin/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          type,
          message: `${type === "inquiry" ? "문의" : type === "admin" ? "관리자" : "보안"} 웹훅 테스트 메시지입니다.`,
        }),
      })

      if (response.ok) {
        toast({
          title: "테스트 성공! 🎉",
          description: "디스코드에 테스트 메시지가 전송되었습니다.",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.details || "Webhook test failed")
      }
    } catch (error) {
      toast({
        title: "테스트 실패",
        description: error instanceof Error ? error.message : "웹훅 테스트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsTesting("")
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(""), 2000)
    toast({
      title: "복사 완료",
      description: "클립보드에 복사되었습니다.",
    })
  }

  return (
    <AdminAuthCheck>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">사이트 설정</h1>
          <p className="text-slate-600 mt-2">디스코드 웹훅 및 시스템 설정을 관리합니다.</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">환경 변수 설정 완료</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  NEXT_PUBLIC_DISCORD_WEBHOOK_URL과 NEXT_PUBLIC_ADMIN_DISCORD_WEBHOOK_URL이 Vercel 프로젝트에
                  추가되었습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>디스코드 웹훅 설정</CardTitle>
            <CardDescription>문의 접수 및 관리자 로그인 시 디스코드로 알림을 받을 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inquiry-webhook" className="text-base font-medium text-blue-600">
                  📞 빠른 문의 웹훅 URL
                </Label>
                <p className="text-sm text-slate-500 mb-2">
                  고객이 문의를 신청할 때 알림을 받을 디스코드 채널의 웹훅 URL을 입력하세요.
                </p>
                <div className="flex gap-2">
                  <Input
                    id="inquiry-webhook"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={settings.inquiry_webhook_url || ""}
                    onChange={(e) => setSettings((prev) => ({ ...prev, inquiry_webhook_url: e.target.value }))}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(settings.inquiry_webhook_url || "", "inquiry")}
                    disabled={!settings.inquiry_webhook_url}
                  >
                    {copiedField === "inquiry" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testWebhook("inquiry")}
                    disabled={!settings.inquiry_webhook_url || isTesting === "inquiry"}
                  >
                    {isTesting === "inquiry" ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        테스트 중
                      </div>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-1" />
                        테스트
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="admin-webhook" className="text-base font-medium text-red-600">
                  🔐 관리자 로그인 알림 웹훅 URL
                </Label>
                <p className="text-sm text-slate-500 mb-2">
                  관리자가 로그인할 때 보안 알림을 받을 디스코드 채널의 웹훅 URL을 입력하세요.
                </p>
                <div className="flex gap-2">
                  <Input
                    id="admin-webhook"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={settings.admin_webhook_url || ""}
                    onChange={(e) => setSettings((prev) => ({ ...prev, admin_webhook_url: e.target.value }))}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(settings.admin_webhook_url || "", "admin")}
                    disabled={!settings.admin_webhook_url}
                  >
                    {copiedField === "admin" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testWebhook("admin")}
                    disabled={!settings.admin_webhook_url || isTesting === "admin"}
                  >
                    {isTesting === "admin" ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        테스트 중
                      </div>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-1" />
                        테스트
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="security-webhook" className="text-base font-medium text-orange-600">
                🛡️ 보안 알림 웹훅 URL
              </Label>
              <p className="text-sm text-slate-500 mb-2">
                IP 차단/해제 및 보안 이벤트 알림을 받을 디스코드 채널의 웹훅 URL을 입력하세요.
              </p>
              <div className="flex gap-2">
                <Input
                  id="security-webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={settings.security_webhook_url || ""}
                  onChange={(e) => setSettings((prev) => ({ ...prev, security_webhook_url: e.target.value }))}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(settings.security_webhook_url || "", "security")}
                  disabled={!settings.security_webhook_url}
                >
                  {copiedField === "security" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => testWebhook("security")}
                  disabled={!settings.security_webhook_url || isTesting === "security"}
                >
                  {isTesting === "security" ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
                      테스트 중
                    </div>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-1" />
                      테스트
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    저장 중...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    설정 저장
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>다음 단계</CardTitle>
            <CardDescription>웹훅을 설정하고 테스트해보세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🚀 설정 완료 단계</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                  <li>디스코드에서 웹훅 URL을 생성합니다</li>
                  <li>위의 입력 필드에 웹훅 URL을 입력합니다</li>
                  <li>"테스트" 버튼을 클릭하여 웹훅이 작동하는지 확인합니다</li>
                  <li>"설정 저장" 버튼을 클릭하여 설정을 저장합니다</li>
                  <li>실제 문의나 관리자 로그인을 통해 알림이 오는지 확인합니다</li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">📱 디스코드 웹훅 생성 방법</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>디스코드에서 알림을 받을 채널을 선택합니다</li>
                  <li>채널 설정 → 연동 → 웹훅으로 이동합니다</li>
                  <li>"새 웹훅" 버튼을 클릭합니다</li>
                  <li>웹훅 이름을 설정합니다 (예: SKM파트너스 문의알림)</li>
                  <li>"웹훅 URL 복사" 버튼을 클릭하여 URL을 복사합니다</li>
                  <li>복사한 URL을 위의 입력 필드에 붙여넣습니다</li>
                </ol>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ 알림 내용</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>
                    <strong>문의 알림:</strong> 고객명, 연락처, 서비스, 문의내용, IP주소, 브라우저 정보
                  </div>
                  <div>
                    <strong>관리자 알림:</strong> 로그인 시간, IP주소, 브라우저 정보, 성공/실패 여부
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">⚠️ 중요 사항</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                  <li>환경 변수가 이미 Vercel에 설정되어 있습니다</li>
                  <li>웹훅 URL을 입력한 후 반드시 테스트를 진행해주세요</li>
                  <li>두 웹훅을 서로 다른 채널에 설정하는 것을 권장합니다</li>
                  <li>관리자 로그인 알림은 보안 목적으로 자동 전송됩니다</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">🛡️ 보안 알림 설정</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <div>
                    <strong>보안 알림:</strong> IP 차단/해제, 의심스러운 접속 시도, 보안 이벤트
                  </div>
                  <div>
                    <strong>권장사항:</strong> 보안 담당자만 접근 가능한 별도 채널 사용
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminAuthCheck>
  )
}
