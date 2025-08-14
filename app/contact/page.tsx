"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { toast } from "@/hooks/use-toast"
import type { CompanyData } from "@/lib/file-db"

export default function ContactPage() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        console.log("🔄 Contact page fetching company data...")
        const response = await fetch("/api/company", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await response.json()
        console.log("📥 Contact page company data response:", data)

        if (data.success && data.company) {
          setCompanyData(data.company)
          console.log("✅ Contact page company data set:", data.company)
        } else {
          console.error("❌ Contact page failed to fetch company data:", data.error)
        }
      } catch (error) {
        console.error("❌ Contact page network error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanyData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "문의가 접수되었습니다",
          description: "빠른 시일 내에 연락드리겠습니다.",
        })
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        toast({
          title: "문의 접수 실패",
          description: result.error || "다시 시도해 주세요.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "네트워크 오류",
        description: "잠시 후 다시 시도해 주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (loading) {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url(${companyData?.contactHeroUrl || "/contact-us-professional.png"})`,
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-6">
              문의하기
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">연락처</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              전문가와 상담하고 맞춤형 솔루션을 받아보세요. 언제든지 문의해 주시면 신속하게 답변드리겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">문의 양식</h2>
              <Card>
                <CardHeader>
                  <CardTitle>프로젝트 상담 신청</CardTitle>
                  <CardDescription>
                    아래 양식을 작성해 주시면 전문가가 직접 연락드려 상세한 상담을 진행해 드립니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
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
                      <div className="space-y-2">
                        <Label htmlFor="phone">연락처 *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="010-1234-5678"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Label htmlFor="message">문의 내용 *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="프로젝트에 대한 상세한 내용을 작성해 주세요..."
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">연락처 정보</h2>
              <div className="space-y-8">
                {/* Company Building Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <SafeImage
                    src={
                      companyData?.companyBuildingUrl ||
                      "/placeholder.svg?height=300&width=500&query=modern office building"
                    }
                    alt="SKM파트너스 사무실"
                    className="w-full h-64 object-cover"
                    fallbackText="SKM파트너스 사무실"
                  />
                </div>

                {/* Contact Cards */}
                <div className="grid gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">주소</h3>
                          <p className="text-gray-600">{companyData?.address || "서울특별시 강남구 테헤란로 123"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">전화번호</h3>
                          <p className="text-gray-600">{companyData?.phone || "02-1234-5678"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">이메일</h3>
                          <p className="text-gray-600">{companyData?.email || "info@skm.kr"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">운영시간</h3>
                          <div className="text-gray-600 space-y-1">
                            <p>평일: 오전 9시 - 오후 6시</p>
                            <p>토요일: 오전 9시 - 오후 1시</p>
                            <p>일요일 및 공휴일: 휴무</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contact Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">왜 SKM파트너스를 선택해야 할까요?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              전문성과 신뢰성을 바탕으로 고객에게 최고의 서비스를 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">신속한 응답</h3>
                <p className="text-gray-600">
                  문의 접수 후 24시간 이내에 전문가가 직접 연락드려 상세한 상담을 진행합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">맞춤형 솔루션</h3>
                <p className="text-gray-600">
                  고객의 특별한 요구사항을 정확히 파악하여 최적화된 맞춤형 서비스를 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">투명한 견적</h3>
                <p className="text-gray-600">
                  숨겨진 비용 없이 투명하고 합리적인 견적을 제공하여 신뢰할 수 있는 파트너십을 구축합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded text-xs max-w-sm">
          <div>Contact Page Debug:</div>
          <div>Company Data: {companyData ? "Loaded" : "Not Loaded"}</div>
          {companyData && (
            <div>
              <div>Contact Hero: {companyData.contactHeroUrl ? "Set" : "Not Set"}</div>
              <div>Company Building: {companyData.companyBuildingUrl ? "Set" : "Not Set"}</div>
              <div>Phone: {companyData.phone}</div>
              <div>Email: {companyData.email}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
