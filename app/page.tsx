"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Award, ArrowRight, Phone, Mail } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { useEffect, useState } from "react"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
  slogan: string
  site_images?: {
    hero_main?: string
    company_building?: string
    team_photo?: string
    service_showcase?: string
  }
  main_services?: string[]
}

export default function HomePage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    slogan: "공실률 ZERO를 위한 스마트 건물 관리 솔루션",
    description: "청소, 소방, 엘리베이터 관리까지 - 건물 가치를 높이는 SKM파트너스의 원스톱 서비스",
    address: "",
    phone: "",
    email: "",
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  전문 건물 관리 서비스
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {companyInfo.slogan || "공실률 ZERO를 위한 스마트 건물 관리 솔루션"}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {companyInfo.description ||
                    "청소, 소방, 엘리베이터 관리까지 - 건물 가치를 높이는 SKM파트너스의 원스톱 서비스"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  무료 상담 신청하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  서비스 둘러보기
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <SafeImage
                  src={
                    companyInfo.site_images?.hero_main ||
                    "/placeholder.svg?height=600&width=800&query=modern office building management"
                  }
                  alt="SKM파트너스 건물 관리 서비스"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  fallbackText="건물 관리 서비스 이미지"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-600 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">서비스 소개</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SKM파트너스는 건물 관리의 모든 영역에서 전문적인 서비스를 제공합니다. 청소부터 소방, 엘리베이터 관리까지
              건물 관리의 A부터 Z까지 책임집니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">건물 종합 관리</CardTitle>
                <CardDescription className="text-gray-600">
                  시설 유지보수부터 보안까지 건물 운영의 모든 것을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SafeImage
                  src={
                    companyInfo.site_images?.service_showcase ||
                    "/placeholder.svg?height=200&width=300&query=building management service"
                  }
                  alt="건물 종합 관리 서비스"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  fallbackText="건물 관리 서비스"
                />
                <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-50">
                  자세히 보기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">청소 서비스</CardTitle>
                <CardDescription className="text-gray-600">
                  전문적인 청소 서비스로 쾌적하고 위생적인 환경을 만들어드립니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SafeImage
                  src="/placeholder.svg?height=200&width=300"
                  alt="청소 서비스"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  fallbackText="청소 서비스"
                />
                <Button variant="ghost" className="w-full justify-between group-hover:bg-green-50">
                  자세히 보기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold">소방 안전 관리</CardTitle>
                <CardDescription className="text-gray-600">
                  화재 예방부터 안전 점검까지 건물의 안전을 책임집니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SafeImage
                  src="/placeholder.svg?height=200&width=300"
                  alt="소방 안전 관리"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  fallbackText="소방 안전 관리"
                />
                <Button variant="ghost" className="w-full justify-between group-hover:bg-red-50">
                  자세히 보기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {companyInfo.name || "SKM파트너스"}와 함께하는 이유
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">전문성</h3>
                    <p className="text-gray-600">
                      수년간의 경험과 전문 지식을 바탕으로 최고 품질의 서비스를 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">신뢰성</h3>
                    <p className="text-gray-600">고객과의 약속을 지키며, 투명하고 정직한 서비스를 제공합니다.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">혁신</h3>
                    <p className="text-gray-600">최신 기술과 방법론을 도입하여 더 효율적인 관리 서비스를 제공합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyInfo.site_images?.company_building ||
                  "/placeholder.svg?height=500&width=600&query=modern office building exterior"
                }
                alt="SKM파트너스 사무실"
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
                fallbackText="회사 건물"
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
                <Phone className="mr-2 h-5 w-5" />
                전화 상담 신청
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              >
                <Mail className="mr-2 h-5 w-5" />
                이메일 문의
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
