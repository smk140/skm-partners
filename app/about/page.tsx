"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Heart, ArrowRight } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { useEffect, useState } from "react"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
  aboutImageUrl?: string
  teamPhotoUrl?: string
  officeInteriorUrl?: string
  main_services?: string[]
}

interface Executive {
  id: number
  name: string
  position: string
  bio: string
  order_index: number
  image_url?: string
}

export default function AboutPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    description:
      "SKM파트너스는 부동산 가치의 지속 가능성을 위해, 신뢰를 바탕으로 공실 문제를 해결하고 임대수입 극대화를 지원합니다.",
    address: "",
    phone: "",
    email: "",
    main_services: ["부동산 임대 및 관리 지원", "공실 세대 관리", "리노베이션 컨설팅", "법률 지원"],
  })
  const [executives, setExecutives] = useState<Executive[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    setIsLoading(true)
    try {
      console.log("회사 정보 로딩 시작...")
      const response = await fetch(`/api/company?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      const data = await response.json()

      console.log("API 응답:", data)

      if (data) {
        setCompanyInfo((prev) => ({
          ...prev,
          ...data,
        }))
        console.log("회사 정보 설정됨:", data)
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
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  1장 회사 소개
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{companyInfo.name}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  SKM파트너스는 부동산 가치의 지속 가능성을 위해, 신뢰를 바탕으로 공실 문제를 해결하고 임대수입 극대화를
                  지원합니다.
                </p>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyInfo.aboutImageUrl ||
                  "/placeholder.svg?height=500&width=600&query=professional building management team"
                }
                alt="SKM파트너스 소개"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                fallbackText="회사 소개 이미지"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 우리의 가치 Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">우리의 가치</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">1. 업종</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">부동산 임대 및 관리 지원 전문업체</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">2. 주요업무</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600 text-sm space-y-2 text-left">
                  <p>• 임대인-임차인-관리업체 간 원활한 커뮤니케이션 및 연결</p>
                  <p>• 공실 세대 관리 및 임차인 유치</p>
                  <p>• 불법 임대(깔세) 점검 및 해소</p>
                  <p>• 임대 가능 세대의 리노베이션 컨설팅 및 시공 지원</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold">3. 회사비전</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 font-medium">"공실 없는 건물, 신뢰받는 전문 파트너"</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {executives.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">경영진</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                풍부한 경험과 전문성을 갖춘 경영진이 SKM파트너스를 이끌어갑니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {executives
                .sort((a, b) => a.order_index - b.order_index)
                .map((executive) => (
                  <Card key={executive.id} className="text-center border-0 shadow-lg">
                    <CardHeader>
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                        <SafeImage
                          src={
                            executive.image_url ||
                            "/placeholder.svg?height=128&width=128&query=professional executive portrait"
                          }
                          alt={executive.name}
                          className="w-full h-full object-cover"
                          fallbackText="임원 사진"
                        />
                      </div>
                      <CardTitle className="text-xl font-semibold">{executive.name}</CardTitle>
                      <CardDescription className="text-blue-600 font-medium">{executive.position}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm leading-relaxed">{executive.bio}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Company Image Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">전문적인 업무환경</h2>
              <p className="text-xl text-gray-600 mb-8">
                종합건설 출신 이사진과 부동산 전문 법률대리인이 협업하여 최적의 솔루션을 제공합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">종합건설 출신 전문 인력</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">부동산 전문 법률대리인 협업</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">전국 어디든 신속 대응</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <SafeImage
                src={
                  companyInfo.officeInteriorUrl || "/placeholder.svg?height=300&width=500&query=modern office interior"
                }
                alt="사무실 내부"
                className="w-full h-64 object-cover rounded-xl shadow-lg"
                fallbackText="사무실 내부"
              />
              <SafeImage
                src={
                  companyInfo.teamPhotoUrl || "/placeholder.svg?height=300&width=500&query=professional team meeting"
                }
                alt="팀 미팅"
                className="w-full h-64 object-cover rounded-xl shadow-lg"
                fallbackText="팀 사진"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">SKM파트너스와 함께 시작하세요</h2>
            <p className="text-xl text-blue-100 mb-8">
              공실 문제 해결과 임대수입 극대화를 위한 전문적인 서비스를 제공합니다.
            </p>
            <Button size="lg" variant="secondary" className="px-8 py-3">
              무료 상담 신청하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
