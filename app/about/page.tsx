import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Heart, ArrowRight } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import { connectToDatabase } from "@/utils/db"
import Company from "@/models/company"

// 서버 컴포넌트에서 회사 정보 가져오기
async function getCompanyData() {
  try {
    const sql = await connectToDatabase()
    const company = new Company(sql)
    const companyInfo = await company.getCompanyInfo()
    return companyInfo
  } catch (error) {
    console.error("Failed to fetch company data:", error)
    return null
  }
}

export default async function AboutPage() {
  const companyData = await getCompanyData()

  // 기본값 설정
  const companyInfo = companyData || {
    name: "SKM파트너스",
    slogan: "공실률 ZERO를 위한 스마트 건물 관리 솔루션",
    description:
      "SKM파트너스는 건물 관리 전문 기업으로, 청소, 소방, 엘리베이터 관리 등 건물 운영에 필요한 모든 서비스를 제공합니다.",
    established_year: "2020",
    employee_count: "50+",
    service_area: "서울, 경기 전 지역",
    site_images: {
      hero_about: "",
      company_building: "",
      team_photo: "",
      office_interior: "",
    },
    main_services: ["건물 종합 관리", "청소 서비스", "소방 안전 관리", "엘리베이터 관리"],
  }

  const executives = companyData?.executives || []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  회사 소개
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{companyInfo.name}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{companyInfo.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{companyInfo.established_year}년</div>
                  <div className="text-sm text-gray-600">설립</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{companyInfo.employee_count}</div>
                  <div className="text-sm text-gray-600">직원 수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">100+</div>
                  <div className="text-sm text-gray-600">관리 건물</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src={
                  companyInfo.site_images?.hero_about ||
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

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">우리의 가치</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SKM파트너스는 고객의 성공이 곧 우리의 성공이라는 믿음으로 최고의 서비스를 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">미션</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  건물 관리의 전문성을 통해 고객의 자산 가치를 극대화하고, 쾌적한 환경을 조성합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">비전</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  대한민국 최고의 건물 관리 전문 기업으로 성장하여 업계 표준을 선도합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold">핵심가치</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">신뢰, 전문성, 혁신을 바탕으로 고객과 함께 성장하는 파트너가 되겠습니다.</p>
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
              {executives.map((executive, index) => (
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
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">현대적인 사무환경</h2>
              <p className="text-xl text-gray-600 mb-8">
                최신 시설과 장비를 갖춘 사무실에서 전문가들이 고객을 위한 최적의 솔루션을 개발합니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">최신 건물 관리 시스템</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">24시간 모니터링 센터</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">전문가 교육 시설</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <SafeImage
                src={
                  companyInfo.site_images?.office_interior ||
                  "/placeholder.svg?height=300&width=500&query=modern office interior"
                }
                alt="사무실 내부"
                className="w-full h-64 object-cover rounded-xl shadow-lg"
                fallbackText="사무실 내부"
              />
              <SafeImage
                src={
                  companyInfo.site_images?.team_photo ||
                  "/placeholder.svg?height=300&width=500&query=professional team meeting"
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
              전문적인 건물 관리 서비스로 여러분의 자산 가치를 높여드리겠습니다.
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
