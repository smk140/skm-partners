"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUrlInput } from "@/components/image-url-input"
import { useToast } from "@/hooks/use-toast"
import { Building2, Save } from "lucide-react"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
  website: string
  logoUrl?: string
  heroImageUrl?: string
  aboutImageUrl?: string
  servicesHeroUrl?: string
  realEstateHeroUrl?: string
  contactHeroUrl?: string
  buildingManagementUrl?: string
  cleaningServiceUrl?: string
  fireInspectionUrl?: string
  elevatorManagementUrl?: string
  teamPhotoUrl?: string
  officeInteriorUrl?: string
  serviceShowcaseUrl?: string
}

export default function CompanyManagementPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // 회사 정보 로드
  useEffect(() => {
    loadCompanyInfo()
  }, [])

  const loadCompanyInfo = async () => {
    setIsLoading(true)
    try {
      console.log("회사 정보 로드 시작")
      const response = await fetch("/api/admin/company")
      const data = await response.json()

      console.log("받은 회사 정보:", data)

      if (data.success && data.companyInfo) {
        setCompanyInfo(data.companyInfo)
        console.log("회사 정보 설정 완료")
      }
    } catch (error) {
      console.error("회사 정보 로드 실패:", error)
      toast({
        title: "로드 실패",
        description: "회사 정보를 불러올 수 없습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log("회사 정보 저장 시작:", companyInfo)

      const response = await fetch("/api/admin/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyInfo),
      })

      const result = await response.json()
      console.log("저장 결과:", result)

      if (result.success) {
        toast({
          title: "저장 완료",
          description: "회사 정보가 성공적으로 저장되었습니다.",
        })
        console.log("회사 정보 저장 성공")
      } else {
        throw new Error(result.error || "저장 실패")
      }
    } catch (error: any) {
      console.error("회사 정보 저장 실패:", error)
      toast({
        title: "저장 실패",
        description: error.message || "회사 정보를 저장할 수 없습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">회사 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">회사 정보 관리</h1>
              <p className="text-gray-600">웹사이트에 표시될 회사 정보를 관리합니다.</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">기본 정보</TabsTrigger>
            <TabsTrigger value="main-images">메인 이미지</TabsTrigger>
            <TabsTrigger value="page-images">페이지 이미지</TabsTrigger>
            <TabsTrigger value="service-images">서비스 이미지</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>기본 회사 정보</CardTitle>
                <CardDescription>웹사이트에 표시될 기본적인 회사 정보를 입력하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">회사명</Label>
                    <Input
                      id="name"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="회사명을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="전화번호를 입력하세요"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="이메일을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">웹사이트</Label>
                    <Input
                      id="website"
                      type="url"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="웹사이트 URL을 입력하세요"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="주소를 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">회사 소개</Label>
                  <Textarea
                    id="description"
                    value={companyInfo.description}
                    onChange={(e) => setCompanyInfo((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="회사 소개를 입력하세요"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="main-images" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ImageUrlInput
                label="로고 이미지"
                value={companyInfo.logoUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, logoUrl: url }))}
                description="회사 로고 이미지 URL을 입력하세요. (권장 크기: 200x80px)"
              />

              <ImageUrlInput
                label="메인 히어로 이미지"
                value={companyInfo.heroImageUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, heroImageUrl: url }))}
                description="홈페이지 메인 배너 이미지 URL을 입력하세요. (권장 크기: 1200x600px)"
              />

              <ImageUrlInput
                label="회사 소개 이미지"
                value={companyInfo.aboutImageUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, aboutImageUrl: url }))}
                description="회사 소개 페이지 이미지 URL을 입력하세요. (권장 크기: 800x500px)"
              />

              <ImageUrlInput
                label="팀 사진"
                value={companyInfo.teamPhotoUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, teamPhotoUrl: url }))}
                description="팀 소개 사진 URL을 입력하세요. (권장 크기: 800x500px)"
              />
            </div>
          </TabsContent>

          <TabsContent value="page-images" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ImageUrlInput
                label="서비스 페이지 히어로 이미지"
                value={companyInfo.servicesHeroUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, servicesHeroUrl: url }))}
                description="서비스 페이지 상단 배너 이미지 URL을 입력하세요. (권장 크기: 1200x400px)"
              />

              <ImageUrlInput
                label="부동산 페이지 히어로 이미지"
                value={companyInfo.realEstateHeroUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, realEstateHeroUrl: url }))}
                description="부동산 페이지 상단 배너 이미지 URL을 입력하세요. (권장 크기: 1200x400px)"
              />

              <ImageUrlInput
                label="연락처 페이지 히어로 이미지"
                value={companyInfo.contactHeroUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, contactHeroUrl: url }))}
                description="연락처 페이지 상단 배너 이미지 URL을 입력하세요. (권장 크기: 1200x400px)"
              />

              <ImageUrlInput
                label="오피스 인테리어 이미지"
                value={companyInfo.officeInteriorUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, officeInteriorUrl: url }))}
                description="오피스 인테리어 이미지 URL을 입력하세요. (권장 크기: 600x400px)"
              />

              <ImageUrlInput
                label="서비스 쇼케이스 이미지"
                value={companyInfo.serviceShowcaseUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, serviceShowcaseUrl: url }))}
                description="서비스 쇼케이스 이미지 URL을 입력하세요. (권장 크기: 800x500px)"
              />
            </div>
          </TabsContent>

          <TabsContent value="service-images" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ImageUrlInput
                label="빌딩 관리 서비스 이미지"
                value={companyInfo.buildingManagementUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, buildingManagementUrl: url }))}
                description="빌딩 관리 서비스 이미지 URL을 입력하세요. (권장 크기: 600x400px)"
              />

              <ImageUrlInput
                label="청소 서비스 이미지"
                value={companyInfo.cleaningServiceUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, cleaningServiceUrl: url }))}
                description="청소 서비스 이미지 URL을 입력하세요. (권장 크기: 600x400px)"
              />

              <ImageUrlInput
                label="소방 점검 서비스 이미지"
                value={companyInfo.fireInspectionUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, fireInspectionUrl: url }))}
                description="소방 점검 서비스 이미지 URL을 입력하세요. (권장 크기: 600x400px)"
              />

              <ImageUrlInput
                label="엘리베이터 관리 서비스 이미지"
                value={companyInfo.elevatorManagementUrl || ""}
                onChange={(url) => setCompanyInfo((prev) => ({ ...prev, elevatorManagementUrl: url }))}
                description="엘리베이터 관리 서비스 이미지 URL을 입력하세요. (권장 크기: 600x400px)"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
