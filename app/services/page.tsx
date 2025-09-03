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
            backgroundImage: `url("https://i.ibb.co/DHTWNKHn/professional-services-teamwork.png")`,
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">서비스</h1>
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
                SKM파트너스는 차별화된 전문 인력을 통해 신속하고 효과적인 문제 해결을 제공합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">종합건설 출신 이사진 구성</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">부동산 전문 법률대리인 협업</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">전국 어디든 가능</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">종합건설 출신 이사진 구성</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <SafeImage
                  src="https://i.ibb.co/wFwf7N0w/image.jpg"
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

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">주요서비스</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SKM파트너스는 차별화된 전문 인력을 통해 신속하고 효과적인 문제 해결을 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">종합건설 출신 이사진 구성</h3>
              <p className="text-gray-600">
                수전, LED,가스 경보기 등 간단한 수리 도배, 몰딩, 타일 등 인테리어 공사 누수 등 골조 관련 수리까지 가능한
                건축 인프라 전문가 보유 리노베이션 및 긴급 보수까지 원스톱 지원 가능
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">부동산 전문 법률대리인 협업</h3>
              <p className="text-gray-600">
                임대차 분쟁 발생 시 임대인 중심의 법률 지원 제공 다수의 임대 관련 소송 및 실무 경험 보유 계약서 작성,
                계약 갱신 시 법적 리스크 최소화
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">전국 어디든 가능</h3>
              <p className="text-gray-600">
                서울,경기,인천은 물론 전국 모든 지역의 부동산 대상 위치 제약 없이 신속 대응, 실질적 수익 창출 지원
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">법인 시스템 운영</h3>
              <p className="text-gray-600">
                자금 운용과 회계 처리를 투명하고 체계적으로 관리 법인 명의의 계약 및 정산으로 신뢰성 확보
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">기대효과</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              체계적인 접근과 관리로 고객에게 안정적이고 신뢰할 수 있는 결과를 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Real Estate Investment */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <Home className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">임대인의 자산 가치 보호 및 수익 극대화</CardTitle>
                <CardDescription>자산 가치 보호 및 수익 극대화</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  건물 외관 및 내부 상태 개선을 통해 부동산 가치 상승 유도 불필요한 공실 기간 제거로 임대 수익 극대화
                  실현 공실 세대의 신속한 정비 및 임차인 유치를 통해 수익 회복 가속화
                </p>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">불법 임대 방지 및 관리비 체납 리스크 감소</CardTitle>
                <CardDescription>불법 임대 방지 및 리스크 관리</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  법률 전문가와 협업을 통해 깔세 등 불법 임대 구조를 사전에 차단 거주자 확인 및 계약서 정비를 통해
                  관리비 체납 가능성 최소화
                </p>
              </CardContent>
            </Card>

            {/* Consulting */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl">관리업체의 업무 부담 경감</CardTitle>
                <CardDescription>관리 업무 부담 경감</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  입주자 확인/공실 정비/수리 등 복잡한 과정을 SKM파트너스가 직접 수행 관리업체는 핵심 업무에 집중 가능,
                  운영 효율성 증가
                </p>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl">법률 대리인을 통한 안전한 자산 관리</CardTitle>
                <CardDescription>법률 안전성 확보</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  임대인 중심의 법률 대리인이 계약 및 분쟁 예방·대응 자산의 법적 안정성과 신뢰도를 높힘
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">서비스 프로세스</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              체계적인 프로세스를 통해 고객에게 최고의 서비스를 제공합니다.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <Home className="mx-auto mb-4 h-10 w-10 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">상담 및 분석</h3>
              <p className="text-gray-600">
                고객의 요구사항을 정확히 파악하고 임대부동산 매물 확인과 함께 시장 분석을 실시합니다.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <TrendingUp className="mx-auto mb-4 h-10 w-10 text-green-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">맞춤 제안</h3>
              <p className="text-gray-600">분석 결과를 바탕으로 최적의 임대 방향 솔루션을 제안드립니다.</p>
            </div>

            <div className="relative bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <Users className="mx-auto mb-4 h-10 w-10 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">계약 및 실행</h3>
              <p className="text-gray-600">
                계약 체결 후 영업사업팀, 유지보수팀, 임대관리팀 각 분야의 전문팀들이 협업을 통해 체계적으로 서비스를
                실행합니다.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <FileText className="mx-auto mb-4 h-10 w-10 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">임대 세대 정비</h3>
              <p className="text-gray-600">
                유지보수팀이 임대 세대의 전반적인 수리 및 옵션 상태 확인을 통해 세대를 정비합니다.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                5
              </div>
              <Home className="mx-auto mb-4 h-10 w-10 text-teal-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">임대인-임차인 연결</h3>
              <p className="text-gray-600">
                임대관리팀이 다양한 부동산 매물 채널을 통해 빠른 매칭 서비스를 제공합니다.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                6
              </div>
              <TrendingUp className="mx-auto mb-4 h-10 w-10 text-pink-500" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">임대인 보고</h3>
              <p className="text-gray-600">
                신뢰 기반의 협업 체계를 구축하여 사전 대응 가능한 리스크 관리 체계를 완성합니다.
              </p>
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

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded text-xs max-w-sm z-50">
          <div className="font-bold mb-2">Services Page Debug:</div>
          <div>Company Data: {companyData ? "✅ Loaded" : "❌ Not Loaded"}</div>
          {companyData && (
            <div className="mt-2 space-y-1">
              <div>Services Hero: Fixed URL</div>
              <div>Service Showcase: Fixed URL</div>
              <div>Phone: {companyData.phone || "❌ Not Set"}</div>
              <div>Email: {companyData.email || "❌ Not Set"}</div>
              <div>Address: {companyData.address || "❌ Not Set"}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
