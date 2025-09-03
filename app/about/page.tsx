"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Phone, Mail, Briefcase, ShieldCheck, UserCheck } from "lucide-react"
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
            backgroundImage: `url("https://i.ibb.co/39q09R2b/professional-team-meeting.png")`,
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
                SKM파트너스는 수많은 건축 경험과 부동산 관리 경험을 통해 축적된 실무 노하우를 바탕으로, 부동산 가치의
                지속 가능성을 위해 신뢰를 바탕으로 공실 문제를 해결하고 임대수입 극대화를 지원합니다.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                단순한 건물 임대 관리가 아닌, 공간의 기획부터 운영까지 전 과정을 아우르는 맞춤형 서비스를 통해 고객의
                자산 가치를 극대화하고, 고객의 임대 사업이 안정적이고 지속 가능한 방향으로 성장할 수 있도록 함께
                하겠습니다.
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
                  src="https://i.ibb.co/8DhXjTW7/image.jpg"
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
          <div className="mb-16 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">우리의 가치</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              "설계부터 관리까지, 고객의 니즈를 이해하고 실행하는 파트너" SKM파트너스는 2025년 설립되었지만, 그 이전
              10년 이상의 건축 및 부동산 운영 경험을 바탕으로 임대인의 자산을 더 가치 있게, 더 안전하게 만들기 위한
              솔루션을 지속적으로 제공해오고 있습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Briefcase className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">최고의 서비스 구현</CardTitle>
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
                <ShieldCheck className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-2xl">안전한 건물 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  건축 및 시공 분야에서 축적한 현장 경험과 기술 노하우를 바탕으로 건물 하자 및 유지보수 이슈에
                  선제적으로 대응, 리스크를 최소화합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <UserCheck className="h-16 w-16 text-green-300 mx-auto mb-4" />
                <CardTitle className="text-2xl">고객의 만족 추구</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  우리는 단순한 관리 대행을 넘어 공실 없는 건물과 안정적인 임대 수익 실현을 함께 고민하는 신뢰받는
                  파트너가 되겠습니다.
                </p>
              </CardContent>
            </Card>
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
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded text-xs max-w-sm z-50">
          <div className="font-bold mb-2">About Page Debug:</div>
          <div>Company Data: {companyData ? "✅ Loaded" : "❌ Not Loaded"}</div>
          {companyData && (
            <div className="mt-2 space-y-1">
              <div>About Hero: Fixed URL</div>
              <div>Team Image: Fixed URL</div>
              <div>Office Image: Fixed URL</div>
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
