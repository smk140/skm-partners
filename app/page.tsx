"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Award, ArrowRight, CheckCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { SafeImage } from "@/components/safe-image"
import { useEffect, useState } from "react"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
  aboutImageUrl?: string
  main_services?: string[]
}

export default function HomePage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    description:
      "SKM파트너스는 수많은 건축 경험을 통해 축적된 실무 노하우를 바탕으로, 시행부터 시공, 관리까지 원스톱 서비스를 제공하는 부동산 통합 솔루션 기업입니다.",
    address: "",
    phone: "",
    email: "",
    main_services: ["부동산 임대 및 관리 지원", "공실 세대 관리", "리노베이션 컨설팅", "법률 지원"],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load company info
      const companyResponse = await fetch(`/api/company?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      const companyData = await companyResponse.json()

      if (companyData) {
        setCompanyInfo((prev) => ({
          ...prev,
          ...companyData,
        }))
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error)
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
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  부동산 통합 솔루션
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{companyInfo.name}</h1>
                <div className="space-y-4">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    SKM파트너스는 수많은 건축 경험을 통해 축적된 실무 노하우를 바탕으로, 시행부터 시공, 관리까지 원스톱
                    서비스를 제공하는 부동산 통합 솔루션 기업입니다.
                  </p>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    단순한 건물 관리가 아닌, 공간의 기획부터 운영까지 전 과정을 아우르는 맞춤형 서비스를 통해 고객의
                    자산 가치를 극대화하고, 사업이 안정적이고 지속 가능한 방향으로 성장할 수 있도록 함께 하겠습니다.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="px-8 py-3">
                  <Link href="/contact">
                    무료 상담 신청
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-8 py-3 bg-transparent">
                  <Link href="/about">회사 소개 보기</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyInfo.aboutImageUrl ||
                  "/placeholder.svg?height=500&width=600&query=modern building management office"
                }
                alt="SKM파트너스 소개"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                fallbackText="회사 소개 이미지"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">주요 서비스</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              부동산의 전 생애주기를 아우르는 통합 서비스를 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyInfo.main_services?.map((service, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <Building2 className="h-8 w-8 text-blue-600" />}
                    {index === 1 && <Users className="h-8 w-8 text-blue-600" />}
                    {index === 2 && <Award className="h-8 w-8 text-blue-600" />}
                    {index === 3 && <CheckCircle className="h-8 w-8 text-blue-600" />}
                  </div>
                  <CardTitle className="text-lg font-semibold">{service}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">
                모든 서비스 보기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">왜 SKM파트너스인가?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              10년 이상의 경험과 전문성으로 고객의 성공을 보장합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">전문성</h3>
              <p className="text-gray-600">
                건축 및 부동산 분야에서 10년 이상의 풍부한 경험을 바탕으로 최고의 서비스를 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">신뢰성</h3>
              <p className="text-gray-600">투명한 프로세스와 정확한 정보 제공으로 고객과의 신뢰 관계를 구축합니다.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">맞춤형 서비스</h3>
              <p className="text-gray-600">각 고객의 특별한 요구사항을 파악하여 최적화된 솔루션을 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">지금 바로 상담받아보세요</h2>
            <p className="text-xl text-blue-100 mb-8">전문가와의 무료 상담을 통해 최적의 부동산 솔루션을 찾아보세요</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="px-8 py-3">
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  전화 상담 신청
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  이메일 문의
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
