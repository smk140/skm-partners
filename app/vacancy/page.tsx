"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// SearchBar 컴포넌트 정의
interface SearchBarProps {
  placeholder: string
  onSearch: (query: string, filters: Record<string, any>) => void
}

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSearch = () => {
    onSearch(query, {}) // 검색 쿼리와 필터를 SearchPage로 전달
  }

  return (
    <div className="flex">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="flex-grow rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
      >
        <Search className="mr-2 h-4 w-4 inline-block" />
        검색
      </button>
    </div>
  )
}

export default function VacancyPage() {
  const [priceRange, setPriceRange] = useState([0])
  const [areaRange, setAreaRange] = useState([0])

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="/placeholder.svg?height=300&width=1200"
          alt="Vacancy Management"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">공실 관리</h1>
          <p className="text-lg text-white/90 max-w-xl">SKM파트너스의 공실 관리 서비스로 건물의 가치를 높이세요.</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">공실 검색</h2>

            {/* 새로운 검색 컴포넌트 추가 */}
            <div className="mb-8">
              <SearchBar
                placeholder="지역, 건물명, 특징으로 검색 (예: 강남 테헤란로, 역세권 오피스)"
                onSearch={(query, filters) => {
                  console.log("검색:", query, filters)
                  // 여기에 검색 로직 구현
                }}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">빠른 필터</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-white">
                  서울 전체
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  강남구
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  송파구
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  오피스 전용
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  상가 매물
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  역세권
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  신축
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  리모델링
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">지역</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="location">
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="seoul">서울</SelectItem>
                      <SelectItem value="gyeonggi">경기</SelectItem>
                      <SelectItem value="incheon">인천</SelectItem>
                      <SelectItem value="busan">부산</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="building-type">건물 유형</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="building-type">
                      <SelectValue placeholder="건물 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="office">오피스</SelectItem>
                      <SelectItem value="retail">상가</SelectItem>
                      <SelectItem value="industrial">공장/창고</SelectItem>
                      <SelectItem value="residential">주거용</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>가격대</Label>
                    <span className="text-sm text-slate-500">{priceRange[0]}만원 ~ 무제한</span>
                  </div>
                  <Slider defaultValue={[0]} max={1000} step={50} value={priceRange} onValueChange={setPriceRange} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>면적</Label>
                    <span className="text-sm text-slate-500">{areaRange[0]}평 ~ 무제한</span>
                  </div>
                  <Slider defaultValue={[0]} max={500} step={10} value={areaRange} onValueChange={setAreaRange} />
                </div>
                <div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-2 h-4 w-4" /> 상세 검색
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map & List View */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="list" className="w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">공실 목록</h2>
                <TabsList>
                  <TabsTrigger value="list">목록 보기</TabsTrigger>
                  <TabsTrigger value="map">지도 보기</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="list">
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="relative h-48 w-full">
                        <Image
                          src={`/placeholder.svg?height=200&width=400&text=Property ${item}`}
                          alt={`Property ${item}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">강남 테헤란로 오피스 {item}호</h3>
                          <span className="font-bold text-slate-900">월 580만원</span>
                        </div>
                        <div className="flex items-center text-slate-500 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>서울 강남구 테헤란로 123</span>
                        </div>
                        <div className="flex items-center text-slate-500 text-sm mb-2">
                          <Building className="h-4 w-4 mr-1" />
                          <span>오피스 | 85평 | 3층</span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                          테헤란로 중심부에 위치한 프리미엄 오피스 공간입니다. 지하철역 도보 5분 거리, 편의시설 완비.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Link
                          href={`/vacancy/${item}`}
                          className="text-slate-900 font-medium hover:underline inline-flex items-center"
                        >
                          상세보기 <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="map">
                <div className="bg-white p-4 rounded-lg border h-[600px] w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.4515690893825!2d127.0282918!3d37.4969958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca15a2f9719ab%3A0x20210a76b2b256f7!2z7YWM7Zqp66-86rWtIOuNlOuvuOq1rCDthYzsm5DroZwyNuq4uCAxMDc!5e0!3m2!1sko!2skr!4v1650000000000!5m2!1sko!2skr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">공실 관리 서비스가 필요하신가요?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            SKM파트너스의 전문적인 공실 관리 서비스로 건물의 가치를 높이고 수익을 극대화하세요.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-slate-900 group"
          >
            지금 문의하기
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </main>
  )
}
