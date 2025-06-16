"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react"
import { SafeImage } from "@/components/safe-image"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
  site_images?: {
    hero_contact?: string
    company_building?: string
  }
  business_hours?: {
    weekday: string
    weekend: string
    holiday: string
    emergency: string
  }
}

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    address: "서울특별시 강남구 테헤란로 123, 4층",
    phone: "02-123-4567",
    email: "bykim@skm.kr",
    description: "전문적인 건물 관리 서비스",
    site_images: {},
    business_hours: {
      weekday: "평일 09:00 - 18:00",
      weekend: "토요일 09:00 - 15:00",
      holiday: "일요일 및 공휴일 휴무",
      emergency: "긴급상황 시 24시간 대응",
    },
  })
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    setIsLoading(true)
    try {
      console.log("회사 정보 로딩 시작...")
      const response = await fetch("/api/admin/company")
      const data = await response.json()

      console.log("API 응답:", data)

      if (data.success && data.companyInfo) {
        setCompanyInfo((prev) => ({
          ...prev,
          ...data.companyInfo,
        }))
        console.log("회사 정보 설정됨:", data.companyInfo)
      }
    } catch (error) {
      console.error("회사 정보 로드 실패:", error)
    } finally {
      setIsLoading(false)
    }
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
          type: "contact",
          created_at: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "문의가 접수되었습니다",
          description: "빠른 시일 내에 연락드리겠습니다.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
        })
      } else {
        throw new Error("문의 접수에 실패했습니다")
      }
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  연락처
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {companyInfo.name}에 문의하세요
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  전문가와 상담하고 최적의 건물 관리 솔루션을 찾아보세요. 무료 상담을 통해 맞춤형 서비스를
                  제안해드립니다.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  전화 상담 신청
                  <Phone className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  카카오톡 상담
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyInfo.site_images?.hero_contact ||
                  "/placeholder.svg?height=500&width=600&query=professional customer service contact"
                }
                alt="연락처"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                fallbackText="연락처 이미지"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">문의하기</CardTitle>
                <CardDescription>아래 양식을 작성해주시면 빠르게 연락드리겠습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">이름 *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="홍길동"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">연락처 *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="010-1234-5678"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">이메일 *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">회사명</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="회사명 (선택사항)"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">문의 제목 *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="문의 제목을 입력해주세요"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">문의 내용 *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="문의하실 내용을 자세히 적어주세요"
                      rows={6}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        문의 보내기
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    오시는 길
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900">{companyInfo.address}</p>
                    <p className="text-gray-600 mt-1">지하철 2호선 강남역 3번 출구 도보 5분</p>
                  </div>
                  <SafeImage
                    src={
                      companyInfo.site_images?.company_building ||
                      "/placeholder.svg?height=200&width=400&query=office building location map"
                    }
                    alt="회사 위치"
                    className="w-full h-48 object-cover rounded-lg"
                    fallbackText="회사 위치"
                  />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    연락처 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{companyInfo.phone}</p>
                      <p className="text-sm text-gray-600">대표 전화</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{companyInfo.email}</p>
                      <p className="text-sm text-gray-600">이메일 문의</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    운영 시간
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">평일</span>
                    <span className="font-medium">{companyInfo.business_hours?.weekday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">토요일</span>
                    <span className="font-medium">{companyInfo.business_hours?.weekend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">일요일/공휴일</span>
                    <span className="font-medium text-red-600">{companyInfo.business_hours?.holiday}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-blue-600 font-medium">{companyInfo.business_hours?.emergency}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Toaster />
    </div>
  )
}
