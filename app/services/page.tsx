"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Shield, Scale, MapPin, Building, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { useEffect, useState } from "react"
import Section from "@/components/section" // Declare the Section variable

interface CompanyData {
  servicesHeroUrl?: string
  serviceShowcaseUrl?: string
  buildingManagementUrl?: string
  cleaningServiceUrl?: string
  fireInspectionUrl?: string
  elevatorManagementUrl?: string
}

export default function ServicesPage() {
  const [companyData, setCompanyData] = useState<CompanyData>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    try {
      const response = await fetch(`/api/company?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      const data = await response.json()
      if (data) {
        setCompanyData(data)
      }
    } catch (error) {
      console.error("회사 데이터 로드 실패:", error)
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
      <Section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  2장 서비스 소개
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">주요 서비스</h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  SKM파트너스는 차별화된 전문 인력을 통해 신속하고 효과적인 문제 해결을 제공합니다.
                </p>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyData.servicesHeroUrl ||
                  "/placeholder.svg?height=500&width=600&query=professional building services"
                }
                alt="서비스 소개"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                fallbackText="서비스 소개 이미지"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Main Services */}
      <Section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">주요 서비스</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold">1. 종합건설 출신 이사진 구성</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 text-sm space-y-2 text-left">
                  <p>• 수전, LED, 가스 경보기 등 간단한 수리</p>
                  <p>• 도배, 몰딩, 타일 등 인테리어 공사</p>
                  <p>• 누수 등 골조 관련 수리까지 가능한 건축 인프라 전문가 보유</p>
                  <p>• 리노베이션 및 긴급 보수까지 원스톱 지원 가능</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold">2. 부동산 전문 법률대리인 협업</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 text-sm space-y-2 text-left">
                  <p>• 임대차 분쟁 발생 시 임대인 중심의 법률 지원 제공</p>
                  <p>• 다수의 임대 관련 소송 및 실무 경험 보유</p>
                  <p>• 계약서 작성, 계약 갱신 시 법적 리스크 최소화</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-semibold">3. 전국 어디든 가능</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 text-sm space-y-2 text-left">
                  <p>• 서울, 경기, 인천은 물론 전국 모든 지역의 부동산 대상</p>
                  <p>• 위치 제약 없이 신속 대응, 실질적 수익 창출 지원</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-semibold">4. 법인 시스템 운영</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 text-sm space-y-2 text-left">
                  <p>• 자금 운용과 회계 처리를 투명하고 체계적으로 관리</p>
                  <p>• 법인 명의의 계약 및 정산으로 신뢰성 확보</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Expected Effects */}
      <Section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">기대 효과</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">1. 임대인의 자산 가치 보호 및 수익 극대화</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>건물 외관 및 내부 상태 개선을 통해 부동산 가치 상승 유도</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>불필요한 공실 기간 제거로 임대 수익 극대화 실현</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>공실 세대의 신속한 정비 및 임차인 유치를 통해 수익 회복 가속화</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">2. 불법 임대 방지 및 관리비 체납 리스크 감소</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>법률 전문가와 협업을 통해 깔세 등 불법 임대 구조를 사전에 차단</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>거주자 확인 및 계약서 정비를 통해 관리비 체납 가능성 최소화</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">3. 관리업체의 업무 부담 경감</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>입주자 확인/공실 정비/수리 등 복잡한 과정을 SKM파트너스가 직접 수행</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>관리업체는 핵심 업무에 집중 가능, 운영 효율성 증가</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Scale className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">4. 법률 대리인을 통한 안전한 자산 관리</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>임대인 중심의 법률 대리인이 계약 및 분쟁 예방·대응</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>자산의 법적 안정성과 신뢰도를 높임</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Service Showcase */}
      <Section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">전문성과 신뢰성</h2>
              <p className="text-xl text-gray-600 mb-8">
                종합건설 출신의 전문 인력과 부동산 법률 전문가가 함께하는 차별화된 서비스를 경험하세요.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">건축 인프라 전문가 보유</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">다수의 임대 관련 소송 및 실무 경험</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">투명하고 체계적인 법인 시스템</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyData.serviceShowcaseUrl ||
                  "/placeholder.svg?height=400&width=600&query=professional service showcase"
                }
                alt="서비스 쇼케이스"
                className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                fallbackText="서비스 쇼케이스"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">지금 바로 시작하세요</h2>
            <p className="text-xl text-blue-100 mb-8">
              공실 문제 해결과 임대수입 극대화를 위한 전문적인 상담을 받아보세요.
            </p>
            <Button size="lg" variant="secondary" className="px-8 py-3">
              무료 상담 신청하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
