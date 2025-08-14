"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Award, Target, CheckCircle, ArrowRight, Phone, Mail } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import type { CompanyData } from "@/lib/file-db"

export default function AboutPage() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        console.log("🔄 About page fetching company data...")
        const response = await fetch("/api/company", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const data = await response.json()
        console.log("📥 About page company data response:", data)

        if (data.success && data.company) {
          setCompanyData(data.company)
          console.log("✅ About page company data set:", data.company)
        } else {
          console.error("❌ About page failed to fetch company data:", data.error)
        }
      } catch (error) {
        console.error("❌ About page network error:", error)
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
            backgroundImage: `url(${companyData?.aboutHeroUrl || "/professional-team-meeting.png"})`,
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-6">
              회사 소개
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">{companyData?.name || "SKM파트너스"}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {companyData?.description || "전문적인 부동산 컨설팅 서비스를 제공합니다."}
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">우리의 이야기</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                SKM파트너스는 부동산 업계에서 축적된 풍부한 경험과 전문성을 바탕으로 고객에게 최고의 서비스를 제공하고
                있습니다.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                우리는 단순한 서비스 제공을 넘어서, 고객의 자산 가치를 극대화하고 지속 가능한 성장을 돕는 진정한
                파트너가 되고자 합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">고객 중심의 맞춤형 서비스</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">투명하고 신뢰할 수 있는 업무 프로세스</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">지속적인 혁신과 품질 개선</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <SafeImage
                  src={companyData?.teamImageUrl}
                  alt="SKM파트너스 팀"
                  className="w-full h-[400px] object-cover"
                  fallbackSrc="/professional-team-meeting.png"
                  fallbackText="SKM파트너스 팀"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">미션 & 비전</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              우리의 사명과 비전을 통해 더 나은 미래를 만들어갑니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">미션</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  전문적인 부동산 서비스를 통해 고객의 자산 가치를 극대화하고, 신뢰할 수 있는 파트너로서 지속 가능한
                  성장을 함께 만들어갑니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">비전</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  부동산 업계의 선도적인 기업으로서 혁신적인 서비스와 최고의 품질을 통해 고객과 사회에 가치를 창출하는
                  글로벌 파트너가 되겠습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">핵심 가치</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              우리가 추구하는 가치들이 모든 업무의 기준이 됩니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">전문성</h3>
              <p className="text-gray-600">
                깊이 있는 전문 지식과 풍부한 경험을 바탕으로 최고 수준의 서비스를 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">신뢰</h3>
              <p className="text-gray-600">투명하고 정직한 소통을 통해 고객과의 신뢰 관계를 구축하고 유지합니다.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">혁신</h3>
              <p className="text-gray-600">끊임없는 연구와 개발을 통해 더 나은 서비스와 솔루션을 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Image */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">우리의 공간</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              현대적이고 전문적인 환경에서 최고의 서비스를 제공합니다.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <SafeImage
                src={companyData?.officeImageUrl}
                alt="SKM파트너스 사무실"
                className="w-full h-[500px] object-cover"
                fallbackSrc="/modern-office-interior.png"
                fallbackText="SKM파트너스 사무실"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">함께 성장할 파트너를 찾고 계신가요?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            SKM파트너스와 함께 새로운 가능성을 발견하고 성공적인 프로젝트를 만들어보세요.
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
              문의하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded text-xs max-w-sm">
          <div>About Page Debug:</div>
          <div>Company Data: {companyData ? "Loaded" : "Not Loaded"}</div>
          {companyData && (
            <div>
              <div>About Hero: {companyData.aboutHeroUrl ? "Set" : "Not Set"}</div>
              <div>Team Image: {companyData.teamImageUrl ? "Set" : "Not Set"}</div>
              <div>Office Image: {companyData.officeImageUrl ? "Set" : "Not Set"}</div>
              <div>Phone: {companyData.phone}</div>
              <div>Email: {companyData.email}</div>
              <div>Address: {companyData.address}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
