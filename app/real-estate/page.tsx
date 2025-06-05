"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, CheckCircle2, MapPin, Building, Eye, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// SearchBar 컴포넌트 정의
interface SearchBarProps {
  placeholder: string
  onSearch: (query: string, filters: any) => void
}

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("")

  return (
    <div className="flex">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700" onClick={() => onSearch(query, {})}>
        검색
      </Button>
    </div>
  )
}

interface Property {
  id: number
  title: string
  location: string
  type: string
  size: string
  price: string
  description: string
  status: string
  created_at: string
}

export default function RealEstatePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // 매물 데이터 로드
  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data.properties || [])
        setFilteredProperties(data.properties || [])
      }
    } catch (error) {
      console.error("매물 로드 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 검색 기능
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredProperties(properties)
    } else {
      const filtered = properties.filter(
        (property) =>
          property.title.toLowerCase().includes(query.toLowerCase()) ||
          property.location.toLowerCase().includes(query.toLowerCase()) ||
          property.type.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredProperties(filtered)
    }
  }

  // 표시할 매물 수 결정
  const displayedProperties = showAll ? filteredProperties : filteredProperties.slice(0, 5)

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="/placeholder.svg?height=400&width=1200&text=Real Estate"
          alt="부동산 서비스"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">부동산 서비스</h1>
          <p className="text-lg text-white/90 max-w-xl">
            SKM파트너스의 전문적인 부동산 서비스로 건물의 가치를 높이고 수익을 극대화하세요.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">부동산 검색</h2>

            {/* 검색 컴포넌트 */}
            <div className="mb-8">
              <SearchBar
                placeholder="지역, 건물 유형, 특징으로 검색 (예: 강남 오피스, 역세권 상가)"
                onSearch={handleSearch}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">인기 매물</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-white" onClick={() => handleSearch("강남 오피스")}>
                  강남 역세권 오피스
                </Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => handleSearch("신축")}>
                  신축 상가
                </Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => handleSearch("수익형")}>
                  수익형 부동산
                </Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => handleSearch("리모델링")}>
                  리모델링 빌딩
                </Button>
                <Button variant="outline" size="sm" className="bg-white" onClick={() => handleSearch("테헤란로")}>
                  테헤란로 사무실
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 매물 목록 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">등록된 매물</h2>
                <p className="text-gray-600">
                  총 {filteredProperties.length}개의 매물이 있습니다
                  {searchQuery && ` (검색: "${searchQuery}")`}
                </p>
              </div>
              {filteredProperties.length > 5 && (
                <Button variant="outline" onClick={() => setShowAll(!showAll)} className="flex items-center gap-2">
                  {showAll ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      접기
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      더보기 ({filteredProperties.length - 5}개 더)
                    </>
                  )}
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">매물 정보를 불러오는 중...</p>
              </div>
            ) : displayedProperties.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchQuery ? "검색 결과가 없습니다" : "등록된 매물이 없습니다"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "다른 검색어로 시도해보세요" : "곧 다양한 매물이 등록될 예정입니다. 문의해주세요!"}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  문의하기
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src="/placeholder.svg?height=200&width=300&text=Property"
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant={property.status === "활성" ? "default" : "secondary"}
                          className={property.status === "활성" ? "bg-green-600" : ""}
                        >
                          {property.status}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-white/90">
                          {property.type}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.location}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">면적:</span>
                          <span className="font-medium">{property.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">가격:</span>
                          <span className="font-medium text-blue-600">{property.price}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>
                      <Button variant="outline" className="w-full group">
                        <Eye className="mr-2 h-4 w-4" />
                        상세보기
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredProperties.length > 5 && !showAll && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setShowAll(true)}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <ChevronDown className="h-4 w-4" />
                  {filteredProperties.length - 5}개 매물 더보기
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Service Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-blue-600">임차인을 대신 찾아드립니다</h2>
                <p className="text-slate-600 mb-6">
                  건물 소유주님의 소중한 자산, 공실로 인한 손실이 걱정되시나요? SKM파트너스의 공실 임대 대행 서비스를
                  통해 최적의 임차인을 빠르게 연결해 드립니다.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">전문적인 마케팅</h4>
                      <p className="text-slate-600">다양한 채널을 통한 효과적인 매물 홍보</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">임차인 심사</h4>
                      <p className="text-slate-600">신뢰할 수 있는 임차인 선별 및 검증</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">계약 관리</h4>
                      <p className="text-slate-600">임대차 계약 체결 및 관리 지원</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">임대료 최적화</h4>
                      <p className="text-slate-600">시장 분석을 통한 최적의 임대료 책정</p>
                    </div>
                  </div>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">
                  빠른 상담 신청
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-40 rounded-lg overflow-hidden shadow-md">
                      <Image
                        src="/placeholder.svg?height=160&width=240&text=Before"
                        alt="공실 Before"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 bg-red-500 text-white px-2 py-1 text-sm">Before</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h4 className="font-semibold text-red-500">공실률 35%</h4>
                      <p className="text-sm text-slate-600">관리 전 상태</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="relative h-40 rounded-lg overflow-hidden shadow-md">
                      <Image
                        src="/placeholder.svg?height=160&width=240&text=After"
                        alt="공실 After"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 bg-green-500 text-white px-2 py-1 text-sm">After</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h4 className="font-semibold text-green-500">공실률 5%</h4>
                      <p className="text-sm text-slate-600">3개월 후</p>
                    </div>
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

      {/* Service Details */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">부동산 서비스 상세 내용</h2>

            <Tabs defaultValue="vacancy" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="vacancy">공실 임대 대행</TabsTrigger>
                <TabsTrigger value="management">임대 관리</TabsTrigger>
                <TabsTrigger value="consulting">부동산 컨설팅</TabsTrigger>
              </TabsList>

              <TabsContent value="vacancy" className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">공실 임대 대행</h3>
                    <p className="text-slate-600 mb-4">
                      SKM파트너스의 공실 임대 대행 서비스는 건물 소유주를 대신하여 최적의 임차인을 찾아드립니다.
                      전문적인 마케팅과 임차인 심사를 통해 공실률을 최소화하고 임대 수익을 극대화합니다.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>매물 분석 및 시장 조사</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>전문적인 매물 마케팅</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>임차인 모집 및 심사</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>임대차 계약 지원</span>
                      </li>
                    </ul>
                    <Button className="bg-blue-600 hover:bg-blue-700">문의하기</Button>
                  </div>
                  <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400&text=Vacancy Management"
                      alt="공실 임대 대행"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="management" className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">임대 관리</h3>
                    <p className="text-slate-600 mb-4">
                      SKM파트너스의 임대 관리 서비스는 건물 소유주의 부담을 덜어드립니다. 임대료 수납부터 임차인 관리,
                      시설 유지보수까지 모든 것을 대행해 드립니다.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>임대료 수납 관리</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>임차인 관계 관리</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>시설 유지보수 관리</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>임대차 계약 갱신 관리</span>
                      </li>
                    </ul>
                    <Button className="bg-blue-600 hover:bg-blue-700">문의하기</Button>
                  </div>
                  <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400&text=Rental Management"
                      alt="임대 관리"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="consulting" className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">부동산 컨설팅</h3>
                    <p className="text-slate-600 mb-4">
                      SKM파트너스의 부동산 컨설팅 서비스는 건물 소유주의 자산 가치를 극대화하기 위한 전략을 제시합니다.
                      시장 분석과 전문적인 조언을 통해 최적의 의사결정을 도와드립니다.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>부동산 시장 분석</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>자산 가치 평가</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>투자 전략 수립</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-1 text-green-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>리모델링 및 개발 자문</span>
                      </li>
                    </ul>
                    <Button className="bg-blue-600 hover:bg-blue-700">문의하기</Button>
                  </div>
                  <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=300&width=400&text=Real Estate Consulting"
                      alt="부동산 컨설팅"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">부동산 서비스가 필요하신가요?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            SKM파트너스의 전문적인 부동산 서비스로 건물의 가치를 높이고 수익을 극대화하세요.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-blue-600 group shadow-lg"
          >
            지금 문의하기
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </main>
  )
}
