"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Sparkles, Shield, Zap, CheckCircle, ArrowRight, Phone, Mail } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import type { CompanyData } from "@/lib/file-db"

export default function ServicesPage() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        console.log("🔄 Services page fetching company data...")
        const response = await fetch("/api/company", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await response.json()
        console.log("📥 Services page company data response:", data)

        if (data.success && data.company) {
          setCompanyData(data.company)
          console.log("✅ Services page company data set:", data.company)
        } else {
          console.error("❌ Services page failed to fetch company data:", data.error)
        }
      } catch (error) {
        console.error("❌ Services page network error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanyData()
  }, [])

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
            backgroundImage: `url(${companyData?.servicesHeroUrl || "/professional-services-teamwork.png"})`,
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">전문 서비스</h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              시행부터 시공, 관리까지 원스톱 서비스로 고객의 자산 가치를 극대화하는 통합 솔루션을 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">주요 서비스</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                SKM파트너스는 부동산 전 분야에 걸친 전문 서비스를 제공합니다. 고객의 다양한 요구사항에 맞춘 맞춤형
                솔루션으로 최적의 결과를 보장합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">전문가 팀의 체계적인 프로젝트 관리</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">투명한 비용 구조와 합리적인 가격</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">24시간 고객 지원 서비스</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <SafeImage
                  src={companyData?.serviceShowcaseUrl}
                  alt="서비스 쇼케이스"
                  className="w-full h-[400px] object-cover"
                  fallbackSrc="/professional-building-services.png"
                  fallbackText="서비스 쇼케이스"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">세부 서비스</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              각 분야별 전문가들이 제공하는 차별화된 서비스를 확인해보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Building Management */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <SafeImage
                    src={companyData?.buildingManagementUrl}
                    alt="건물 관리"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="/placeholder-x8sa4.png"
                    fallbackText="건물 관리"
                  />
                </div>
                <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">건물 관리</CardTitle>
                <CardDescription>전문적인 건물 유지보수 및 관리</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  체계적인 시설 관리와 정기적인 점검을 통해 건물의 가치를 유지하고 향상시킵니다.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-blue-50 bg-transparent">
                  <Link href="/services/building-management">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Cleaning Service */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <SafeImage
                    src={companyData?.cleaningServiceUrl}
                    alt="청소 서비스"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="/professional-cleaning-service.png"
                    fallbackText="청소 서비스"
                  />
                </div>
                <Sparkles className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">청소 서비스</CardTitle>
                <CardDescription>전문 청소팀의 완벽한 관리</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  전문 장비와 친환경 세제를 사용한 체계적인 청소 서비스로 쾌적한 환경을 제공합니다.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-green-50 bg-transparent">
                  <Link href="/services/cleaning">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Fire Safety */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <SafeImage
                    src={companyData?.fireInspectionUrl}
                    alt="소방 안전 관리"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="/fire-safety-inspection.png"
                    fallbackText="소방 안전 관리"
                  />
                </div>
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-xl">소방 안전 관리</CardTitle>
                <CardDescription>안전한 건물 환경 조성</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  정기적인 소방 점검과 안전 교육을 통해 화재 예방과 대응 체계를 구축합니다.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-red-50 bg-transparent">
                  <Link href="/services/fire-safety">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Elevator Management */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <SafeImage
                    src={companyData?.elevatorManagementUrl}
                    alt="엘리베이터 관리"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="/elevator-maintenance.png"
                    fallbackText="엘리베이터 관리"
                  />
                </div>
                <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle className="text-xl">엘리베이터 관리</CardTitle>
                <CardDescription>안전하고 효율적인 승강기 운영</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  정기 점검과 예방 정비를 통해 엘리베이터의 안전성과 효율성을 보장합니다.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-yellow-50 bg-transparent">
                  <Link href="/services/elevator">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">서비스 프로세스</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              체계적인 프로세스를 통해 고객에게 최고의 서비스를 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">상담 및 분석</h3>
              <p className="text-gray-600">고객의 요구사항을 정확히 파악하고 현장 분석을 실시합니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">맞춤 제안</h3>
              <p className="text-gray-600">분석 결과를 바탕으로 최적의 솔루션을 제안드립니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">계약 및 실행</h3>
              <p className="text-gray-600">계약 체결 후 전문팀이 체계적으로 서비스를 실행합니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">사후 관리</h3>
              <p className="text-gray-600">지속적인 모니터링과 개선을 통해 품질을 유지합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">서비스 문의</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            전문가와 상담하고 맞춤형 서비스를 받아보세요. 언제든지 문의해 주시면 신속하게 답변드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-blue-100">
              <Phone className="h-5 w-5" />
              <span>{companyData?.phone || "02-1234-5678"}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Mail className="h-5 w-5" />
              <span>{companyData?.email || "info@skm.kr"}</span>
            </div>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">
              지금 문의하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded text-xs max-w-sm">
          <div>Services Page Debug:</div>
          <div>Company Data: {companyData ? "Loaded" : "Not Loaded"}</div>
          {companyData && (
            <div>
              <div>Services Hero: {companyData.servicesHeroUrl ? "Set" : "Not Set"}</div>
              <div>Service Showcase: {companyData.serviceShowcaseUrl ? "Set" : "Not Set"}</div>
              <div>Building Mgmt: {companyData.buildingManagementUrl ? "Set" : "Not Set"}</div>
              <div>Cleaning: {companyData.cleaningServiceUrl ? "Set" : "Not Set"}</div>
              <div>Fire: {companyData.fireInspectionUrl ? "Set" : "Not Set"}</div>
              <div>Elevator: {companyData.elevatorManagementUrl ? "Set" : "Not Set"}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
