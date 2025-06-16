"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Building,
  Eye,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Users,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"

interface Property {
  id: number
  title: string
  location: string
  type: string
  size: string
  price: string
  description: string
  status: string
  createdAt: string
  image_url?: string
}

export default function RealEstatePage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    console.log("🔄 매물 데이터 로드 시작...")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/properties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP 오류: ${response.status}` }))
        throw new Error(errorData.error || `HTTP 오류: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.properties)) {
        setProperties(data.properties.slice(0, 3)) // 3개만 표시
        console.log("✅ 매물 데이터 설정 완료:", data.properties.length, "개 중 3개 표시")
      } else {
        setProperties([])
        setError("매물 데이터 형식이 올바르지 않습니다.")
      }
    } catch (err) {
      console.error("💥 매물 로드 실패:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePropertyClick = (propertyId: number) => {
    router.push(`/real-estate/${propertyId}`)
  }

  const handleBrowseAll = () => {
    router.push("/real-estate/browse")
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
                  부동산 서비스
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="text-blue-600">공실률 ZERO</span>를 위한
                  <br />
                  전문 부동산 서비스
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  SKM파트너스의 전문적인 부동산 서비스로 건물의 가치를 높이고 수익을 극대화하세요.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                  무료 상담 신청
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  매물 둘러보기
                </Button>
              </div>
            </div>
            <div className="relative">
              <SafeImage
                src="/placeholder.svg?height=500&width=600"
                alt="부동산 서비스"
                className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                fallbackText="부동산 서비스"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-600 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <p className="text-gray-600">평균 임대율</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <p className="text-gray-600">만족한 고객</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10년+</div>
              <p className="text-gray-600">업계 경험</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">추천 매물</h2>
                <p className="text-xl text-gray-600">SKM파트너스가 엄선한 우수 매물을 확인해보세요</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadProperties}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  새로고침
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">매물 정보를 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <Card className="max-w-md mx-auto border-red-200 bg-red-50">
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-red-700 mb-2">오류 발생</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={loadProperties} className="bg-red-600 hover:bg-red-700">
                      다시 시도
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16">
                <Card className="max-w-md mx-auto">
                  <CardContent className="p-8 text-center">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">등록된 매물이 없습니다</h3>
                    <p className="text-gray-500 mb-4">관리자 페이지에서 매물을 추가해주세요!</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      문의하기
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.map((property) => (
                    <Card
                      key={property.id}
                      className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 cursor-pointer"
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <SafeImage
                          src={property.image_url || "/placeholder.svg?height=200&width=300&query=real estate property"}
                          alt={property.title || "부동산 매물"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fallbackText="매물 이미지"
                        />
                        {property.status && (
                          <div className="absolute top-4 left-4">
                            <Badge
                              variant={property.status === "활성" ? "default" : "secondary"}
                              className={property.status === "활성" ? "bg-green-600 text-white" : ""}
                            >
                              {property.status}
                            </Badge>
                          </div>
                        )}
                        {property.type && (
                          <div className="absolute top-4 right-4">
                            <Badge variant="outline" className="bg-white/90">
                              {property.type}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 truncate" title={property.title}>
                          {property.title || "제목 없음"}
                        </h3>
                        {property.location && (
                          <div className="flex items-center text-gray-500 text-sm mb-3">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate" title={property.location}>
                              {property.location}
                            </span>
                          </div>
                        )}
                        <div className="space-y-2 mb-4">
                          {property.size && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">면적:</span>
                              <span className="font-medium">{property.size}</span>
                            </div>
                          )}
                          {property.price && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">가격:</span>
                              <span className="font-medium text-blue-600">{property.price}</span>
                            </div>
                          )}
                        </div>
                        {property.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2" title={property.description}>
                            {property.description}
                          </p>
                        )}
                        <Button variant="ghost" className="w-full group-hover:bg-blue-50">
                          <Eye className="mr-2 h-4 w-4" />
                          상세보기
                          <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 더보기 버튼 */}
                <div className="text-center mt-12">
                  <Button
                    onClick={handleBrowseAll}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    모든 매물 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Service Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-blue-600">임차인을 대신 찾아드립니다</h2>
                <p className="text-xl text-gray-600 mb-8">
                  건물 소유주님의 소중한 자산, 공실로 인한 손실이 걱정되시나요? SKM파트너스의 공실 임대 대행 서비스를
                  통해 최적의 임차인을 빠르게 연결해 드립니다.
                </p>
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">전문적인 마케팅</h4>
                      <p className="text-gray-600">다양한 채널을 통한 효과적인 매물 홍보</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">임차인 심사</h4>
                      <p className="text-gray-600">신뢰할 수 있는 임차인 선별 및 검증</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">계약 관리</h4>
                      <p className="text-gray-600">임대차 계약 체결 및 관리 지원</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-1">임대료 최적화</h4>
                      <p className="text-gray-600">시장 분석을 통한 최적의 임대료 책정</p>
                    </div>
                  </div>
                </div>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  빠른 상담 신청
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">35%</div>
                        <p className="text-red-700 font-medium">공실률</p>
                        <Badge variant="destructive" className="mt-2">
                          Before
                        </Badge>
                      </CardContent>
                    </Card>
                    <SafeImage
                      src="/placeholder.svg?height=160&width=240"
                      alt="공실 Before"
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                      fallbackText="관리 전"
                    />
                  </div>
                  <div className="space-y-6">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">5%</div>
                        <p className="text-green-700 font-medium">공실률</p>
                        <Badge className="mt-2 bg-green-600">After</Badge>
                      </CardContent>
                    </Card>
                    <SafeImage
                      src="/placeholder.svg?height=160&width=240"
                      alt="공실 After"
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                      fallbackText="관리 후"
                    />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-lg font-bold shadow-lg transform rotate-12">
                  <div className="text-center">
                    <div className="text-2xl">30%</div>
                    <div className="text-xs">개선</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">부동산 서비스가 필요하신가요?</h2>
            <p className="text-xl text-blue-100 mb-8">
              SKM파트너스의 전문적인 부동산 서비스로 건물의 가치를 높이고 수익을 극대화하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                무료 상담 신청
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              >
                매물 등록 문의
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
