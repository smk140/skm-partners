"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, RefreshCw, MapPin, Users, ImageIcon } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface CompanyInfo {
  name: string
  slogan: string
  address: string
  phone: string
  email: string
  website: string
  description: string
  established_year: string
  employee_count: string
  service_area: string
  logo_url: string
  business_hours: {
    weekday: string
    weekend: string
    holiday: string
    emergency: string
  }
  social_media: {
    facebook: string
    instagram: string
    linkedin: string
    youtube: string
    blog: string
  }
  map_info: {
    latitude: string
    longitude: string
    zoom_level: string
    map_embed_url: string
  }
  main_services: string[]
  certifications: string[]
  site_images: {
    hero_main: string
    hero_about: string
    hero_services: string
    hero_contact: string
    company_building: string
    team_photo: string
    office_interior: string
    service_showcase: string
  }
}

interface Executive {
  id: number
  name: string
  position: string
  bio: string
  order_index: number
  image_url?: string
}

export default function CompanyManagementPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // 회사 기본 정보 - 기본값으로 초기화
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    slogan: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    established_year: "",
    employee_count: "",
    service_area: "",
    logo_url: "",
    business_hours: {
      weekday: "",
      weekend: "",
      holiday: "",
      emergency: "",
    },
    social_media: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      blog: "",
    },
    map_info: {
      latitude: "",
      longitude: "",
      zoom_level: "",
      map_embed_url: "",
    },
    main_services: [],
    certifications: [],
    site_images: {
      hero_main: "",
      hero_about: "",
      hero_services: "",
      hero_contact: "",
      company_building: "",
      team_photo: "",
      office_interior: "",
      service_showcase: "",
    },
  })

  // 임원 정보
  const [executives, setExecutives] = useState<Executive[]>([])

  // 데이터 로드
  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    console.log("=== 데이터 로드 시작 ===")
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/company")
      console.log("API 응답 상태:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("받은 데이터:", data)

      // info 데이터가 있으면 설정
      if (data.info) {
        console.log("회사 정보 설정:", data.info)
        setCompanyInfo(data.info)
      }

      // executives 데이터가 있으면 설정
      if (data.executives) {
        console.log("임원 정보 설정:", data.executives)
        setExecutives(data.executives)
      }

      toast({
        title: "로드 완료",
        description: "데이터를 성공적으로 불러왔습니다.",
      })
    } catch (error) {
      console.error("로드 실패:", error)
      toast({
        title: "로드 실패",
        description: "데이터를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 이미지 URL 업데이트
  const updateCompanyImage = (field: keyof CompanyInfo["site_images"], url: string) => {
    console.log(`이미지 업데이트: ${field} = ${url}`)
    setCompanyInfo((prev) => ({
      ...prev,
      site_images: {
        ...prev.site_images,
        [field]: url,
      },
    }))
  }

  const updateLogoUrl = (url: string) => {
    console.log(`로고 업데이트: ${url}`)
    setCompanyInfo((prev) => ({
      ...prev,
      logo_url: url,
    }))
  }

  // 회사 정보 저장
  const saveCompanyInfo = async () => {
    console.log("=== 회사 정보 저장 시작 ===")
    console.log("저장할 데이터:", companyInfo)

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "company",
          data: companyInfo,
        }),
      })

      console.log("저장 응답 상태:", response.status)
      const result = await response.json()
      console.log("저장 응답:", result)

      if (!response.ok) {
        throw new Error(result.error || "저장 실패")
      }

      toast({
        title: "저장 완료!",
        description: "회사 정보가 성공적으로 저장되었습니다.",
      })

      // 저장 후 데이터 다시 로드해서 확인
      setTimeout(() => {
        loadCompanyData()
      }, 500)
    } catch (error) {
      console.error("저장 실패:", error)
      toast({
        title: "저장 실패",
        description: error instanceof Error ? error.message : "저장 중 오류 발생",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 임원 정보 저장
  const saveExecutives = async () => {
    console.log("=== 임원 정보 저장 시작 ===")
    console.log("저장할 임원 데이터:", executives)

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "executives",
          data: executives,
        }),
      })

      const result = await response.json()
      console.log("임원 저장 응답:", result)

      if (!response.ok) {
        throw new Error(result.error || "저장 실패")
      }

      toast({
        title: "저장 완료!",
        description: "임원 정보가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("임원 저장 실패:", error)
      toast({
        title: "저장 실패",
        description: error instanceof Error ? error.message : "저장 중 오류 발생",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 서비스 관리
  const addService = () => {
    setCompanyInfo((prev) => ({
      ...prev,
      main_services: [...prev.main_services, ""],
    }))
  }

  const removeService = (index: number) => {
    setCompanyInfo((prev) => ({
      ...prev,
      main_services: prev.main_services.filter((_, i) => i !== index),
    }))
  }

  const updateService = (index: number, value: string) => {
    setCompanyInfo((prev) => ({
      ...prev,
      main_services: prev.main_services.map((service, i) => (i === index ? value : service)),
    }))
  }

  // 임원 관리
  const addExecutive = () => {
    const newExecutive: Executive = {
      id: Date.now(),
      name: "",
      position: "",
      bio: "",
      order_index: executives.length + 1,
      image_url: "",
    }
    setExecutives([...executives, newExecutive])
  }

  const removeExecutive = (id: number) => {
    setExecutives(executives.filter((exec) => exec.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">회사 정보 관리</h1>
          <p className="text-gray-600 mt-1">회사의 기본 정보를 관리합니다</p>
        </div>
        <Button onClick={loadCompanyData} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          새로고침
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="contact">연락처</TabsTrigger>
          <TabsTrigger value="images">이미지</TabsTrigger>
          <TabsTrigger value="executives">임원진</TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                회사 기본 정보
              </CardTitle>
              <CardDescription>회사의 기본적인 정보를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">회사명</Label>
                  <Input
                    id="company-name"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    placeholder="SKM파트너스"
                  />
                </div>
                <div>
                  <Label htmlFor="company-slogan">슬로건</Label>
                  <Input
                    id="company-slogan"
                    value={companyInfo.slogan}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, slogan: e.target.value })}
                    placeholder="공실률 ZERO를 위한 스마트 건물 관리 솔루션"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-description">회사 소개</Label>
                <Textarea
                  id="company-description"
                  value={companyInfo.description}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                  placeholder="회사에 대한 상세한 소개를 입력하세요"
                  rows={4}
                />
              </div>

              {/* 주요 서비스 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>주요 서비스</Label>
                  <Button onClick={addService} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    서비스 추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {companyInfo.main_services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={service}
                        onChange={(e) => updateService(index, e.target.value)}
                        placeholder="서비스명을 입력하세요"
                      />
                      <Button onClick={() => removeService(index)} variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={saveCompanyInfo} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "저장 중..." : "기본 정보 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 연락처 정보 탭 */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                연락처 및 위치 정보
              </CardTitle>
              <CardDescription>연락처 정보를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-phone">전화번호</Label>
                  <Input
                    id="company-phone"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    placeholder="02-123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="company-email">이메일</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    placeholder="bykim@skm.kr"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-address">주소</Label>
                <Input
                  id="company-address"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  placeholder="서울특별시 강남구 테헤란로 123, 4층"
                />
              </div>

              <Button onClick={saveCompanyInfo} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "저장 중..." : "연락처 정보 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 이미지 관리 탭 */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                이미지 관리
              </CardTitle>
              <CardDescription>웹사이트에 사용될 이미지를 업로드하고 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <ImageUpload
                  label="사이트 전체 > 헤더/푸터 로고"
                  value={companyInfo.logo_url}
                  onChange={updateLogoUrl}
                />

                <ImageUpload
                  label="메인 페이지 > 상단 히어로 섹션 배경 이미지"
                  value={companyInfo.site_images.hero_main}
                  onChange={(url) => updateCompanyImage("hero_main", url)}
                />

                <ImageUpload
                  label="회사소개 페이지 > 상단 히어로 섹션 배경 이미지"
                  value={companyInfo.site_images.hero_about}
                  onChange={(url) => updateCompanyImage("hero_about", url)}
                />

                <ImageUpload
                  label="서비스 소개 페이지 > 상단 히어로 섹션 배경 이미지"
                  value={companyInfo.site_images.hero_services}
                  onChange={(url) => updateCompanyImage("hero_services", url)}
                />

                <ImageUpload
                  label="문의하기 페이지 > 상단 히어로 섹션 배경 이미지"
                  value={companyInfo.site_images.hero_contact}
                  onChange={(url) => updateCompanyImage("hero_contact", url)}
                />

                <ImageUpload
                  label="회사소개 페이지 > 회사 연혁/소개 섹션 이미지"
                  value={companyInfo.site_images.company_building}
                  onChange={(url) => updateCompanyImage("company_building", url)}
                />

                <ImageUpload
                  label="회사소개 페이지 > 팀/조직도 섹션 이미지"
                  value={companyInfo.site_images.team_photo}
                  onChange={(url) => updateCompanyImage("team_photo", url)}
                />

                <ImageUpload
                  label="회사소개 페이지 > 오시는 길/사무실 환경 섹션 이미지"
                  value={companyInfo.site_images.office_interior}
                  onChange={(url) => updateCompanyImage("office_interior", url)}
                />

                <ImageUpload
                  label="서비스 소개 페이지 > 주요 서비스 상세 설명 이미지"
                  value={companyInfo.site_images.service_showcase}
                  onChange={(url) => updateCompanyImage("service_showcase", url)}
                />
              </div>

              <div className="border-t pt-6">
                <Button onClick={saveCompanyInfo} disabled={isSaving} className="flex items-center gap-2 w-full">
                  <Save className="h-4 w-4" />
                  {isSaving ? "저장 중..." : "🔥 이미지 정보 저장 🔥"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 임원진 탭 */}
        <TabsContent value="executives">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>임원 정보</CardTitle>
                  <CardDescription>회사 임원진의 정보를 관리합니다</CardDescription>
                </div>
                <Button onClick={addExecutive} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  임원 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {executives.map((executive, index) => (
                <div key={executive.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">임원 #{index + 1}</h4>
                    <Button
                      onClick={() => removeExecutive(executive.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>이름</Label>
                      <Input
                        value={executive.name}
                        onChange={(e) => {
                          const updated = executives.map((exec) =>
                            exec.id === executive.id ? { ...exec, name: e.target.value } : exec,
                          )
                          setExecutives(updated)
                        }}
                        placeholder="김대표"
                      />
                    </div>
                    <div>
                      <Label>직책</Label>
                      <Input
                        value={executive.position}
                        onChange={(e) => {
                          const updated = executives.map((exec) =>
                            exec.id === executive.id ? { ...exec, position: e.target.value } : exec,
                          )
                          setExecutives(updated)
                        }}
                        placeholder="대표이사"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>소개</Label>
                    <Textarea
                      value={executive.bio}
                      onChange={(e) => {
                        const updated = executives.map((exec) =>
                          exec.id === executive.id ? { ...exec, bio: e.target.value } : exec,
                        )
                        setExecutives(updated)
                      }}
                      placeholder="임원에 대한 간단한 소개를 입력하세요"
                      rows={3}
                    />
                  </div>
                  <div>
                    <ImageUpload
                      label="회사소개 페이지 > 임원 소개 섹션 프로필 이미지"
                      value={executive.image_url || ""}
                      onChange={(url) => {
                        const updated = executives.map((exec) =>
                          exec.id === executive.id ? { ...exec, image_url: url } : exec,
                        )
                        setExecutives(updated)
                      }}
                    />
                  </div>
                </div>
              ))}
              {executives.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>등록된 임원이 없습니다. 임원을 추가해보세요.</p>
                </div>
              )}
              <Button onClick={saveExecutives} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "저장 중..." : "임원 정보 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
