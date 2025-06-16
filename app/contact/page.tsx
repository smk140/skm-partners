"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, MapPin, Phone, Send, Clock, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
    fetch("/api/admin/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.companyInfo) {
          setCompanyInfo((prev) => ({
            ...prev,
            ...data.companyInfo,
          }))
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

  // 구글 맵 URL 생성
  const getMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-6">
              연락처
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              언제든지
              <br />
              <span className="text-blue-600">문의해 주세요</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {companyInfo.name}의 전문 서비스에 대해 궁금한 점이 있으시면 언제든지 문의해주세요.
              <br />
              이메일로 신속하게 답변드리겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">이메일 문의</h2>
                <p className="text-gray-600 text-lg">
                  아래 양식을 작성해주시면 담당자가 이메일로 상세한 답변을 드립니다. 모든 문의는 24시간 이내에
                  답변드리도록 하겠습니다.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="이름을 입력하세요"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      회사명
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="회사명을 입력하세요"
                      value={formData.company}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                    className="h-12"
                  />
                  <p className="text-sm text-gray-500">답변을 받으실 이메일 주소입니다.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    연락처
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="연락처를 입력하세요 (선택사항)"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
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
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      전송 중...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-5 w-5" />
                      이메일로 문의하기
                    </div>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">연락처 정보</h2>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg">
                      <Mail className="h-6 w-6 mr-3 text-blue-600" />
                      이메일
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 font-medium text-lg">{companyInfo.email}</p>
                    <p className="text-gray-600 mt-1">24시간 접수 가능</p>
                    <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                      평균 답변 시간: 4시간 이내
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg">
                      <Phone className="h-6 w-6 mr-3 text-green-600" />
                      전화
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 font-medium text-lg">{companyInfo.phone}</p>
                    <p className="text-gray-600 mt-1">{companyInfo.business_hours.weekday}</p>
                    <p className="text-green-600 font-medium mt-1">{companyInfo.business_hours.emergency}</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg">
                      <MapPin className="h-6 w-6 mr-3 text-purple-600" />
                      주소
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 font-medium text-lg">{companyInfo.address}</p>
                    <p className="text-gray-600 mt-1">방문 상담 가능 (사전 예약 필수)</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="h-6 w-6 mr-3 text-orange-600" />
                      운영 시간
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-gray-700">{companyInfo.business_hours.weekday}</p>
                      <p className="text-gray-700">{companyInfo.business_hours.weekend}</p>
                      <p className="text-gray-700">{companyInfo.business_hours.holiday}</p>
                      <p className="text-blue-600 font-medium">{companyInfo.business_hours.emergency}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Tips */}
              <Card className="border-0 shadow-lg bg-blue-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg text-blue-800">
                    <MessageSquare className="h-6 w-6 mr-3" />
                    빠른 답변을 위한 팁
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      건물 위치와 규모를 명시해주세요
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      현재 상황과 원하는 서비스를 구체적으로 작성해주세요
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      연락 가능한 시간대를 알려주세요
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      첨부파일이 있다면 이메일로 직접 보내주세요
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">찾아오시는 길</h2>
            <p className="text-gray-600 text-lg">{companyInfo.name} 사무실로 직접 방문하실 수 있습니다.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-[400px] w-full">
                <iframe
                  src={getMapUrl(companyInfo.address)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Toaster />
    </div>
  )
}
