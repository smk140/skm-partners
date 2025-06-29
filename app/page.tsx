import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Award, ArrowRight, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { getCompanyData } from "@/lib/file-db"
import { SafeImage } from "@/components/safe-image"

// 데이터 캐시를 사용하지 않고 항상 최신 데이터를 가져오도록 설정
export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const companyData = await getCompanyData()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">{companyData.name}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{companyData.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3" asChild>
                  <Link href="/contact" className="flex items-center">
                    무료 상담 신청하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent" asChild>
                  <Link href="/services">서비스 둘러보기</Link>
                </Button>
              </div>
            </div>
            {/* 이미지 컨테이너: position: relative과 크기 지정 */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <SafeImage
                src={companyData.heroImageUrl || ""}
                alt="SKM파트너스 건물 관리 서비스"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">서비스 소개</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SKM파트너스는 건물 관리의 모든 영역에서 전문적인 서비스를 제공합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 건물 종합 관리 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold">건물 종합 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <SafeImage
                    src={companyData.buildingManagementUrl || ""}
                    alt="건물 종합 관리 서비스"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="ghost" className="w-full justify-start">
                  자세히 보기 <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            {/* 청소 서비스 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold">청소 서비스</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <SafeImage
                    src={companyData.cleaningServiceUrl || ""}
                    alt="청소 서비스"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="ghost" className="w-full justify-start">
                  자세히 보기 <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            {/* 소방 안전 관리 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold">소방 안전 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                  <SafeImage
                    src={companyData.fireInspectionUrl || ""}
                    alt="소방 안전 관리"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button variant="ghost" className="w-full justify-start">
                  자세히 보기 <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">{companyData.name}와 함께하는 이유</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">전문성</h3>
                    <p className="text-gray-600">
                      수년간의 경험과 전문 지식을 바탕으로 최고 품질의 서비스를 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">신뢰성</h3>
                    <p className="text-gray-600">고객과의 약속을 지키며, 투명하고 정직한 서비스를 제공합니다.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">혁신</h3>
                    <p className="text-gray-600">최신 기술과 방법론을 도입하여 더 효율적인 관리 서비스를 제공합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <SafeImage src={companyData.aboutImageUrl || ""} alt="SKM파트너스 사무실" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">지금 바로 무료 상담을 받아보세요</h2>
            <p className="text-xl text-blue-100 mb-8">
              전문가가 직접 방문하여 건물 상태를 점검하고 최적의 관리 방안을 제안해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                <Phone className="mr-2 h-5 w-5" />
                {companyData.phone}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Mail className="mr-2 h-5 w-5" />
                {companyData.email}
              </Button>
            </div>
            {companyData.address && (
              <div className="flex items-center justify-center text-blue-100">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{companyData.address}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
