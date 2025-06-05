"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  MapPin,
  Building,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RefreshCw,
  Search,
  X,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

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

export default function RealEstateBrowsePage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    loadProperties()
    const interval = setInterval(loadProperties, 30000)
    return () => clearInterval(interval)
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
        setProperties(data.properties)
        setFilteredProperties(data.properties)
        setLastUpdated(new Date().toLocaleTimeString())
        console.log("✅ 매물 데이터 설정 완료:", data.properties.length, "개")
      } else {
        setProperties([])
        setFilteredProperties([])
        setError("매물 데이터 형식이 올바르지 않습니다.")
      }
    } catch (err) {
      console.error("💥 매물 로드 실패:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      setProperties([])
      setFilteredProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) {
      setFilteredProperties(properties)
    } else {
      const filtered = properties.filter(
        (property) =>
          property.title?.toLowerCase().includes(query.toLowerCase()) ||
          property.location?.toLowerCase().includes(query.toLowerCase()) ||
          property.type?.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredProperties(filtered)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handlePropertyClick = (propertyId: number) => {
    router.push(`/real-estate/${propertyId}`)
  }

  const displayedProperties = showAll ? filteredProperties : filteredProperties.slice(0, 9)

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                뒤로가기
              </Button>
              <div>
                <h1 className="text-3xl font-bold">부동산 매물 검색</h1>
                <p className="text-gray-600">원하는 조건의 매물을 찾아보세요</p>
              </div>
            </div>

            {/* 검색 바 */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="지역, 건물 유형, 특징으로 검색 (예: 강남 오피스, 역세권 상가)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-10 py-3 text-base"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      handleSearch("")
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button onClick={() => handleSearch()} className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                검색
              </Button>
            </div>

            {/* 인기 검색어 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">인기 검색어</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white"
                  onClick={() => {
                    setSearchQuery("강남 오피스")
                    handleSearch("강남 오피스")
                  }}
                >
                  강남 오피스
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white"
                  onClick={() => {
                    setSearchQuery("신축 상가")
                    handleSearch("신축 상가")
                  }}
                >
                  신축 상가
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white"
                  onClick={() => {
                    setSearchQuery("수익형 부동산")
                    handleSearch("수익형 부동산")
                  }}
                >
                  수익형 부동산
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white"
                  onClick={() => {
                    setSearchQuery("역세권")
                    handleSearch("역세권")
                  }}
                >
                  역세권
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 매물 목록 */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">매물 목록</h2>
                <p className="text-gray-600">
                  총 {filteredProperties.length}개의 매물이 있습니다
                  {searchQuery && ` (검색: "${searchQuery}")`}
                  {lastUpdated && <span className="text-sm text-gray-500 ml-2">(마지막 업데이트: {lastUpdated})</span>}
                </p>
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
                {filteredProperties.length > 9 && (
                  <Button variant="outline" onClick={() => setShowAll(!showAll)} className="flex items-center gap-2">
                    {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {showAll ? "접기" : `더보기 (${filteredProperties.length - 9}개 더)`}
                  </Button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">매물 정보를 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 p-6 rounded-lg">
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-red-700 mb-2">오류 발생</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadProperties} className="bg-red-600 hover:bg-red-700">
                  다시 시도
                </Button>
              </div>
            ) : displayedProperties.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchQuery ? "검색 결과가 없습니다" : "등록된 매물이 없습니다"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery ? "다른 검색어로 시도해보세요." : "관리자 페이지에서 매물을 추가해주세요!"}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      handleSearch("")
                    }}
                  >
                    전체 매물 보기
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48 bg-gray-200">
                      {property.image_url ? (
                        <img
                          src={property.image_url || "/placeholder.svg"}
                          alt={property.title || "부동산 매물"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = "flex"
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-gray-200 flex items-center justify-center"
                        style={{ display: property.image_url ? "none" : "flex" }}
                      >
                        <Building className="h-12 w-12 text-gray-400" />
                      </div>
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
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate" title={property.location}>
                            {property.location}
                          </span>
                        </div>
                      )}
                      <div className="space-y-1 mb-4 text-sm">
                        {property.size && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">면적:</span>
                            <span className="font-medium">{property.size}</span>
                          </div>
                        )}
                        {property.price && (
                          <div className="flex justify-between">
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
                      <Button
                        variant="outline"
                        className="w-full group"
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        상세보기
                        <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredProperties.length > 9 && !showAll && !isLoading && !error && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setShowAll(true)}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <ChevronDown className="h-4 w-4" />
                  {filteredProperties.length - 9}개 매물 더보기
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
