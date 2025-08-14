"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Loader2, Eye, AlertCircle } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import type { CompanyData } from "@/lib/file-db"

export default function CompanyAdmin() {
  const [data, setData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  /* -------------------------------------------------------------- */
  /* Load                                                            */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    ;(async () => {
      try {
        console.log("🔄 Loading company data...")
        const res = await fetch("/api/admin/company", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })
        const json = await res.json()
        console.log("📥 Company data response:", json)

        if (json.success) {
          setData(json.companyInfo)
          console.log("✅ Company data loaded successfully")
        } else {
          console.error("❌ Failed to load company data:", json.error)
          toast({ title: "오류", description: json.error, variant: "destructive" })
        }
      } catch (error: any) {
        console.error("❌ Network error loading company data:", error)
        toast({ title: "네트워크 오류", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* -------------------------------------------------------------- */
  /* Save                                                            */
  /* -------------------------------------------------------------- */
  async function handleSave() {
    if (!data) return
    setSaving(true)
    try {
      console.log("💾 Saving company data:", data)
      const res = await fetch("/api/admin/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      console.log("📤 Save response:", json)

      if (json.success) {
        toast({ title: "저장 완료", description: "회사 정보가 성공적으로 저장되었습니다." })
      } else {
        toast({ title: "저장 실패", description: json.error, variant: "destructive" })
      }
    } catch (error: any) {
      console.error("❌ Save error:", error)
      toast({ title: "네트워크 오류", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  function set<K extends keyof CompanyData>(key: K, value: CompanyData[K]) {
    setData((d) => (d ? { ...d, [key]: value } : d))
  }

  /* -------------------------------------------------------------- */
  /* Enhanced Image Preview Component                                */
  /* -------------------------------------------------------------- */
  function ImagePreview({ url, alt, fieldName }: { url?: string; alt: string; fieldName: string }) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    if (!url || url.trim() === "") {
      return (
        <div className="mt-2 p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-center text-gray-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">이미지 URL을 입력하세요</span>
          </div>
        </div>
      )
    }

    return (
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">미리보기</span>
          {imageLoaded && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ 로드됨</span>}
          {imageError && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">✗ 로드 실패</span>}
        </div>

        <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
          <SafeImage
            src={url}
            alt={alt}
            className="w-full h-full object-cover"
            onLoad={() => {
              setImageLoaded(true)
              setImageError(false)
            }}
            onError={() => {
              setImageLoaded(false)
              setImageError(true)
            }}
          />
        </div>

        <div className="mt-2 text-xs text-gray-500 break-all">
          <strong>URL:</strong> {url}
        </div>

        {imageError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            <AlertCircle className="h-3 w-3 inline mr-1" />
            이미지를 불러올 수 없습니다. URL을 확인해주세요.
          </div>
        )}
      </div>
    )
  }

  /* -------------------------------------------------------------- */
  /* Render                                                          */
  /* -------------------------------------------------------------- */
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        로딩 중...
      </div>
    )

  if (!data)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="mb-4 text-lg">데이터를 불러오지 못했습니다.</p>
        <Link href="/admin/debug" className="text-blue-600 underline">
          GitHub 연결 상태 확인
        </Link>
      </div>
    )

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">회사 정보 관리</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          저장
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="home">홈페이지</TabsTrigger>
          <TabsTrigger value="about">회사소개</TabsTrigger>
          <TabsTrigger value="services">서비스</TabsTrigger>
          <TabsTrigger value="realestate">부동산</TabsTrigger>
          <TabsTrigger value="contact">문의하기</TabsTrigger>
        </TabsList>

        {/* 기본 정보 ------------------------------------------------ */}
        <TabsContent value="basic" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>회사 개요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>회사명</Label>
                <Input value={data.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>한 줄 소개</Label>
                <Textarea rows={3} value={data.description} onChange={(e) => set("description", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>연락처</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>전화번호</Label>
                <Input value={data.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <Input value={data.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>주소</Label>
                <Input value={data.address} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>웹사이트</Label>
                <Input value={data.website} onChange={(e) => set("website", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>로고</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>로고 URL</Label>
                <Input
                  value={data.logoUrl || ""}
                  placeholder="https://example.com/logo.png"
                  onChange={(e) => set("logoUrl", e.target.value)}
                />
                <ImagePreview url={data.logoUrl} alt="로고" fieldName="logoUrl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 홈페이지 이미지 ------------------------------------------ */}
        <TabsContent value="home" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>홈페이지 이미지</CardTitle>
              <p className="text-sm text-gray-600">홈페이지 Hero Section에 표시되는 이미지입니다.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>메인 히어로 이미지 (홈페이지 우측 상단)</Label>
                <Input
                  value={data.heroImageUrl || ""}
                  placeholder="https://example.com/hero.jpg"
                  onChange={(e) => set("heroImageUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">홈페이지 메인 섹션 우측에 표시되는 이미지</p>
                <ImagePreview url={data.heroImageUrl} alt="메인 히어로 이미지" fieldName="heroImageUrl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 회사소개 이미지 ------------------------------------------ */}
        <TabsContent value="about" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>회사소개 페이지 이미지</CardTitle>
              <p className="text-sm text-gray-600">회사소개 페이지(/about)에 표시되는 이미지들입니다.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>회사소개 히어로 이미지 (페이지 상단)</Label>
                <Input
                  value={data.aboutImageUrl || ""}
                  placeholder="https://example.com/about-hero.jpg"
                  onChange={(e) => set("aboutImageUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">회사소개 페이지 상단 Hero Section 배경 이미지</p>
                <ImagePreview url={data.aboutImageUrl} alt="회사소개 히어로" fieldName="aboutImageUrl" />
              </div>
              <div className="space-y-2">
                <Label>팀 사진 (우리의 가치 섹션)</Label>
                <Input
                  value={data.teamPhotoUrl || ""}
                  placeholder="https://example.com/team.jpg"
                  onChange={(e) => set("teamPhotoUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">회사소개 페이지 중간 "우리의 가치" 섹션에 표시되는 팀 사진</p>
                <ImagePreview url={data.teamPhotoUrl} alt="팀 사진" fieldName="teamPhotoUrl" />
              </div>
              <div className="space-y-2">
                <Label>사무실 내부 (전문적인 업무환경 섹션)</Label>
                <Input
                  value={data.officeInteriorUrl || ""}
                  placeholder="https://example.com/office.jpg"
                  onChange={(e) => set("officeInteriorUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  회사소개 페이지 하단 "전문적인 업무환경" 섹션에 표시되는 사무실 사진
                </p>
                <ImagePreview url={data.officeInteriorUrl} alt="사무실 내부" fieldName="officeInteriorUrl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 서비스 이미지 -------------------------------------------- */}
        <TabsContent value="services" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>서비스 페이지 이미지</CardTitle>
              <p className="text-sm text-gray-600">서비스 페이지(/services)에 표시되는 이미지들입니다.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>서비스 히어로 이미지 (페이지 상단)</Label>
                <Input
                  value={data.servicesHeroUrl || ""}
                  placeholder="https://example.com/services-hero.jpg"
                  onChange={(e) => set("servicesHeroUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">서비스 페이지 상단 Hero Section 배경 이미지</p>
                <ImagePreview url={data.servicesHeroUrl} alt="서비스 히어로" fieldName="servicesHeroUrl" />
              </div>
              <div className="space-y-2">
                <Label>서비스 쇼케이스 이미지 (주요 서비스 섹션)</Label>
                <Input
                  value={data.serviceShowcaseUrl || ""}
                  placeholder="https://example.com/service-showcase.jpg"
                  onChange={(e) => set("serviceShowcaseUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">서비스 페이지 "주요 서비스" 섹션에 표시되는 이미지</p>
                <ImagePreview url={data.serviceShowcaseUrl} alt="서비스 쇼케이스" fieldName="serviceShowcaseUrl" />
              </div>
              <div className="space-y-2">
                <Label>건물 관리 서비스 이미지 (서비스 카드)</Label>
                <Input
                  value={data.buildingManagementUrl || ""}
                  placeholder="https://example.com/building-management.jpg"
                  onChange={(e) => set("buildingManagementUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">건물 관리 서비스 카드에 표시되는 이미지</p>
                <ImagePreview url={data.buildingManagementUrl} alt="건물 관리" fieldName="buildingManagementUrl" />
              </div>
              <div className="space-y-2">
                <Label>청소 서비스 이미지 (서비스 카드)</Label>
                <Input
                  value={data.cleaningServiceUrl || ""}
                  placeholder="https://example.com/cleaning.jpg"
                  onChange={(e) => set("cleaningServiceUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">청소 서비스 카드에 표시되는 이미지</p>
                <ImagePreview url={data.cleaningServiceUrl} alt="청소 서비스" fieldName="cleaningServiceUrl" />
              </div>
              <div className="space-y-2">
                <Label>소방 안전 관리 이미지 (서비스 카드)</Label>
                <Input
                  value={data.fireInspectionUrl || ""}
                  placeholder="https://example.com/fire-safety.jpg"
                  onChange={(e) => set("fireInspectionUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">소방 안전 관리 서비스 카드에 표시되는 이미지</p>
                <ImagePreview url={data.fireInspectionUrl} alt="소방 안전" fieldName="fireInspectionUrl" />
              </div>
              <div className="space-y-2">
                <Label>엘리베이터 관리 이미지 (서비스 카드)</Label>
                <Input
                  value={data.elevatorManagementUrl || ""}
                  placeholder="https://example.com/elevator.jpg"
                  onChange={(e) => set("elevatorManagementUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">엘리베이터 관리 서비스 카드에 표시되는 이미지</p>
                <ImagePreview
                  url={data.elevatorManagementUrl}
                  alt="엘리베이터 관리"
                  fieldName="elevatorManagementUrl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 부동산 이미지 -------------------------------------------- */}
        <TabsContent value="realestate" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>부동산 페이지 이미지</CardTitle>
              <p className="text-sm text-gray-600">부동산 페이지(/real-estate)에 표시되는 이미지입니다.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>부동산 히어로 이미지 (페이지 상단)</Label>
                <Input
                  value={data.realEstateHeroUrl || ""}
                  placeholder="https://example.com/realestate-hero.jpg"
                  onChange={(e) => set("realEstateHeroUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">부동산 페이지 상단 Hero Section 배경 이미지</p>
                <ImagePreview url={data.realEstateHeroUrl} alt="부동산 히어로" fieldName="realEstateHeroUrl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 문의하기 이미지 ------------------------------------------ */}
        <TabsContent value="contact" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>문의하기 페이지 이미지</CardTitle>
              <p className="text-sm text-gray-600">문의하기 페이지(/contact)에 표시되는 이미지들입니다.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>문의하기 히어로 이미지 (페이지 상단)</Label>
                <Input
                  value={data.contactHeroUrl || ""}
                  placeholder="https://example.com/contact-hero.jpg"
                  onChange={(e) => set("contactHeroUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">문의하기 페이지 상단 Hero Section 배경 이미지</p>
                <ImagePreview url={data.contactHeroUrl} alt="문의하기 히어로" fieldName="contactHeroUrl" />
              </div>
              <div className="space-y-2">
                <Label>회사 건물 이미지 (연락처 정보 섹션)</Label>
                <Input
                  value={data.companyBuildingUrl || ""}
                  placeholder="https://example.com/company-building.jpg"
                  onChange={(e) => set("companyBuildingUrl", e.target.value)}
                />
                <p className="text-xs text-gray-500">문의하기 페이지 연락처 정보 섹션에 표시되는 회사 건물 사진</p>
                <ImagePreview url={data.companyBuildingUrl} alt="회사 건물" fieldName="companyBuildingUrl" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
