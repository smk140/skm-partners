"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus, Trash2, Save, RefreshCw } from "lucide-react"

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
  image_url: string | null
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
    address: "",
    phone: "",
    email: "",
    description: "",
  })

  // 임원 정보
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
      console.log("Loading company data...")
      const response = await fetch("/api/admin/company")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Loaded company data:", data)

      if (data.companyInfo) {
        setCompanyInfo(data.companyInfo)
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

  // 회사 기본 정보 저장
  const saveCompanyInfo = async () => {
    setIsSaving(true)
    try {
      console.log("Saving company info:", companyInfo)

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
      console.log("Save result:", result)

      if (!response.ok) {
        throw new Error(result.error || "저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "회사 기본 정보가 성공적으로 저장되었습니다.",
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
      console.log("Saving executives:", executives)

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
      console.log("Save executives result:", result)

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
      console.log("Saving success cases:", successCases)

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
      console.log("Save success cases result:", result)

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

  // 임원 추가
  const addExecutive = () => {
    const newExecutive: Executive = {
      id: Date.now(),
      name: "",
      position: "",
      bio: "",
      image_url: null,
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
          <p className="text-gray-600 mt-1">회사의 기본 정보, 임원진, 성공 사례를 관리합니다</p>
        </div>
        <Button onClick={loadCompanyData} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          새로고침
        </Button>
      </div>

      {/* 회사 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>회사 기본 정보</CardTitle>
          <CardDescription>회사의 기본적인 정보를 관리합니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
              <Label htmlFor="company-phone">전화번호</Label>
              <Input
                id="company-phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                placeholder="02-123-4567"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="company-address">주소</Label>
              <Input
                id="company-address"
                value={companyInfo.address}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                placeholder="서울특별시 강남구 테헤란로 123, 4층"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="company-description">회사 소개</Label>
            <Textarea
              id="company-description"
              value={companyInfo.description}
              onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
              placeholder="회사에 대한 간단한 소개를 입력하세요"
              rows={4}
            />
          </div>
          <Button onClick={saveCompanyInfo} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "저장 중..." : "기본 정보 저장"}
          </Button>
        </CardContent>
      </Card>

      {/* 임원 정보 */}
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

      {/* 성공 사례 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>성공 사례</CardTitle>
              <CardDescription>회사의 성공 사례를 관리합니다</CardDescription>
            </div>
            <Button onClick={addSuccessCase} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              사례 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {successCases.map((successCase, index) => (
            <div key={successCase.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">성공 사례 #{index + 1}</h4>
                <Button
                  onClick={() => removeSuccessCase(successCase.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>제목</Label>
                  <Input
                    value={successCase.title}
                    onChange={(e) => {
                      const updated = successCases.map((caseItem) =>
                        caseItem.id === successCase.id ? { ...caseItem, title: e.target.value } : caseItem,
                      )
                      setSuccessCases(updated)
                    }}
                    placeholder="강남 오피스 빌딩"
                  />
                </div>
                <div>
                  <Label>위치</Label>
                  <Input
                    value={successCase.location}
                    onChange={(e) => {
                      const updated = successCases.map((caseItem) =>
                        caseItem.id === successCase.id ? { ...caseItem, location: e.target.value } : caseItem,
                      )
                      setSuccessCases(updated)
                    }}
                    placeholder="서울 강남구"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>개선 전</Label>
                  <Input
                    value={successCase.before_status}
                    onChange={(e) => {
                      const updated = successCases.map((caseItem) =>
                        caseItem.id === successCase.id ? { ...caseItem, before_status: e.target.value } : caseItem,
                      )
                      setSuccessCases(updated)
                    }}
                    placeholder="공실률 35%"
                  />
                </div>
                <div>
                  <Label>개선 후</Label>
                  <Input
                    value={successCase.after_status}
                    onChange={(e) => {
                      const updated = successCases.map((caseItem) =>
                        caseItem.id === successCase.id ? { ...caseItem, after_status: e.target.value } : caseItem,
                      )
                      setSuccessCases(updated)
                    }}
                    placeholder="공실률 5%"
                  />
                </div>
                <div>
                  <Label>기간</Label>
                  <Input
                    value={successCase.period}
                    onChange={(e) => {
                      const updated = successCases.map((caseItem) =>
                        caseItem.id === successCase.id ? { ...caseItem, period: e.target.value } : caseItem,
                      )
                      setSuccessCases(updated)
                    }}
                    placeholder="4개월"
                  />
                </div>
              </div>
              <div>
                <Label>상세 설명</Label>
                <Textarea
                  value={successCase.details}
                  onChange={(e) => {
                    const updated = successCases.map((caseItem) =>
                      caseItem.id === successCase.id ? { ...caseItem, details: e.target.value } : caseItem,
                    )
                    setSuccessCases(updated)
                  }}
                  placeholder="성공 사례에 대한 상세한 설명을 입력하세요"
                  rows={3}
                />
              </div>
            </div>
          ))}
          {successCases.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>등록된 성공 사례가 없습니다. 성공 사례를 추가해보세요.</p>
            </div>
          )}
          <Button onClick={saveSuccessCases} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "저장 중..." : "성공 사례 저장"}
          </Button>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}
