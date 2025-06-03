"use client"

import Image from "next/image"
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// SearchBar 컴포넌트 정의
interface SearchBarProps {
  placeholder: string
  onSearch: (query: string, filters: any) => void
}

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  return (
    <div className="flex">
      <input
        type="text"
        placeholder={placeholder}
        className="flex-grow rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700" onClick={() => onSearch("검색어", {})}>
        검색
      </Button>
    </div>
  )
}

export default function RealEstatePage() {
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

            {/* 검색 컴포넌트 추가 */}
            <div className="mb-8">
              <SearchBar
                placeholder="지역, 건물 유형, 특징으로 검색 (예: 강남 오피스, 역세권 상가)"
                onSearch={(query, filters) => {
                  console.log("검색:", query, filters)
                  // 여기에 검색 로직 구현
                }}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">인기 매물</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-white">
                  강남 역세권 오피스
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  신축 상가
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  수익형 부동산
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  리모델링 빌딩
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  테헤란로 사무실
                </Button>
              </div>
            </div>
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

      {/* Success Cases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">성공 사례</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            SKM파트너스의 부동산 서비스를 통해 건물 가치를 높이고 수익을 극대화한 실제 사례입니다.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "강남 오피스 빌딩",
                location: "서울 강남구",
                before: "공실률 40%",
                after: "공실률 5%",
                period: "3개월",
                image: "/placeholder.svg?height=200&width=300&text=Case 1",
                details:
                  "테헤란로에 위치한 10층 규모 오피스 빌딩으로, 노후화된 시설과 관리 부실로 공실률이 40%에 달했습니다. SKM파트너스의 종합 관리 서비스 적용 후 3개월 만에 공실률 5%로 개선되었습니다.",
              },
              {
                title: "분당 상가 건물",
                location: "경기 성남시 분당구",
                before: "공실률 30%",
                after: "공실률 0%",
                period: "2개월",
                image: "/placeholder.svg?height=200&width=300&text=Case 2",
                details:
                  "분당 신도시 중심 상권에 위치한 5층 규모 상가 건물로, 주변 경쟁 시설 증가로 공실률이 30%까지 상승했습니다. SKM파트너스의 임대 마케팅 전략 적용 후 2개월 만에 100% 임대 달성했습니다.",
              },
              {
                title: "홍대 복합 건물",
                location: "서울 마포구",
                before: "공실률 25%",
                after: "공실률 3%",
                period: "4개월",
                image: "/placeholder.svg?height=200&width=300&text=Case 3",
                details:
                  "홍대입구역 인근 복합 상업시설로, 코로나19 이후 공실률이 25%까지 증가했습니다. SKM파트너스의 시설 개선 및 임대 전략 컨설팅 후 4개월 만에 공실률 3%로 회복했습니다.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-blue-600"
              >
                <div className="relative h-48">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                    {item.period} 만에 해결
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{item.location}</span>
                  </div>

                  <div className="flex justify-between items-center mb-4 p-2 bg-slate-50 rounded-lg">
                    <div className="text-red-500 font-medium text-center flex-1 border-r border-slate-200">
                      Before
                      <br />
                      {item.before}
                    </div>
                    <div className="text-slate-500 px-2">→</div>
                    <div className="text-green-500 font-medium text-center flex-1 border-l border-slate-200">
                      After
                      <br />
                      {item.after}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">{item.details}</p>

                  <Button variant="outline" className="w-full group">
                    상세 사례 보기
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button className="bg-blue-600 hover:bg-blue-700">
              더 많은 성공 사례 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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
