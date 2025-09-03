"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Award, ArrowRight, Phone, Mail } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import type { CompanyData } from "@/lib/file-db"

export default function HomePage() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        console.log("🔄 Home page fetching company data...")
        const response = await fetch("/api/company", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await response.json()
        console.log("📥 Home page company data response:", data)

        if (data.success && data.company) {
          setCompanyData(data.company)
          console.log("✅ Home page company data set:", data.company)
        } else {
          console.error("❌ Home page failed to fetch company data:", data.error)
        }
      } catch (error) {
        console.error("❌ Home page network error:", error)
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
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  전문 부동산 서비스
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {companyData?.name || "SKM파트너스"}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {companyData?.description || "전문적인 부동산 컨설팅 서비스를 제공합니다."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/services">
                    서비스 알아보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">문의하기</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <SafeImage
                  src="https://i.ibb.co/tPBsYNpx/image.jpg"
                  alt="SKM파트너스 메인 이미지"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                  fallbackSrc="/professional-office-workspace.png"
                  fallbackText="SKM파트너스 메인 이미지"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">주요 서비스</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              시행부터 시공, 관리까지 원스톱 서비스로 고객의 자산 가치를 극대화합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building2 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>건물 관리</CardTitle>
                <CardDescription>전문적인 건물 유지보수 및 관리 서비스</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  체계적인 시설 관리와 정기적인 점검을 통해 건물의 가치를 유지하고 향상시킵니다.
                </p>
                <Button asChild variant="ghost" className="group-hover:bg-blue-50">
                  <Link href="/services">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>부동산 컨설팅</CardTitle>
                <CardDescription>전문가의 맞춤형 부동산 투자 상담</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  시장 분석과 투자 전략을 바탕으로 최적의 부동산 투자 방향을 제시합니다.
                </p>
                <Button asChild variant="ghost" className="group-hover:bg-green-50">
                  <Link href="/services">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>프로젝트 관리</CardTitle>
                <CardDescription>시행부터 완공까지 전 과정 관리</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  프로젝트 기획부터 완공까지 체계적인 관리로 성공적인 결과를 보장합니다.
                </p>
                <Button asChild variant="ghost" className="group-hover:bg-purple-50">
                  <Link href="/services">
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">왜 SKM파트너스인가?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              풍부한 경험과 전문성을 바탕으로 고객에게 최고의 서비스를 제공합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">풍부한 경험</h3>
              <p className="text-gray-600">
                수많은 프로젝트를 통해 축적된 실무 노하우로 안정적이고 효율적인 서비스를 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">전문 팀</h3>
              <p className="text-gray-600">
                각 분야의 전문가들이 협력하여 고객의 다양한 요구사항에 맞는 최적의 솔루션을 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">검증된 품질</h3>
              <p className="text-gray-600">
                체계적인 품질 관리 시스템을 통해 일관되고 우수한 서비스 품질을 보장합니다.
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-blue-100">
              <Phone className="h-5 w-5" />
              <span>{companyData?.phone || "02-853-7715"}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Mail className="h-5 w-5" />
              <span>{companyData?.email || "bykim@skm.kr"}</span>
            </div>
          </div>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                지금 문의하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded text-xs max-w-sm z-50">
          <div className="font-bold mb-2">Home Page Debug:</div>
          <div>Company Data: {companyData ? "✅ Loaded" : "❌ Not Loaded"}</div>
          {companyData && (
            <div className="mt-2 space-y-1">
              <div>Hero Image: Fixed URL</div>
              <div>Name: {companyData.name || "❌ Not Set"}</div>
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
