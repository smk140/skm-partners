"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Shield, Wrench, ArrowRight, CheckCircle } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { useEffect, useState } from "react"

interface CompanyInfo {
  name: string
  description: string
  site_images?: {
    hero_services?: string
    service_showcase?: string
    company_building?: string
  }
  main_services?: string[]
}

export default function ServicesPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    description: "전문적인 건물 관리 서비스",
    site_images: {},
    main_services: ["건물 종합 관리", "청소 서비스", "소방 안전 관리", "엘리베이터 관리"],
  })
  const [isLoading, setIsLoading] = useState(true)

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

  const services = [
    {
      icon: Building2,
      title: "건물 종합 관리",
      description: "시설 유지보수부터 보안까지 건물 운영의 모든 것을 관리합니다.",
      features: ["시설 점검 및 유지보수", "보안 시스템 관리", "에너지 효율 최적화", "24시간 모니터링"],
      color: "blue",
    },
    {
      icon: Users,
      title: "청소 서비스",
      description: "전문적인 청소 서비스로 쾌적하고 위생적인 환경을 만들어드립니다.",
      features: ["일반 청소", "특수 청소", "카펫 및 바닥 관리", "창문 청소"],
      color: "green",
    },
    {
      icon: Shield,
      title: "소방 안전 관리",
      description: "화재 예방부터 안전 점검까지 건물의 안전을 책임집니다.",
      features: ["소방시설 점검", "화재 예방 교육", "비상 대응 계획", "안전 컨설팅"],
      color: "red",
    },
    {
      icon: Wrench,
      title: "엘리베이터 관리",
      description: "엘리베이터의 안전한 운행과 정기 점검을 담당합니다.",
      features: ["정기 점검", "고장 수리", "안전 검사", "성능 최적화"],
      color: "purple",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  전문 서비스
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {companyInfo.name} 서비스
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  건물 관리의 모든 영역에서 전문적인 서비스를 제공합니다. 청소부터 소방, 엘리베이터 관리까지 건물 관리의
                  A부터 Z까지 책임집니다.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  무료 상담 신청
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  포트폴리오 보기
                </Button>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyInfo.site_images?.hero_services ||
                  "/placeholder.svg?height=500&width=600&query=professional building management services"
                }
                alt="SKM파트너스 서비스"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                fallbackText="서비스 이미지"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">주요 서비스</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              전문성과 신뢰성을 바탕으로 고객의 건물을 최적의 상태로 관리합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-16 h-16 bg-${service.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${service.color}-200 transition-colors`}
                    >
                      <IconComponent className={`h-8 w-8 text-${service.color}-600`} />
                    </div>
                    <CardTitle className="text-2xl font-semibold">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className={`h-5 w-5 text-${service.color}-600 flex-shrink-0`} />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between group-hover:bg-${service.color}-50 mt-6`}
                    >
                      자세히 보기
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                왜 {companyInfo.name}를 선택해야 할까요?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">검증된 전문성</h3>
                    <p className="text-gray-600">
                      수년간의 경험과 전문 지식을 바탕으로 최고 품질의 서비스를 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">24시간 대응</h3>
                    <p className="text-gray-600">긴급상황 발생 시 24시간 언제든지 신속하게 대응합니다.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">맞춤형 솔루션</h3>
                    <p className="text-gray-600">각 건물의 특성에 맞는 최적화된 관리 솔루션을 제공합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyInfo.site_images?.service_showcase ||
                  "/placeholder.svg?height=500&width=600&query=professional building management showcase"
                }
                alt="서비스 쇼케이스"
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
                fallbackText="서비스 쇼케이스"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">지금 바로 무료 상담을 받아보세요</h2>
            <p className="text-xl text-blue-100 mb-8">
              전문가가 직접 방문하여 건물 상태를 점검하고 최적의 관리 방안을 제안해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                무료 상담 신청
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              >
                포트폴리오 보기
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
