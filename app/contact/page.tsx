"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  business_hours: {
    weekday: string
    weekend: string
    holiday: string
    emergency: string
  }
  map_info: {
    map_embed_url: string
  }
}

export default function ContactPage() {
  const { toast } = useToast()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    address: "서울특별시 강남구 테헤란로 123, 4층",
    phone: "02-123-4567",
    email: "bykim@skm.kr",
    business_hours: {
      weekday: "평일 09:00 - 18:00",
      weekend: "토요일 09:00 - 15:00",
      holiday: "일요일 및 공휴일 휴무",
      emergency: "긴급상황 시 24시간 대응",
    },
    map_info: {
      map_embed_url: "",
    },
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 회사 정보 로드
  useEffect(() => {
    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.info) {
          setCompanyInfo(data.info)
        }
      })
      .catch((error) => {
        console.error("회사 정보 로드 실패:", error)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          service: "일반 문의",
          type: "contact",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "문의 전송에 실패했습니다.")
      }

      toast({
        title: "문의가 성공적으로 전송되었습니다",
        description: "담당자가 이메일로 빠른 시일 내에 답변드리겠습니다.",
      })

      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      })
    } catch (error) {
      console.error("문의 전송 오류:", error)
      toast({
        title: "전송 중 오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 구글 맵 URL 생성 (API 키 없이)
  const getMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">문의하기</h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto text-center">
            {companyInfo.name}의 전문 서비스에 대해 궁금한 점이 있으시면 언제든지 문의해주세요. 이메일로 신속하게
            답변드리겠습니다.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-6">이메일 문의</h2>
              <p className="text-slate-600 mb-6">
                아래 양식을 작성해주시면 담당자가 이메일로 상세한 답변을 드립니다. 모든 문의는 24시간 이내에
                답변드리도록 하겠습니다.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
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
                    <Label htmlFor="company">회사명</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="회사명을 입력하세요"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    이메일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-sm text-slate-500">답변을 받으실 이메일 주소입니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="연락처를 입력하세요 (선택사항)"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    문의 내용 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="문의하실 내용을 상세히 작성해주세요"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
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
                      이메일로 문의하기
                    </div>
                  )}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">연락처 정보</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 flex items-start">
                    <Mail className="h-5 w-5 mr-4 mt-0.5 text-slate-500" />
                    <div>
                      <h3 className="font-semibold mb-1">이메일</h3>
                      <p className="text-slate-600">{companyInfo.email}</p>
                      <p className="text-sm text-slate-500 mt-1">24시간 접수 가능</p>
                      <p className="text-sm text-blue-600 mt-1">평균 답변 시간: 4시간 이내</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start">
                    <Phone className="h-5 w-5 mr-4 mt-0.5 text-slate-500" />
                    <div>
                      <h3 className="font-semibold mb-1">전화</h3>
                      <p className="text-slate-600">{companyInfo.phone}</p>
                      <p className="text-sm text-slate-500 mt-1">{companyInfo.business_hours.weekday}</p>
                      <p className="text-sm text-slate-500">{companyInfo.business_hours.emergency}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start">
                    <MapPin className="h-5 w-5 mr-4 mt-0.5 text-slate-500" />
                    <div>
                      <h3 className="font-semibold mb-1">주소</h3>
                      <p className="text-slate-600">{companyInfo.address}</p>
                      <p className="text-sm text-slate-500 mt-1">방문 상담 가능 (사전 예약 필수)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-start">
                    <Clock className="h-5 w-5 mr-4 mt-0.5 text-slate-500" />
                    <div>
                      <h3 className="font-semibold mb-1">운영 시간</h3>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p>{companyInfo.business_hours.weekday}</p>
                        <p>{companyInfo.business_hours.weekend}</p>
                        <p>{companyInfo.business_hours.holiday}</p>
                        <p className="text-blue-600 font-medium">{companyInfo.business_hours.emergency}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">빠른 답변을 위한 팁</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 건물 위치와 규모를 명시해주세요</li>
                    <li>• 현재 상황과 원하는 서비스를 구체적으로 작성해주세요</li>
                    <li>• 연락 가능한 시간대를 알려주세요</li>
                    <li>• 첨부파일이 있다면 이메일로 직접 보내주세요</li>
                  </ul>
                </div>

                {/* 구글 맵 (API 키 없이) */}
                <div className="h-[300px] w-full rounded-lg overflow-hidden border">
                  <iframe
                    src={getMapUrl(companyInfo.address)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Toaster />
    </main>
  )
}
