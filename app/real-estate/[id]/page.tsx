"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Building,
  Phone,
  Mail,
  User,
  CheckCircle,
  Share2,
  Heart,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
  features?: string[]
  contact?: {
    manager: string
    phone: string
    email: string
  }
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      loadProperty(params.id as string)
    }
  }, [params.id])

  const loadProperty = async (id: string) => {
    console.log("매물 상세 정보 로드:", id)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      console.log("API 응답 상태:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP 오류: ${response.status}` }))
        throw new Error(errorData.error || `HTTP 오류: ${response.status}`)
      }

      const data = await response.json()
      console.log("받은 매물 데이터:", data)

      if (data.success && data.property) {
        setProperty(data.property)
        console.log("매물 정보 설정 완료:", data.property.title)
      } else {
        throw new Error(data.error || "매물 정보를 불러올 수 없습니다.")
      }
    } catch (err) {
      console.error("매물 로드 실패:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleContact = () => {
    // 상담 신청 로직
    alert("상담 신청이 접수되었습니다. 곧 연락드리겠습니다.")
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">매물 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-red-50 p-6 rounded-lg max-w-2xl mx-auto">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-red-700 mb-2">오류 발생</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <Button onClick={handleBack} variant="outline">
                뒤로 가기
              </Button>
              <Button onClick={() => loadProperty(params.id as string)} className="bg-red-600 hover:bg-red-700">
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!property) {
    return (
      <main className="flex min-h-screen flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">매물을 찾을 수 없습니다</h3>
            <p className="text-gray-500 mb-4">요청하신 매물이 존재하지 않거나 삭제되었습니다.</p>
            <Button onClick={handleBack} variant="outline">
              뒤로 가기
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              뒤로 가기
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                찜하기
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                공유하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 이미지 섹션 */}
              <Card className="overflow-hidden">
                <div className="relative h-[400px] bg-gray-200">
                  {property.image_url ? (
                    <img
                      src={property.image_url || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log("상세 이미지 로드 성공")}
                      onError={(e) => {
                        console.error("상세 이미지 로드 실패")
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
                    <Building className="h-24 w-24 text-gray-400" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant={property.status === "활성" ? "default" : "secondary"}
                      className={property.status === "활성" ? "bg-green-600 text-white" : ""}
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
              </Card>

              {/* 기본 정보 */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                      <div className="flex items-center text-gray-500 mb-4">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span className="text-lg">{property.location}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 py-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">면적</span>
                        <span className="font-semibold">{property.size || "문의"}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">가격</span>
                        <span className="font-semibold text-blue-600">{property.price || "문의"}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">유형</span>
                        <span className="font-semibold">{property.type}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">등록일</span>
                        <span className="font-semibold">{new Date(property.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-semibold mb-3">상세 설명</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {property.description || "상세 설명이 없습니다."}
                      </p>
                    </div>

                    {property.features && property.features.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-xl font-semibold mb-3">편의시설</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {property.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 연락처 정보 */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">문의하기</h3>

                  {property.contact && (
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">담당자</p>
                          <p className="font-medium">{property.contact.manager}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">전화번호</p>
                          <p className="font-medium">{property.contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">이메일</p>
                          <p className="font-medium">{property.contact.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button onClick={handleContact} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Phone className="h-4 w-4 mr-2" />
                      상담 신청
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      이메일 문의
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">💡 상담 안내</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 평일 09:00 - 18:00</li>
                      <li>• 토요일 09:00 - 15:00</li>
                      <li>• 일요일 및 공휴일 휴무</li>
                      <li>• 긴급상황 시 24시간 대응</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 관련 매물 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">관련 매물</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium text-sm">서초 신축 오피스</h4>
                      <p className="text-xs text-gray-500">서울시 서초구</p>
                      <p className="text-sm text-blue-600 font-medium">월 400만원</p>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-medium text-sm">역삼동 상가</h4>
                      <p className="text-xs text-gray-500">서울시 강남구</p>
                      <p className="text-sm text-blue-600 font-medium">월 300만원</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
