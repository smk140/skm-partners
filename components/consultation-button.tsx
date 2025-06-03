"use client"

import type React from "react"

import { useState } from "react"
import { Phone, MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export function ConsultationButton() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 5초 쿨타임 체크
    const now = Date.now()
    const timeSinceLastSubmit = now - lastSubmitTime
    const cooldownTime = 10000 // 10초

    if (timeSinceLastSubmit < cooldownTime) {
      const remainingTime = Math.ceil((cooldownTime - timeSinceLastSubmit) / 1000)
      toast({
        title: "잠시만 기다려주세요",
        description: `${remainingTime}초 후에 다시 시도해주세요.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // IP 주소와 User-Agent 수집
      const getClientInfo = async () => {
        try {
          const response = await fetch("https://api.ipify.org?format=json")
          const data = await response.json()
          return {
            ip_address: data.ip,
            user_agent: navigator.userAgent,
          }
        } catch {
          return {
            ip_address: "unknown",
            user_agent: navigator.userAgent,
          }
        }
      }

      const clientInfo = await getClientInfo()

      // 상담 신청 API 호출
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...clientInfo,
        }),
      })

      if (response.ok) {
        setLastSubmitTime(now) // 성공 시에만 쿨타임 설정
        toast({
          title: "상담 신청이 완료되었습니다",
          description: "담당자가 빠른 시일 내에 연락드리겠습니다.",
        })

        // 폼 초기화 및 닫기
        setFormData({
          name: "",
          phone: "",
          service: "",
          message: "",
        })
        setIsOpen(false)
      } else {
        throw new Error("상담 신청에 실패했습니다.")
      }
    } catch (error) {
      toast({
        title: "전송 중 오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* 상담 신청 모달 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader className="relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Phone className="h-5 w-5 text-blue-600" />
                빠른 상담 신청
              </CardTitle>
              <CardDescription>전문 상담사가 빠른 시일 내에 연락드리겠습니다.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    연락처 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="연락처를 입력하세요"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">
                    관심 서비스 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.service} onValueChange={handleServiceChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="서비스를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building-management">건물 관리</SelectItem>
                      <SelectItem value="facility-management">시설 관리</SelectItem>
                      <SelectItem value="security-service">보안 서비스</SelectItem>
                      <SelectItem value="cleaning-service">청소 서비스</SelectItem>
                      <SelectItem value="maintenance">유지보수</SelectItem>
                      <SelectItem value="consulting">컨설팅</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">문의 내용</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="문의하실 내용을 간단히 작성해주세요"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>빠른 상담을 위한 팁:</strong>
                    <br />
                    건물 위치, 규모, 현재 상황을 함께 알려주시면 더 정확한 상담이 가능합니다.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      전송 중...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      상담 신청하기
                    </div>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </>
  )
}
