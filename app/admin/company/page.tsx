"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CompanyData {
  logo: string
  heroImage: string
  aboutImage: string
  servicesHeroImage: string
  realEstateHeroImage: string
  contactHeroImage: string
  buildingManagementImage: string
  cleaningImage: string
  fireInspectionImage: string
  elevatorImage: string
  teamImage: string
  officeImage: string
  showcaseImage: string
}

const imageFields = [
  { key: "logo", label: "로고", description: "사이트 헤더에 표시되는 로고" },
  { key: "heroImage", label: "메인 히어로 이미지", description: "홈페이지 메인 배너 이미지" },
  { key: "aboutImage", label: "회사 소개 이미지", description: "회사 소개 섹션 이미지" },
  { key: "servicesHeroImage", label: "서비스 페이지 히어로", description: "서비스 페이지 상단 이미지" },
  { key: "realEstateHeroImage", label: "부동산 페이지 히어로", description: "부동산 페이지 상단 이미지" },
  { key: "contactHeroImage", label: "연락처 페이지 히어로", description: "연락처 페이지 상단 이미지" },
  { key: "buildingManagementImage", label: "빌딩관리 서비스", description: "빌딩관리 서비스 이미지" },
  { key: "cleaningImage", label: "청소 서비스", description: "청소 서비스 이미지" },
  { key: "fireInspectionImage", label: "소방점검 서비스", description: "소방점검 서비스 이미지" },
  { key: "elevatorImage", label: "엘리베이터 서비스", description: "엘리베이터 서비스 이미지" },
  { key: "teamImage", label: "팀 사진", description: "회사 팀 사진" },
  { key: "officeImage", label: "오피스 인테리어", description: "사무실 내부 사진" },
  { key: "showcaseImage", label: "서비스 쇼케이스", description: "서비스 소개용 이미지" },
]

export default function CompanyManagement() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    logo: "",
    heroImage: "",
    aboutImage: "",
    servicesHeroImage: "",
    realEstateHeroImage: "",
    contactHeroImage: "",
    buildingManagementImage: "",
    cleaningImage: "",
    fireInspectionImage: "",
    elevatorImage: "",
    teamImage: "",
    officeImage: "",
    showcaseImage: "",
  })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCompanyData()
  }, [])

  const fetchCompanyData = async () => {
    try {
      console.log("🔥 관리자 페이지에서 데이터 로드 시작")
      const response = await fetch("/api/admin/company")
      console.log("📡 응답 상태:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("📥 받은 데이터:", data)
        setCompanyData(data)
        console.log("✅ 상태 업데이트 완료")
      } else {
        console.error("❌ 응답 실패:", response.status)
      }
    } catch (error) {
      console.error("💥 데이터 로드 실패:", error)
      toast({
        title: "오류",
        description: "데이터를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const handleImageUrlChange = (key: keyof CompanyData, value: string) => {
    console.log(`🖼️ 이미지 URL 변경: ${key} = ${value}`)
    setCompanyData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log("💾 저장 시작, 데이터:", companyData)

      const response = await fetch("/api/admin/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      })

      console.log("📡 저장 응답 상태:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("📥 저장 결과:", result)

        toast({
          title: "성공! 🎉",
          description: "회사 정보가 저장되었습니다. 홈페이지를 새로고침해서 확인해보세요!",
        })

        // 저장 후 다시 데이터 로드해서 확인
        setTimeout(() => {
          fetchCompanyData()
        }, 1000)
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error("💥 저장 실패:", error)
      toast({
        title: "오류",
        description: "저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isValidImageUrl = (url: string) => {
    if (!url) return false
    try {
      new URL(url)
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes("unsplash.com") || url.includes("placeholder.com")
    } catch {
      return false
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🖼️ 회사 이미지 관리</h1>
          <p className="text-muted-foreground">홈페이지에 표시될 이미지들을 관리합니다.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} size="lg" className="bg-blue-600 hover:bg-blue-700">
          {loading ? "💾 저장 중..." : "💾 저장하기"}
        </Button>
      </div>

      <Tabs defaultValue="main" className="space-y-6">
        <TabsList>
          <TabsTrigger value="main">메인 이미지</TabsTrigger>
          <TabsTrigger value="services">서비스 이미지</TabsTrigger>
          <TabsTrigger value="additional">추가 이미지</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-6">
          <div className="grid gap-6">
            {imageFields.slice(0, 6).map((field) => (
              <Card key={field.key}>
                <CardHeader>
                  <CardTitle>{field.label}</CardTitle>
                  <CardDescription>{field.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={field.key}>이미지 URL</Label>
                    <Input
                      id={field.key}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={companyData[field.key as keyof CompanyData]}
                      onChange={(e) => handleImageUrlChange(field.key as keyof CompanyData, e.target.value)}
                    />
                  </div>
                  {companyData[field.key as keyof CompanyData] &&
                    isValidImageUrl(companyData[field.key as keyof CompanyData]) && (
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <Image
                          src={companyData[field.key as keyof CompanyData] || "/placeholder.svg"}
                          alt={field.label}
                          fill
                          className="object-cover"
                          onError={() => {
                            toast({
                              title: "이미지 로드 실패",
                              description: `${field.label} 이미지를 불러올 수 없습니다.`,
                              variant: "destructive",
                            })
                          }}
                        />
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-6">
            {imageFields.slice(6, 10).map((field) => (
              <Card key={field.key}>
                <CardHeader>
                  <CardTitle>{field.label}</CardTitle>
                  <CardDescription>{field.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={field.key}>이미지 URL</Label>
                    <Input
                      id={field.key}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={companyData[field.key as keyof CompanyData]}
                      onChange={(e) => handleImageUrlChange(field.key as keyof CompanyData, e.target.value)}
                    />
                  </div>
                  {companyData[field.key as keyof CompanyData] &&
                    isValidImageUrl(companyData[field.key as keyof CompanyData]) && (
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <Image
                          src={companyData[field.key as keyof CompanyData] || "/placeholder.svg"}
                          alt={field.label}
                          fill
                          className="object-cover"
                          onError={() => {
                            toast({
                              title: "이미지 로드 실패",
                              description: `${field.label} 이미지를 불러올 수 없습니다.`,
                              variant: "destructive",
                            })
                          }}
                        />
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="additional" className="space-y-6">
          <div className="grid gap-6">
            {imageFields.slice(10).map((field) => (
              <Card key={field.key}>
                <CardHeader>
                  <CardTitle>{field.label}</CardTitle>
                  <CardDescription>{field.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={field.key}>이미지 URL</Label>
                    <Input
                      id={field.key}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={companyData[field.key as keyof CompanyData]}
                      onChange={(e) => handleImageUrlChange(field.key as keyof CompanyData, e.target.value)}
                    />
                  </div>
                  {companyData[field.key as keyof CompanyData] &&
                    isValidImageUrl(companyData[field.key as keyof CompanyData]) && (
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                        <Image
                          src={companyData[field.key as keyof CompanyData] || "/placeholder.svg"}
                          alt={field.label}
                          fill
                          className="object-cover"
                          onError={() => {
                            toast({
                              title: "이미지 로드 실패",
                              description: `${field.label} 이미지를 불러올 수 없습니다.`,
                              variant: "destructive",
                            })
                          }}
                        />
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
