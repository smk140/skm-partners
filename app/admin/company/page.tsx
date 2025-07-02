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
import { Loader2, Eye } from "lucide-react"
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
        const res = await fetch("/api/admin/company")
        const json = await res.json()
        if (json.success) setData(json.companyInfo)
        else toast({ title: "오류", description: json.error, variant: "destructive" })
      } catch {
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
      const res = await fetch("/api/admin/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) toast({ title: "저장 완료" })
      else toast({ title: "저장 실패", description: json.error, variant: "destructive" })
    } catch {
      toast({ title: "네트워크 오류", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  function set<K extends keyof CompanyData>(key: K, value: CompanyData[K]) {
    setData((d) => (d ? { ...d, [key]: value } : d))
  }

  /* -------------------------------------------------------------- */
  /* Image Preview Component                                         */
  /* -------------------------------------------------------------- */
  function ImagePreview({ url, alt }: { url?: string; alt: string }) {
    if (!url) return null
    return (
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">미리보기</span>
        </div>
        <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-gray-50">
          <SafeImage src={url} alt={alt} className="w-full h-full object-cover" fallbackText={alt} />
        </div>
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
        <p className="mb-4">데이터를 불러오지 못했습니다.</p>
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
                <ImagePreview url={data.logoUrl} alt="로고" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 홈페이지 이미지 ------------------------------------------ */}
        <TabsContent value="home" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>홈페이지 이미지</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>메인 히어로 이미지</Label>
                <Input
                  value={data.heroImageUrl || ""}
                  placeholder="https://example.com/hero.jpg"
                  onChange={(e) => set("heroImageUrl", e.target.value)}
                />
                <ImagePreview url={data.heroImageUrl} alt="메인 히어로 이미지" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 회사소개 이미지 ------------------------------------------ */}
        <TabsContent value="about" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>회사소개 페이지 이미지</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>회사소개 히어로 이미지</Label>
                <Input
                  value={data.aboutImageUrl || ""}
                  placeholder="https://example.com/about-hero.jpg"
                  onChange={(e) => set("aboutImageUrl", e.target.value)}
                />
                <ImagePreview url={data.aboutImageUrl} alt="회사소개 히어로" />
              </div>
              <div className="space-y-2">
                <Label>팀 사진</Label>
                <Input
                  value={data.teamPhotoUrl || ""}
                  placeholder="https://example.com/team.jpg"
                  onChange={(e) => set("teamPhotoUrl", e.target.value)}
                />
                <ImagePreview url={data.teamPhotoUrl} alt="팀 사진" />
              </div>
              <div className="space-y-2">
                <Label>사무실 내부</Label>
                <Input
                  value={data.officeInteriorUrl || ""}
                  placeholder="https://example.com/office.jpg"
                  onChange={(e) => set("officeInteriorUrl", e.target.value)}
                />
                <ImagePreview url={data.officeInteriorUrl} alt="사무실 내부" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 서비스 이미지 -------------------------------------------- */}
        <TabsContent value="services" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>서비스 페이지 이미지</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>서비스 히어로 이미지</Label>
                <Input
                  value={data.servicesHeroUrl || ""}
                  placeholder="https://example.com/services-hero.jpg"
                  onChange={(e) => set("servicesHeroUrl", e.target.value)}
                />
                <ImagePreview url={data.servicesHeroUrl} alt="서비스 히어로" />
              </div>
              <div className="space-y-2">
                <Label>서비스 쇼케이스 이미지</Label>
                <Input
                  value={data.serviceShowcaseUrl || ""}
                  placeholder="https://example.com/service-showcase.jpg"
                  onChange={(e) => set("serviceShowcaseUrl", e.target.value)}
                />
                <ImagePreview url={data.serviceShowcaseUrl} alt="서비스 쇼케이스" />
              </div>
              <div className="space-y-2">
                <Label>건물 관리 서비스 이미지</Label>
                <Input
                  value={data.buildingManagementUrl || ""}
                  placeholder="https://example.com/building-management.jpg"
                  onChange={(e) => set("buildingManagementUrl", e.target.value)}
                />
                <ImagePreview url={data.buildingManagementUrl} alt="건물 관리" />
              </div>
              <div className="space-y-2">
                <Label>청소 서비스 이미지</Label>
                <Input
                  value={data.cleaningServiceUrl || ""}
                  placeholder="https://example.com/cleaning.jpg"
                  onChange={(e) => set("cleaningServiceUrl", e.target.value)}
                />
                <ImagePreview url={data.cleaningServiceUrl} alt="청소 서비스" />
              </div>
              <div className="space-y-2">
                <Label>소방 안전 관리 이미지</Label>
                <Input
                  value={data.fireInspectionUrl || ""}
                  placeholder="https://example.com/fire-safety.jpg"
                  onChange={(e) => set("fireInspectionUrl", e.target.value)}
                />
                <ImagePreview url={data.fireInspectionUrl} alt="소방 안전" />
              </div>
              <div className="space-y-2">
                <Label>엘리베이터 관리 이미지</Label>
                <Input
                  value={data.elevatorManagementUrl || ""}
                  placeholder="https://example.com/elevator.jpg"
                  onChange={(e) => set("elevatorManagementUrl", e.target.value)}
                />
                <ImagePreview url={data.elevatorManagementUrl} alt="엘리베이터 관리" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 부동산 이미지 -------------------------------------------- */}
        <TabsContent value="realestate" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>부동산 페이지 이미지</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>부동산 히어로 이미지</Label>
                <Input
                  value={data.realEstateHeroUrl || ""}
                  placeholder="https://example.com/realestate-hero.jpg"
                  onChange={(e) => set("realEstateHeroUrl", e.target.value)}
                />
                <ImagePreview url={data.realEstateHeroUrl} alt="부동산 히어로" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 문의하기 이미지 ------------------------------------------ */}
        <TabsContent value="contact" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>문의하기 페이지 이미지</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>문의하기 히어로 이미지</Label>
                <Input
                  value={data.contactHeroUrl || ""}
                  placeholder="https://example.com/contact-hero.jpg"
                  onChange={(e) => set("contactHeroUrl", e.target.value)}
                />
                <ImagePreview url={data.contactHeroUrl} alt="문의하기 히어로" />
              </div>
              <div className="space-y-2">
                <Label>회사 건물 이미지</Label>
                <Input
                  value={data.companyBuildingUrl || ""}
                  placeholder="https://example.com/company-building.jpg"
                  onChange={(e) => set("companyBuildingUrl", e.target.value)}
                />
                <ImagePreview url={data.companyBuildingUrl} alt="회사 건물" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
