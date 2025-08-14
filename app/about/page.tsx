"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, Target, Award, Shield, Lightbulb } from "lucide-react"
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
            backgroundImage: `url(${companyData?.aboutImageUrl || "/modern-office-building.png"})`,
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-6">
              회사소개
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">{companyData?.name || "SKM파트너스"}</h1>
            <div className="space-y-6 text-xl text-gray-600 leading-relaxed">
              <p>
                SKM파트너스는 수많은 건축 경험을 통해 축적된 실무 노하우를 바탕으로, 시행부터 시공, 관리까지 원스톱
                서비스를 제공하는 부동산 통합 솔루션 기업입니다.
              </p>
              <p>
                단순한 건물 관리가 아닌, 공간의 기획부터 운영까지 전 과정을 아우르는 맞춤형 서비스를 통해 고객의 자산
                가치를 극대화하고, 사업이 안정적이고 지속 가능한 방향으로 성장할 수 있도록 함께 하겠습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">우리의 가치</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                SKM파트너스는 고객 중심의 서비스 철학을 바탕으로, 지속 가능한 부동산 솔루션을 제공하며 함께 성장하는
                파트너가 되고자 합니다. 우리의 모든 서비스는 고객의 성공이 곧 우리의 성공이라는 믿음에서 시작됩니다.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <Target className="h-8 w-8 text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">전문성</h3>
                    <p className="text-gray-600">축적된 경험과 전문 지식을 바탕으로 최고 품질의 서비스를 제공합니다.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <Shield className="h-8 w-8 text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">신뢰성</h3>
                    <p className="text-gray-600">투명하고 정직한 업무 처리로 고객과의 신뢰 관계를 구축합니다.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">협력</h3>
                    <p className="text-gray-600">고객과의 긴밀한 소통을 통해 최적의 솔루션을 함께 만들어갑니다.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <Lightbulb className="h-8 w-8 text-orange-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">혁신</h3>
                    <p className="text-gray-600">끊임없는 연구와 개발을 통해 혁신적인 서비스를 제공합니다.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <SafeImage
                  src={companyData?.teamPhotoUrl}
                  alt="SKM파트너스 팀"
                  className="w-full h-[500px] object-cover"
                  fallbackSrc="/professional-team-meeting.png"
                  fallbackText="SKM파트너스 팀"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Work Environment Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <SafeImage
                  src={companyData?.officeInteriorUrl}
                  alt="SKM파트너스 사무실"
                  className="w-full h-[500px] object-cover"
                  fallbackSrc="/modern-office-interior.png"
                  fallbackText="SKM파트너스 사무실"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">전문적인 업무환경</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                SKM파트너스는 최신 기술과 체계적인 업무 프로세스를 갖춘 전문적인 업무환경에서 고객에게 최고의 서비스를
                제공합니다. 우리의 전문 팀은 각자의 분야에서 풍부한 경험을 보유하고 있으며, 지속적인 교육과 훈련을 통해
                전문성을 향상시키고 있습니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">체계적인 프로젝트 관리</h3>
                    <p className="text-gray-600">
                      각 프로젝트별 전담팀 구성과 단계별 품질 관리를 통해 완벽한 결과물을 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">지속적인 품질 향상</h3>
                    <p className="text-gray-600">
                      정기적인 교육과 최신 기술 도입을 통해 서비스 품질을 지속적으로 향상시킵니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded text-xs max-w-sm">
          <div>About Page Debug:</div>
          <div>Company Data: {companyData ? "Loaded" : "Not Loaded"}</div>
          {companyData && (
            <div>
              <div>Team Photo: {companyData.teamPhotoUrl ? "Set" : "Not Set"}</div>
              <div>Office Interior: {companyData.officeInteriorUrl ? "Set" : "Not Set"}</div>
              <div>About Image: {companyData.aboutImageUrl ? "Set" : "Not Set"}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
