import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Award, ArrowRight, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { getCompanyData } from "@/lib/file-db"

export default async function HomePage() {
  const companyData = await getCompanyData()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${companyData.heroImageUrl || "/placeholder.svg?height=600&width=1200&text=Hero+Background"}')`,
          }}
        ></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{companyData.name}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{companyData.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/services" className="flex items-center">
                서비스 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/contact" className="flex items-center">
                상담 문의 <Phone className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">주요 서비스</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              전문적이고 체계적인 부동산 관리 서비스를 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={companyData.buildingManagementUrl || "/placeholder.svg?height=200&width=300&text=빌딩+관리"}
                    alt="빌딩 관리"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                  빌딩 관리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>전문적인 빌딩 시설 관리 및 유지보수 서비스를 제공합니다.</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={companyData.cleaningServiceUrl || "/placeholder.svg?height=200&width=300&text=청소+서비스"}
                    alt="청소 서비스"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  청소 서비스
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>정기적이고 체계적인 청소 서비스로 쾌적한 환경을 유지합니다.</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={companyData.fireInspectionUrl || "/placeholder.svg?height=200&width=300&text=소방+점검"}
                    alt="소방 점검"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-blue-600" />
                  소방 점검
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>안전한 건물 관리를 위한 정기적인 소방 시설 점검 서비스입니다.</CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={
                      companyData.elevatorManagementUrl || "/placeholder.svg?height=200&width=300&text=엘리베이터+관리"
                    }
                    alt="엘리베이터 관리"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                  엘리베이터 관리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>엘리베이터 정기 점검 및 유지보수를 통한 안전 관리 서비스입니다.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">신뢰할 수 있는 파트너</h2>
              <p className="text-lg text-gray-600 mb-6">
                {companyData.name}는 수년간의 경험과 전문성을 바탕으로 고객의 부동산 자산을 안전하고 효율적으로
                관리합니다. 우리의 목표는 고객의 만족과 신뢰를 얻는 것입니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">10+</div>
                  <div className="text-sm text-gray-600">년 경험</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">100+</div>
                  <div className="text-sm text-gray-600">관리 건물</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">만족 고객</div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Link href="/about">
                  더 알아보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={companyData.aboutImageUrl || "/placeholder.svg?height=500&width=600&text=About+Us"}
                alt="회사 소개"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">상담 문의</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">전문 상담을 통해 최적의 부동산 관리 솔루션을 제공해드립니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center">
              <Phone className="mr-2 h-5 w-5" />
              <span>{companyData.phone}</span>
            </div>
            <div className="flex items-center justify-center">
              <Mail className="mr-2 h-5 w-5" />
              <span>{companyData.email}</span>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="mr-2 h-5 w-5" />
              <span>{companyData.address}</span>
            </div>
          </div>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/contact">
              지금 상담받기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
