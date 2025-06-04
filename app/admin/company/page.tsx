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
import { Plus, Trash2, Save, RefreshCw, MapPin, Clock, Users, Award, ImageIcon } from "lucide-react"
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
}

interface SuccessCase {
  id: number
  title: string
  location: string
  before_status: string
  after_status: string
  period: string
  details: string
  image_url: string | null
}

export default function CompanyManagementPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // 회사 기본 정보
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

  // 임원 정보 (사진 제외)
  const [executives, setExecutives] = useState<Executive[]>([])

  // 성공 사례
  const [successCases, setSuccessCases] = useState<SuccessCase[]>([])

  // 데이터 로드
  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/company")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.companyInfo) {
        setCompanyInfo({
          ...data.companyInfo,
          business_hours: data.companyInfo.business_hours || {
            weekday: "",
            weekend: "",
            holiday: "",
            emergency: "",
          },
          social_media: data.companyInfo.social_media || {
            facebook: "",
            instagram: "",
            linkedin: "",
            youtube: "",
            blog: "",
          },
          map_info: data.companyInfo.map_info || {
            latitude: "",
            longitude: "",
            zoom_level: "",
            map_embed_url: "",
          },
          main_services: data.companyInfo.main_services || [],
          certifications: data.companyInfo.certifications || [],
          site_images: data.companyInfo.site_images || {
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
      }
      if (data.executives) {
        setExecutives(data.executives)
      }
      if (data.successCases) {
        setSuccessCases(data.successCases)
      }

      toast({
        title: "데이터 로드 완료",
        description: "회사 정보를 성공적으로 불러왔습니다.",
      })
    } catch (error) {
      console.error("Failed to load company data:", error)
      toast({
        title: "데이터 로드 실패",
        description: "회사 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 구글 맵 URL 자동 생성
  const generateMapUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}&zoom=16`
  }

  // 주소 변경 시 맵 URL 자동 업데이트
  const handleAddressChange = (newAddress: string) => {
    setCompanyInfo((prev) => ({
      ...prev,
      address: newAddress,
      map_info: {
        ...prev.map_info,
        map_embed_url: generateMapUrl(newAddress),
      },
    }))
  }

  // 회사 기본 정보 저장
  const saveCompanyInfo = async () => {
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

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "회사 정보가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("Failed to save company info:", error)
      toast({
        title: "저장 실패",
        description: error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 임원 정보 저장
  const saveExecutives = async () => {
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

      if (!response.ok) {
        throw new Error(result.error || "저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "임원 정보가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("Failed to save executives:", error)
      toast({
        title: "저장 실패",
        description: error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 성공 사례 저장
  const saveSuccessCases = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "success_cases",
          data: successCases,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "성공 사례가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("Failed to save success cases:", error)
      toast({
        title: "저장 실패",
        description: error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 서비스 추가/삭제
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

  // 인증 추가/삭제
  const addCertification = () => {
    setCompanyInfo((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""],
    }))
  }

  const removeCertification = (index: number) => {
    setCompanyInfo((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const updateCertification = (index: number, value: string) => {
    setCompanyInfo((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => (i === index ? value : cert)),
    }))
  }

  // 임원 추가
  const addExecutive = () => {
    const newExecutive: Executive = {
      id: Date.now(),
      name: "",
      position: "",
      bio: "",
      order_index: executives.length + 1,
    }
    setExecutives([...executives, newExecutive])
  }

  // 임원 삭제
  const removeExecutive = (id: number) => {
    setExecutives(executives.filter((exec) => exec.id !== id))
  }

  // 성공 사례 추가
  const addSuccessCase = () => {
    const newCase: SuccessCase = {
      id: Date.now(),
      title: "",
      location: "",
      before_status: "",
      after_status: "",
      period: "",
      details: "",
      image_url: null,
    }
    setSuccessCases([...successCases, newCase])
  }

  // 성공 사례 삭제
  const removeSuccessCase = (id: number) => {
    setSuccessCases(successCases.filter((caseItem) => caseItem.id !== id))
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">회사 정보 관리</h1>
          <p className="text-gray-600 mt-1">회사의 모든 정보를 상세하게 관리합니다</p>
        </div>
        <Button onClick={loadCompanyData} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          새로고침
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="contact">연락처</TabsTrigger>
          <TabsTrigger value="business">운영 정보</TabsTrigger>
          <TabsTrigger value="social">소셜 미디어</TabsTrigger>
          <TabsTrigger value="images">사이트 이미지</TabsTrigger>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="established-year">설립년도</Label>
                  <Input
                    id="established-year"
                    value={companyInfo.established_year}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, established_year: e.target.value })}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <Label htmlFor="employee-count">직원 수</Label>
                  <Input
                    id="employee-count"
                    value={companyInfo.employee_count}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, employee_count: e.target.value })}
                    placeholder="15명"
                  />
                </div>
                <div>
                  <Label htmlFor="service-area">서비스 지역</Label>
                  <Input
                    id="service-area"
                    value={companyInfo.service_area}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, service_area: e.target.value })}
                    placeholder="서울, 경기, 인천"
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

              <div>
                <Label>회사 로고</Label>
                <ImageUpload
                  value={companyInfo.logo_url || ""}
                  onChange={(url) => setCompanyInfo({ ...companyInfo, logo_url: url })}
                  label="회사 로고 이미지"
                  description="웹사이트 상단에 표시되는 회사 로고입니다. 투명 배경의 PNG 파일을 권장합니다."
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

              {/* 인증 및 자격 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    인증 및 자격
                  </Label>
                  <Button onClick={addCertification} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    인증 추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {companyInfo.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={cert}
                        onChange={(e) => updateCertification(index, e.target.value)}
                        placeholder="인증명을 입력하세요"
                      />
                      <Button
                        onClick={() => removeCertification(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
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

        {/* 연락처 정보 탭 (팩스 번호 제거) */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                연락처 및 위치 정보
              </CardTitle>
              <CardDescription>연락처 정보와 구글 맵 연동을 관리합니다</CardDescription>
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
                <Label htmlFor="company-website">웹사이트</Label>
                <Input
                  id="company-website"
                  value={companyInfo.website}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                  placeholder="https://skm.kr"
                />
              </div>

              <div>
                <Label htmlFor="company-address">주소 (구글 맵 자동 연동)</Label>
                <Input
                  id="company-address"
                  value={companyInfo.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 123, 4층"
                />
                <p className="text-sm text-gray-500 mt-1">주소를 변경하면 구글 맵이 자동으로 업데이트됩니다.</p>
              </div>

              <Button onClick={saveCompanyInfo} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "저장 중..." : "연락처 정보 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 운영 정보 탭 */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                운영 시간 및 정보
              </CardTitle>
              <CardDescription>운영 시간과 관련 정보를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weekday-hours">평일 운영시간</Label>
                  <Input
                    id="weekday-hours"
                    value={companyInfo.business_hours.weekday}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        business_hours: { ...companyInfo.business_hours, weekday: e.target.value },
                      })
                    }
                    placeholder="평일 09:00 - 18:00"
                  />
                </div>
                <div>
                  <Label htmlFor="weekend-hours">주말 운영시간</Label>
                  <Input
                    id="weekend-hours"
                    value={companyInfo.business_hours.weekend}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        business_hours: { ...companyInfo.business_hours, weekend: e.target.value },
                      })
                    }
                    placeholder="토요일 09:00 - 15:00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="holiday-hours">휴일 안내</Label>
                  <Input
                    id="holiday-hours"
                    value={companyInfo.business_hours.holiday}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        business_hours: { ...companyInfo.business_hours, holiday: e.target.value },
                      })
                    }
                    placeholder="일요일 및 공휴일 휴무"
                  />
                </div>
                <div>
                  <Label htmlFor="emergency-hours">긴급 대응</Label>
                  <Input
                    id="emergency-hours"
                    value={companyInfo.business_hours.emergency}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        business_hours: { ...companyInfo.business_hours, emergency: e.target.value },
                      })
                    }
                    placeholder="긴급상황 시 24시간 대응"
                  />
                </div>
              </div>

              <Button onClick={saveCompanyInfo} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "저장 중..." : "운영 정보 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 소셜 미디어 탭 */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>소셜 미디어 링크</CardTitle>
              <CardDescription>소셜 미디어 계정 링크를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={companyInfo.social_media.facebook}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        social_media: { ...companyInfo.social_media, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/skmpartners"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={companyInfo.social_media.instagram}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        social_media: { ...companyInfo.social_media, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/skmpartners"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={companyInfo.social_media.linkedin}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        social_media: { ...companyInfo.social_media, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/company/skmpartners"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={companyInfo.social_media.youtube}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        social_media: { ...companyInfo.social_media, youtube: e.target.value },
                      })
                    }
                    placeholder="https://youtube.com/@skmpartners"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="blog">블로그</Label>
                <Input
                  id="blog"
                  value={companyInfo.social_media.blog}
                  onChange={(e) =>
                    setCompanyInfo({
                      ...companyInfo,
                      social_media: { ...companyInfo.social_media, blog: e.target.value },
                    })
                  }
                  placeholder="https://blog.skm.kr"
                />
              </div>

              <Button onClick={saveCompanyInfo} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "저장 중..." : "소셜 미디어 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 사이트 이미지 관리 탭 - 이미지 설명 개선 */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                사이트 이미지 관리
              </CardTitle>
              <CardDescription>웹사이트에 사용되는 모든 이미지를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">메인 페이지 히어로 이미지</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    메인 페이지 상단에 표시되는 배경 이미지입니다. 권장 크기: 1920x600px
                  </p>
                  <ImageUpload
                    value={companyInfo.site_images.hero_main || ""}
                    onChange={(url) =>
                      setCompanyInfo({
                        ...companyInfo,
                        site_images: { ...companyInfo.site_images, hero_main: url },
                      })
                    }
                    label="메인 페이지 배경 이미지"
                    description="메인 페이지 상단 배경으로 사용됩니다"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">회사 소개 페이지 히어로 이미지</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    회사 소개 페이지 상단에 표시되는 배경 이미지입니다. 권장 크기: 1920x400px
                  </p>
                  <ImageUpload
                    value={companyInfo.site_images.hero_about || ""}
                    onChange={(url) =>
                      setCompanyInfo({
                        ...companyInfo,
                        site_images: { ...companyInfo.site_images, hero_about: url },
                      })
                    }
                    label="회사 소개 페이지 배경 이미지"
                    description="회사 소개 페이지 상단 배경으로 사용됩니다"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">서비스 페이지 히어로 이미지</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    서비스 페이지 상단에 표시되는 배경 이미지입니다. 권장 크기: 1920x400px
                  </p>
                  <ImageUpload
                    value={companyInfo.site_images.hero_services || ""}
                    onChange={(url) =>
                      setCompanyInfo({
                        ...companyInfo,
                        site_images: { ...companyInfo.site_images, hero_services: url },
                      })
                    }
                    label="서비스 페이지 배경 이미지"
                    description="서비스 페이지 상단 배경으로 사용됩니다"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">문의하기 페이지 히어로 이미지</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    문의하기 페이지 상단에 표시되는 배경 이미지입니다. 권장 크기: 1920x400px
                  </p>
                  <ImageUpload
                    value={companyInfo.site_images.hero_contact || ""}
                    onChange={(url) =>
                      setCompanyInfo({
                        ...companyInfo,
                        site_images: { ...companyInfo.site_images, hero_contact: url },
                      })
                    }
                    label="문의하기 페이지 배경 이미지"
                    description="문의하기 페이지 상단 배경으로 사용됩니다"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">회사 건물 이미지</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    회사 소개 페이지에 표시되는 회사 건물 이미지입니다. 권장 크기: 800x600px
                  </p>
                  <ImageUpload
                    value={companyInfo.site_images.company_building || ""}
                    onChange={(url) =>
                      setCompanyInfo({
                        ...companyInfo,
                        site_images: { ...companyInfo.site_images, company_building: url },
                      })
                    }
                    label="회사 건물 외관 이미지"
                    description="회사 소개 페이지에 표시되는 건물 이미지입니다"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">팀 단체 사진</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    회사 소개 페이지에 표시되는 팀 단체 사진입니다. 권장 크기: 1200x800px
                  </p>
                  <ImageUpload
                    value={companyInfo.site_images.team_photo || ""}
                    onChange={(url) =>
                      setCompanyInfo({
                        ...companyInfo,
                        site_images: { ...companyInfo.site_images, team_photo: url },
                      })
                    }
                    label="팀 단체 사진"
                    description="회사 소개 페이지에 표시되는 팀 단체 사진입니다"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">사무실 내부 이미지</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    회사 소개 또는 서비스 페이지에 표시되는 사무실 내부 이미지입니다. 권장 크기: 800x600px
                  </p>
                  <ImageUpload
                    value={companyInfo.site_images.office_interior || ""}
                    onChange={(url) =>
                      setCompanyInfo({
                        ...companyInfo,
                        site_images: { ...companyInfo.site_images, office_interior: url },
                      })
                    }
                    label="사무실 내부 이미지"
                    description="회사 소개 또는 서비스 페이지에 표시되는 사무실 내부 이미지입니다"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">서비스 소개 이미지</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    서비스 페이지에 표시되는 서비스 소개 이미지입니다. 권장 크기: 800x600px
                  </p>
                  <ImageUpload
                    value={companyInfo.site_images.service_showcase || ""}
                    onChange={(url) =>
                      setCompanyInfo({
                        ...companyInfo,
                        site_images: { ...companyInfo.site_images, service_showcase: url },
                      })
                    }
                    label="서비스 소개 이미지"
                    description="서비스 페이지에 표시되는 서비스 소개 이미지입니다"
                  />
                </div>
              </div>

              <Button onClick={saveCompanyInfo} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? "저장 중..." : "사이트 이미지 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 임원진 탭 (사진 제외) */}
        <TabsContent value="executives">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>임원 정보</CardTitle>
                  <CardDescription>회사 임원진의 정보를 관리합니다 (사진 제외)</CardDescription>
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
