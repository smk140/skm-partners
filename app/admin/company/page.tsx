"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Phone, Mail, Globe, MapPin, Save, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CompanyData {
  name: string
  description: string
  address: string
  phone: string
  email: string
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    setLoading(true)
    try {
      console.log("🔄 관리자 페이지에서 회사 정보 로드 시작")
      const response = await fetch("/api/admin/company")
      const data = await response.json()

      console.log("📥 관리자 페이지 응답:", data)

      if (data.success && data.companyInfo) {
        setCompanyData(data.companyInfo)
        console.log("✅ 관리자 페이지 데이터 설정 완료")
      } else {
        console.error("❌ 관리자 페이지 데이터 로드 실패:", data.error)
        setMessage({ type: "error", text: data.error || "데이터 로드 실패" })
      }
    } catch (error) {
      console.error("💥 관리자 페이지 로드 오류:", error)
      setMessage({ type: "error", text: "서버 연결 실패" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      console.log("💾 관리자 페이지에서 저장 시작:", companyData)

      const response = await fetch("/api/admin/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      })

      const result = await response.json()
      console.log("📤 관리자 페이지 저장 응답:", result)

      if (result.success) {
        setMessage({ type: "success", text: "회사 정보가 성공적으로 저장되었습니다!" })
        console.log("✅ 관리자 페이지 저장 성공")
      } else {
        setMessage({ type: "error", text: result.error || "저장 실패" })
        console.error("❌ 관리자 페이지 저장 실패:", result.error)
      }
    } catch (error) {
      console.error("💥 관리자 페이지 저장 오류:", error)
      setMessage({ type: "error", text: "서버 연결 실패" })
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회사 정보 관리</h1>
          <p className="text-gray-600">회사의 기본 정보와 연락처를 관리합니다.</p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === "success" ? "border-green-500" : "border-red-500"}`}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">기본 정보</TabsTrigger>
            <TabsTrigger value="contact">연락처 정보</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  기본 정보
                </CardTitle>
                <CardDescription>회사의 기본적인 정보를 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">회사명</Label>
                  <Input
                    id="name"
                    value={companyData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="회사명을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">회사 소개</Label>
                  <Textarea
                    id="description"
                    value={companyData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="회사 소개를 입력하세요"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                      <Globe className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="website"
                      value={companyData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://example.com"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  연락처 정보
                </CardTitle>
                <CardDescription>고객이 연락할 수 있는 정보를 설정합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">대표 전화번호</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="phone"
                      value={companyData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="02-1234-5678"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">대표 이메일</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                      <Mail className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={companyData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="info@company.com"
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">회사 주소</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                      <MapPin className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="address"
                      value={companyData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="서울특별시 강남구..."
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} disabled={saving} size="lg" className="px-8">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                저장하기
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
