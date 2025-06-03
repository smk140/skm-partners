"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, Upload, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AdminAuthCheck } from "@/components/admin/auth-check"
import { useToast } from "@/components/ui/use-toast"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
}

interface Executive {
  id: number
  name: string
  position: string
  bio: string
  image: string
}

interface SuccessCase {
  id: number
  title: string
  location: string
  before: string
  after: string
  period: string
  details: string
}

export default function AdminCompanyPage() {
  const { toast } = useToast()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    address: "서울특별시 강남구 테헤란로 123, 4층",
    phone: "02-123-4567",
    email: "info@skmpartners.com",
    description:
      "SKM파트너스는 건물 관리와 부동산 임대 대행 전문 기업으로, 고객의 자산 가치를 높이는 최고의 파트너입니다.",
  })

  const [executives, setExecutives] = useState<Executive[]>([
    {
      id: 1,
      name: "김대표",
      position: "대표이사",
      bio: "건물 관리 업계에서 20년 이상의 경험을 가진 전문가로, SKM파트너스를 설립하여 업계를 선도하고 있습니다.",
      image: "",
    },
    {
      id: 2,
      name: "이부장",
      position: "운영 이사",
      bio: "15년 이상의 건물 관리 경험을 바탕으로 SKM파트너스의 운영을 총괄하고 있습니다.",
      image: "",
    },
    {
      id: 3,
      name: "박이사",
      position: "부동산 이사",
      bio: "부동산 업계에서 10년 이상의 경험을 가진 전문가로, SKM파트너스의 부동산 서비스를 이끌고 있습니다.",
      image: "",
    },
  ])

  const [successCases, setSuccessCases] = useState<SuccessCase[]>([
    {
      id: 1,
      title: "강남 오피스 빌딩",
      location: "서울 강남구",
      before: "공실률 35%",
      after: "공실률 5%",
      period: "4개월",
      details: "강남 오피스 빌딩의 공실률을 35%에서 5%로 4개월 만에 개선한 성공 사례입니다.",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 실제 구현에서는 서버에서 데이터를 가져옵니다
    const fetchData = async () => {
      try {
        // const response = await fetch('/api/admin/company')
        // const data = await response.json()
        // setCompanyInfo(data.companyInfo)
        // setExecutives(data.executives)
        // setSuccessCases(data.successCases)
      } catch (error) {
        console.error("데이터 로드 실패:", error)
      }
    }

    fetchData()
  }, [])

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompanyInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleExecutiveChange = (id: number, field: string, value: string) => {
    setExecutives((prev) => prev.map((exec) => (exec.id === id ? { ...exec, [field]: value } : exec)))
  }

  const handleSuccessCaseChange = (id: number, field: string, value: string) => {
    setSuccessCases((prev) => prev.map((caseItem) => (caseItem.id === id ? { ...caseItem, [field]: value } : caseItem)))
  }

  const handleSaveCompanyInfo = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "저장 완료",
        description: "회사 정보가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "회사 정보 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveExecutives = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "저장 완료",
        description: "임원 정보가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "임원 정보 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSuccessCases = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "저장 완료",
        description: "성공 사례가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "성공 사례 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminAuthCheck>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">회사 정보 관리</h1>
          <p className="text-slate-600 mt-2">회사 정보, 임원 소개, 성공 사례 등을 관리할 수 있습니다.</p>
        </div>

        <Tabs defaultValue="company-info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company-info">회사 정보</TabsTrigger>
            <TabsTrigger value="executives">임원 소개</TabsTrigger>
            <TabsTrigger value="success-cases">성공 사례</TabsTrigger>
          </TabsList>

          {/* 회사 정보 탭 */}
          <TabsContent value="company-info">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
                <CardDescription>웹사이트에 표시되는 회사의 기본 정보를 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">회사명</Label>
                  <Input id="company-name" name="name" value={companyInfo.name} onChange={handleCompanyInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">주소</Label>
                  <Input
                    id="company-address"
                    name="address"
                    value={companyInfo.address}
                    onChange={handleCompanyInfoChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">전화번호</Label>
                    <Input
                      id="company-phone"
                      name="phone"
                      value={companyInfo.phone}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">이메일</Label>
                    <Input
                      id="company-email"
                      name="email"
                      value={companyInfo.email}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-description">회사 소개</Label>
                  <Textarea
                    id="company-description"
                    name="description"
                    value={companyInfo.description}
                    onChange={handleCompanyInfoChange}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveCompanyInfo} disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      저장 중...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      저장하기
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 임원 소개 탭 */}
          <TabsContent value="executives">
            <Card>
              <CardHeader>
                <CardTitle>임원 소개</CardTitle>
                <CardDescription>회사 소개 페이지에 표시되는 임원 정보를 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {executives.map((executive) => (
                  <div key={executive.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-100">
                        <User className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`executive-name-${executive.id}`}>이름</Label>
                            <Input
                              id={`executive-name-${executive.id}`}
                              value={executive.name}
                              onChange={(e) => handleExecutiveChange(executive.id, "name", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`executive-position-${executive.id}`}>직책</Label>
                            <Input
                              id={`executive-position-${executive.id}`}
                              value={executive.position}
                              onChange={(e) => handleExecutiveChange(executive.id, "position", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`executive-bio-${executive.id}`}>소개</Label>
                      <Textarea
                        id={`executive-bio-${executive.id}`}
                        value={executive.bio}
                        onChange={(e) => handleExecutiveChange(executive.id, "bio", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`executive-image-${executive.id}`}>이미지</Label>
                      <div className="flex items-center gap-4">
                        <Input id={`executive-image-${executive.id}`} type="file" accept="image/*" />
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          업로드
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveExecutives} disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      저장 중...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      저장하기
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 성공 사례 탭 */}
          <TabsContent value="success-cases">
            <Card>
              <CardHeader>
                <CardTitle>성공 사례</CardTitle>
                <CardDescription>부동산 페이지에 표시되는 성공 사례를 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {successCases.map((caseItem) => (
                  <div key={caseItem.id} className="border rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`case-title-${caseItem.id}`}>제목</Label>
                        <Input
                          id={`case-title-${caseItem.id}`}
                          value={caseItem.title}
                          onChange={(e) => handleSuccessCaseChange(caseItem.id, "title", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`case-location-${caseItem.id}`}>위치</Label>
                        <Input
                          id={`case-location-${caseItem.id}`}
                          value={caseItem.location}
                          onChange={(e) => handleSuccessCaseChange(caseItem.id, "location", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`case-before-${caseItem.id}`}>이전 상태</Label>
                        <Input
                          id={`case-before-${caseItem.id}`}
                          value={caseItem.before}
                          onChange={(e) => handleSuccessCaseChange(caseItem.id, "before", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`case-after-${caseItem.id}`}>이후 상태</Label>
                        <Input
                          id={`case-after-${caseItem.id}`}
                          value={caseItem.after}
                          onChange={(e) => handleSuccessCaseChange(caseItem.id, "after", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`case-period-${caseItem.id}`}>기간</Label>
                        <Input
                          id={`case-period-${caseItem.id}`}
                          value={caseItem.period}
                          onChange={(e) => handleSuccessCaseChange(caseItem.id, "period", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`case-details-${caseItem.id}`}>상세 설명</Label>
                      <Textarea
                        id={`case-details-${caseItem.id}`}
                        value={caseItem.details}
                        onChange={(e) => handleSuccessCaseChange(caseItem.id, "details", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`case-image-${caseItem.id}`}>이미지</Label>
                      <div className="flex items-center gap-4">
                        <Input id={`case-image-${caseItem.id}`} type="file" accept="image/*" />
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          업로드
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveSuccessCases} disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      저장 중...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      저장하기
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminAuthCheck>
  )
}
