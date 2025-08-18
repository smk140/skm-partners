"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { ImageSelector } from "@/components/image-selector"
import { AuthCheck } from "@/components/admin/auth-check"

interface CompanyData {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  logoUrl?: string
  heroImageUrl?: string
  aboutHeroUrl?: string
  servicesHeroUrl?: string
  contactHeroUrl?: string
  teamImageUrl?: string
  officeImageUrl?: string
  companyBuildingUrl?: string
  serviceShowcaseUrl?: string
}

export default function CompanyManagementPage() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      console.log("🔄 Fetching company data...")
      const response = await fetch("/api/company", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const data = await response.json()
      console.log("📥 Company data response:", data)

      if (data.success && data.company) {
        setCompanyData(data.company)
        console.log("✅ Company data loaded:", data.company)
      } else {
        console.error("❌ Failed to fetch company data:", data.error)
        toast({
          title: "데이터 로드 실패",
          description: data.error || "회사 정보를 불러올 수 없습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Network error:", error)
      toast({
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("💾 Saving company data:", companyData)
      const response = await fetch("/api/admin/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      })

      const result = await response.json()
      console.log("📤 Save response:", result)

      if (result.success) {
        toast({
          title: "저장 완료",
          description: "회사 정보가 성공적으로 저장되었습니다.",
        })
      } else {
        toast({
          title: "저장 실패",
          description: result.error || "저장 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Save error:", error)
      toast({
        title: "저장 실패",
        description: "네트워크 오류가 발생했습니다.",
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
      <AuthCheck>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </AuthCheck>
    )
  }

  return (
    <AuthCheck>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">회사 정보 관리</h1>
          <p className="text-gray-600 mt-2">웹사이트에 표시될 회사 정보를 관리합니다.</p>
        </div>

        <div className="grid gap-8">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>회사의 기본적인 정보를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
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
                  <Label htmlFor="website">웹사이트</Label>
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

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="02-853-7715"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="bykim@skm.kr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={companyData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="서울시 관악구 조원로6길 47, 에스케이엠 1층"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 이미지 관리 */}
          <Card>
            <CardHeader>
              <CardTitle>이미지 관리</CardTitle>
              <CardDescription>웹사이트에 표시될 이미지들을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 로고 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">로고</h3>
                <ImageSelector
                  currentImageUrl={companyData.logoUrl}
                  onImageSelect={(url) => handleInputChange("logoUrl", url)}
                  label="회사 로고"
                />
              </div>

              <Separator />

              {/* 메인 페이지 이미지 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">메인 페이지</h3>
                <ImageSelector
                  currentImageUrl={companyData.heroImageUrl}
                  onImageSelect={(url) => handleInputChange("heroImageUrl", url)}
                  label="메인 히어로 이미지"
                />
              </div>

              <Separator />

              {/* 회사소개 페이지 이미지 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">회사소개 페이지</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ImageSelector
                    currentImageUrl={companyData.aboutHeroUrl}
                    onImageSelect={(url) => handleInputChange("aboutHeroUrl", url)}
                    label="회사소개 히어로 이미지"
                  />
                  <ImageSelector
                    currentImageUrl={companyData.teamImageUrl}
                    onImageSelect={(url) => handleInputChange("teamImageUrl", url)}
                    label="팀 이미지"
                  />
                </div>
                <div className="mt-6">
                  <ImageSelector
                    currentImageUrl={companyData.officeImageUrl}
                    onImageSelect={(url) => handleInputChange("officeImageUrl", url)}
                    label="사무실 이미지"
                  />
                </div>
              </div>

              <Separator />

              {/* 서비스 페이지 이미지 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">서비스 페이지</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ImageSelector
                    currentImageUrl={companyData.servicesHeroUrl}
                    onImageSelect={(url) => handleInputChange("servicesHeroUrl", url)}
                    label="서비스 히어로 이미지"
                  />
                  <ImageSelector
                    currentImageUrl={companyData.serviceShowcaseUrl}
                    onImageSelect={(url) => handleInputChange("serviceShowcaseUrl", url)}
                    label="서비스 쇼케이스 이미지"
                  />
                </div>
              </div>

              <Separator />

              {/* 연락처 페이지 이미지 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">연락처 페이지</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ImageSelector
                    currentImageUrl={companyData.contactHeroUrl}
                    onImageSelect={(url) => handleInputChange("contactHeroUrl", url)}
                    label="연락처 히어로 이미지"
                  />
                  <ImageSelector
                    currentImageUrl={companyData.companyBuildingUrl}
                    onImageSelect={(url) => handleInputChange("companyBuildingUrl", url)}
                    label="회사 건물 이미지"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  저장 중...
                </>
              ) : (
                "저장하기"
              )}
            </Button>
          </div>
        </div>

        {/* 디버그 정보 */}
        {process.env.NODE_ENV === "development" && (
          <Card>
            <CardHeader>
              <CardTitle>디버그 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(companyData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthCheck>
  )
}
