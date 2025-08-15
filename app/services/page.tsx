"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, TrendingUp, Users, FileText, ArrowRight, Phone, Mail, CheckCircle } from "lucide-react"
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
              부동산 전문가와 함께하는 성공적인 투자와 관리 솔루션을 제공합니다.
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
                SKM파트너스는 부동산 투자부터 관리까지 전 과정을 지원하는 종합 서비스를 제공합니다. 고객의 성공적인
                부동산 투자를 위해 최선을 다하겠습니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">전문가 팀의 체계적인 분석과 상담</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">투명하고 합리적인 수수료 구조</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">지속적인 사후 관리 서비스</span>
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

      {/* Service Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">서비스 분야</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              다양한 부동산 분야에서 전문적인 서비스를 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Real Estate Investment */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <Home className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">부동산 투자</CardTitle>
                <CardDescription>수익성 높은 부동산 투자 기회 발굴</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">시장 분석을 통한 최적의 투자 물건 추천과 투자 전략을 제공합니다.</p>
                <Button asChild variant="outline" className="w-full group-hover:bg-blue-50 bg-transparent">
                  <Link href="/real-estate">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">시장 분석</CardTitle>
                <CardDescription>정확한 시장 동향 분석 서비스</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">빅데이터 기반의 시장 분석으로 정확한 투자 판단을 도와드립니다.</p>
                <Button asChild variant="outline" className="w-full group-hover:bg-green-50 bg-transparent">
                  <Link href="/services/market-analysis">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Consulting */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl">전문 컨설팅</CardTitle>
                <CardDescription>맞춤형 부동산 컨설팅</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">고객의 상황에 맞는 개별 맞춤형 부동산 컨설팅을 제공합니다.</p>
                <Button asChild variant="outline" className="w-full group-hover:bg-purple-50 bg-transparent">
                  <Link href="/services/consulting">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl">서류 대행</CardTitle>
                <CardDescription>복잡한 부동산 서류 처리</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">부동산 거래에 필요한 모든 서류 작성과 처리를 대행해드립니다.</p>
                <Button asChild variant="outline" className="w-full group-hover:bg-orange-50 bg-transparent">
                  <Link href="/services/documentation">
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
              <p className="text-gray-600">고객의 요구사항을 정확히 파악하고 시장 분석을 실시합니다.</p>
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
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">프로젝트를 시작할 준비가 되셨나요?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            전문가와 상담하고 맞춤형 솔루션을 받아보세요. 언제든지 문의해 주시면 신속하게 답변드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-blue-100">
              <Phone className="h-5 w-5" />
              <span>{companyData?.phone || "02-853-7715"}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Mail className="h-5 w-5" />
              <span>{companyData?.email || "bykim@skm.kr"}</span>
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
    </div>
  )
}
