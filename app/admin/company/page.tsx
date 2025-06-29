"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Loader2, Save, Building, ImageIcon, Phone, Mail, Globe, MapPin } from "lucide-react"
import type { CompanyData } from "@/lib/file-db"

export default function CompanyManagementPage() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logoUrl: "",
    heroImageUrl: "",
    aboutImageUrl: "",
    servicesHeroUrl: "",
    realEstateHeroUrl: "",
    contactHeroUrl: "",
    buildingManagementUrl: "",
    cleaningServiceUrl: "",
    fireInspectionUrl: "",
    elevatorManagementUrl: "",
    teamPhotoUrl: "",
    officeInteriorUrl: "",
    serviceShowcaseUrl: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 회사 정보 로드
  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/company")
      const result = await response.json()

      if (result.success) {
        setCompanyData(result.companyInfo)
        console.log("✅ 회사 정보 로드 성공:", result.companyInfo)
      } else {
        toast({
          title: "오류",
          description: "회사 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ 회사 정보 로드 실패:", error)
      toast({
        title: "오류",
        description: "서버 연결에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      console.log("💾 회사 정보 저장 시작:", companyData)

      const response = await fetch("/api/admin/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      })

      const result = await response.json()
      console.log("📤 저장 응답:", result)

      if (result.success) {
        toast({
          title: "저장 완료",
          description: "회사 정보가 성공적으로 저장되었습니다.",
        })
        // 저장된 데이터로 상태 업데이트
        if (result.companyInfo) {
          setCompanyData(result.companyInfo)
        }
      } else {
        toast({
          title: "저장 실패",
          description: result.error || "저장 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ 저장 실패:", error)
      toast({
        title: "저장 실패",
        description: "서버 연결에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">회사 정보를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">회사 정보 관리</h1>
          <p className="text-gray-600 mt-2">회사의 기본 정보와 이미지를 관리합니다.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              저장
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            기본 정보
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            이미지 관리
          </TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                회사 기본 정보
              </CardTitle>
              <CardDescription>회사의 기본적인 정보를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">회사명</Label>
                  <Input
                    id="name"
                    value={companyData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="SKM파트너스"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    웹사이트
                  </Label>
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://skm.kr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">회사 소개</Label>
                <Textarea
                  id="description"
                  value={companyData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="전문적인 부동산 컨설팅 서비스를 제공합니다."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>연락처 정보</CardTitle>
              <CardDescription>고객이 연락할 수 있는 정보를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    전화번호
                  </Label>
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="02-1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="info@skm.kr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  주소
                </Label>
                <Input
                  id="address"
                  value={companyData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 123"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 이미지 관리 탭 */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                메인 이미지
              </CardTitle>
              <CardDescription>홈페이지의 주요 이미지들을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">로고 이미지 URL</Label>
                  <Input
                    id="logoUrl"
                    value={companyData.logoUrl || ""}
                    onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroImageUrl">히어로 이미지 URL</Label>
                  <Input
                    id="heroImageUrl"
                    value={companyData.heroImageUrl || ""}
                    onChange={(e) => handleInputChange("heroImageUrl", e.target.value)}
                    placeholder="https://example.com/hero.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutImageUrl">회사 소개 이미지 URL</Label>
                <Input
                  id="aboutImageUrl"
                  value={companyData.aboutImageUrl || ""}
                  onChange={(e) => handleInputChange("aboutImageUrl", e.target.value)}
                  placeholder="https://example.com/about.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>서비스 이미지</CardTitle>
              <CardDescription>각 서비스별 이미지를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingManagementUrl">건물 관리 서비스</Label>
                  <Input
                    id="buildingManagementUrl"
                    value={companyData.buildingManagementUrl || ""}
                    onChange={(e) => handleInputChange("buildingManagementUrl", e.target.value)}
                    placeholder="https://example.com/building.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cleaningServiceUrl">청소 서비스</Label>
                  <Input
                    id="cleaningServiceUrl"
                    value={companyData.cleaningServiceUrl || ""}
                    onChange={(e) => handleInputChange("cleaningServiceUrl", e.target.value)}
                    placeholder="https://example.com/cleaning.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireInspectionUrl">소방 안전 관리</Label>
                  <Input
                    id="fireInspectionUrl"
                    value={companyData.fireInspectionUrl || ""}
                    onChange={(e) => handleInputChange("fireInspectionUrl", e.target.value)}
                    placeholder="https://example.com/fire.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="elevatorManagementUrl">엘리베이터 관리</Label>
                  <Input
                    id="elevatorManagementUrl"
                    value={companyData.elevatorManagementUrl || ""}
                    onChange={(e) => handleInputChange("elevatorManagementUrl", e.target.value)}
                    placeholder="https://example.com/elevator.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>페이지별 히어로 이미지</CardTitle>
              <CardDescription>각 페이지의 상단 히어로 이미지를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servicesHeroUrl">서비스 페이지</Label>
                  <Input
                    id="servicesHeroUrl"
                    value={companyData.servicesHeroUrl || ""}
                    onChange={(e) => handleInputChange("servicesHeroUrl", e.target.value)}
                    placeholder="https://example.com/services-hero.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="realEstateHeroUrl">부동산 페이지</Label>
                  <Input
                    id="realEstateHeroUrl"
                    value={companyData.realEstateHeroUrl || ""}
                    onChange={(e) => handleInputChange("realEstateHeroUrl", e.target.value)}
                    placeholder="https://example.com/realestate-hero.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactHeroUrl">연락처 페이지</Label>
                  <Input
                    id="contactHeroUrl"
                    value={companyData.contactHeroUrl || ""}
                    onChange={(e) => handleInputChange("contactHeroUrl", e.target.value)}
                    placeholder="https://example.com/contact-hero.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
