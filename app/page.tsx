"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Award, Phone, Mail, ArrowRight, CheckCircle, Star } from "lucide-react"

interface CompanyData {
  logo: string
  heroImage: string
  aboutImage: string
  buildingManagementImage: string
  cleaningImage: string
  fireInspectionImage: string
  elevatorImage: string
  teamImage: string
  officeImage: string
  showcaseImage: string
}

export default function HomePage() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      console.log("🏠 홈페이지에서 데이터 로드 시작")
      const response = await fetch("/api/company")
      console.log("📡 홈페이지 응답 상태:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("📥 홈페이지에서 받은 데이터:", data)
        setCompanyData(data)
        console.log("✅ 홈페이지 상태 업데이트 완료")
      } else {
        console.error("❌ 홈페이지 응답 실패:", response.status)
      }
    } catch (error) {
      console.error("💥 홈페이지 데이터 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  const services = [
    {
      title: "빌딩 종합관리",
      description: "상업용 빌딩의 전반적인 관리 서비스를 제공합니다.",
      image:
        companyData?.buildingManagementImage ||
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      features: ["시설관리", "보안관리", "환경관리", "에너지관리"],
    },
    {
      title: "청소 서비스",
      description: "전문적이고 체계적인 청소 서비스를 제공합니다.",
      image:
        companyData?.cleaningImage ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      features: ["일반청소", "특수청소", "정기청소", "긴급청소"],
    },
    {
      title: "소방점검",
      description: "안전한 환경을 위한 소방시설 점검 서비스입니다.",
      image:
        companyData?.fireInspectionImage ||
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
      features: ["정기점검", "긴급점검", "시설개선", "안전교육"],
    },
    {
      title: "엘리베이터 관리",
      description: "엘리베이터의 안전하고 원활한 운행을 보장합니다.",
      image:
        companyData?.elevatorImage ||
        "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
      features: ["정기점검", "응급수리", "부품교체", "안전관리"],
    },
  ]

  const stats = [
    { icon: Building2, label: "관리 빌딩", value: "150+", description: "개 빌딩" },
    { icon: Users, label: "고객 만족도", value: "98%", description: "만족도" },
    { icon: Award, label: "서비스 경력", value: "15년", description: "이상" },
    { icon: CheckCircle, label: "완료 프로젝트", value: "500+", description: "개 프로젝트" },
  ]

  const testimonials = [
    {
      name: "김○○ 대표",
      company: "○○빌딩",
      content: "SKM파트너스의 전문적인 관리 서비스 덕분에 빌딩 운영이 매우 원활해졌습니다.",
      rating: 5,
    },
    {
      name: "이○○ 실장",
      company: "○○타워",
      content: "신속하고 정확한 대응으로 항상 만족스러운 서비스를 받고 있습니다.",
      rating: 5,
    },
    {
      name: "박○○ 과장",
      company: "○○센터",
      content: "청소 서비스의 품질이 뛰어나고 직원들이 매우 친절합니다.",
      rating: 5,
    },
  ]

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
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={
              companyData?.heroImage ||
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop" ||
              "/placeholder.svg"
            }
            alt="SKM파트너스 메인 이미지"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            전문적인 빌딩관리
            <br />
            <span className="text-blue-400">SKM파트너스</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            15년 경험의 전문성으로 안전하고 효율적인 빌딩관리 서비스를 제공합니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              <Link href="/contact" className="flex items-center gap-2">
                무료 상담 신청 <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              <Link href="/services">서비스 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                신뢰할 수 있는
                <br />
                <span className="text-blue-600">빌딩관리 파트너</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                SKM파트너스는 15년간 축적된 전문성과 노하우를 바탕으로 고객의 소중한 자산을 안전하고 효율적으로
                관리합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">ISO 9001 품질경영시스템 인증</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">24시간 응급상황 대응 시스템</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">전문 자격증 보유 직원</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">맞춤형 관리 솔루션 제공</span>
                </div>
              </div>
              <Button className="mt-8" size="lg">
                <Link href="/about">회사 소개 보기</Link>
              </Button>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              <Image
                src={
                  companyData?.aboutImage ||
                  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop" ||
                  "/placeholder.svg"
                }
                alt="SKM파트너스 회사 소개"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">전문 서비스</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              다양한 빌딩관리 서비스를 통해 고객의 만족과 신뢰를 얻고 있습니다
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="mr-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg">
              <Link href="/services">모든 서비스 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">고객 후기</h2>
            <p className="text-xl text-gray-600">고객들의 생생한 후기를 확인해보세요</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">지금 바로 상담받으세요</h2>
          <p className="text-xl mb-8 opacity-90">전문가와의 무료 상담을 통해 최적의 빌딩관리 솔루션을 찾아보세요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Phone className="w-5 h-5 mr-2" />
              <Link href="tel:02-1234-5678">02-1234-5678</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Mail className="w-5 h-5 mr-2" />
              <Link href="/contact">온라인 상담</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
