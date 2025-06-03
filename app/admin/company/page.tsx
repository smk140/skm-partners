"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, User, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  image_url?: string
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
  image_url?: string
}

export default function AdminCompanyPage() {
  const { toast } = useToast()
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    address: "서울특별시 강남구 테헤란로 123, 4층",
    phone: "02-123-4567",
    email: "bykim@skm.kr",
    description:
      "SKM파트너스는 건물 관리와 부동산 임대 대행 전문 기업으로, 고객의 자산 가치를 높이는 최고의 파트너입니다.",
  })

  const [executives, setExecutives] = useState<Executive[]>([])
  const [successCases, setSuccessCases] = useState<SuccessCase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/company")
      if (!response.ok) {
        throw new Error("데이터를 불러오는데 실패했습니다.")
      }
      const data = await response.json()

      setCompanyInfo(
        data.companyInfo || {
          name: "SKM파트너스",
          address: "서울특별시 강남구 테헤란로 123, 4층",
          phone: "02-123-4567",
          email: "bykim@skm.kr",
          description:
            "SKM파트너스는 건물 관리와 부동산 임대 대행 전문 기업으로, 고객의 자산 가치를 높이는 최고의 파트너입니다.",
        },
      )

      setExecutives(data.executives || [])
      setSuccessCases(data.successCases || [])
    } catch (error) {
      console.error("데이터 로드 실패:", error)
      toast({
        title: "데이터 로드 실패",
        description: "회사 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

      if (!response.ok) {
        throw new Error("회사 정보 저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "회사 정보가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("저장 실패:", error)
      toast({
        title: "저장 실패",
        description: "회사 정보 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveExecutives = async () => {
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

      if (!response.ok) {
        throw new Error("임원 정보 저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "임원 정보가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("저장 실패:", error)
      toast({
        title: "저장 실패",
        description: "임원 정보 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSuccessCases = async () => {
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

      if (!response.ok) {
        throw new Error("성공 사례 저장에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "성공 사례가 성공적으로 저장되었습니다.",
      })
    } catch (error) {
      console.error("저장 실패:", error)
      toast({
        title: "저장 실패",
        description: "성공 사례 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddExecutive = () => {
    // 임시 ID는 음수로 설정 (저장 시 새로운 ID로 대체됨)
    const newId = executives.length > 0 ? Math.min(...executives.map((e) => e.id)) - 1 : -1
    setExecutives([
      ...executives,
      {
        id: newId,
        name: "",
        position: "",
        bio: "",
        order_index: executives.length + 1,
      },
    ])
  }

  const handleAddSuccessCase = () => {
    // 임시 ID는 음수로 설정 (저장 시 새로운 ID로 대체됨)
    const newId = successCases.length > 0 ? Math.min(...successCases.map((c) => c.id)) - 1 : -1
    setSuccessCases([
      ...successCases,
      {
        id: newId,
        title: "",
        location: "",
        before_status: "",
        after_status: "",
        period: "",
        details: "",
      },
    ])
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    try {
      const { type, id } = itemToDelete

      const response = await fetch(`/api/admin/company?type=${type}&id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("삭제에 실패했습니다.")
      }

      if (type === "executive") {
        setExecutives(executives.filter((exec) => exec.id !== id))
      } else if (type === "success-case") {
        setSuccessCases(successCases.filter((caseItem) => caseItem.id !== id))
      }

      toast({
        title: "삭제 완료",
        description: type === "executive" ? "임원 정보가 삭제되었습니다." : "성공 사례가 삭제되었습니다.",
      })
    } catch (error) {
      console.error("삭제 실패:", error)
      toast({
        title: "삭제 실패",
        description: "항목 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const confirmDelete = (type: string, id: number) => {
    setItemToDelete({ type, id })
    setIsDeleteDialogOpen(true)
  }

  return (
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
                  <Input id="company-phone" name="phone" value={companyInfo.phone} onChange={handleCompanyInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">이메일</Label>
                  <Input id="company-email" name="email" value={companyInfo.email} onChange={handleCompanyInfoChange} />
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
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveCompanyInfo} disabled={isSaving}>
                {isSaving ? (
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>임원 소개</CardTitle>
                <CardDescription>회사 소개 페이지에 표시되는 임원 정보를 관리합니다.</CardDescription>
              </div>
              <Button onClick={handleAddExecutive} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                임원 추가
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {executives.length === 0 ? (
                <div className="text-center py-8 border rounded-lg border-dashed">
                  <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">등록된 임원 정보가 없습니다.</p>
                  <Button onClick={handleAddExecutive} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    임원 추가하기
                  </Button>
                </div>
              ) : (
                executives.map((executive) => (
                  <div key={executive.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-slate-100">
                          {executive.image_url ? (
                            <img
                              src={executive.image_url || "/placeholder.svg"}
                              alt={executive.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-400" />
                          )}
                        </div>
                        <div className="font-medium">{executive.name || "이름 미입력"}</div>
                      </div>
                      {executive.id > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => confirmDelete("executive", executive.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
                      <Label htmlFor={`executive-image-${executive.id}`}>이미지 URL</Label>
                      <Input
                        id={`executive-image-${executive.id}`}
                        value={executive.image_url || ""}
                        onChange={(e) => handleExecutiveChange(executive.id, "image_url", e.target.value)}
                        placeholder="이미지 URL을 입력하세요"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`executive-order-${executive.id}`}>표시 순서</Label>
                      <Input
                        id={`executive-order-${executive.id}`}
                        type="number"
                        value={executive.order_index}
                        onChange={(e) => handleExecutiveChange(executive.id, "order_index", e.target.value)}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveExecutives} disabled={isSaving}>
                {isSaving ? (
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>성공 사례</CardTitle>
                <CardDescription>부동산 페이지에 표시되는 성공 사례를 관리합니다.</CardDescription>
              </div>
              <Button onClick={handleAddSuccessCase} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                성공 사례 추가
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {successCases.length === 0 ? (
                <div className="text-center py-8 border rounded-lg border-dashed">
                  <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">등록된 성공 사례가 없습니다.</p>
                  <Button onClick={handleAddSuccessCase} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    성공 사례 추가하기
                  </Button>
                </div>
              ) : (
                successCases.map((caseItem) => (
                  <div key={caseItem.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{caseItem.title || "제목 미입력"}</div>
                      {caseItem.id > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => confirmDelete("success-case", caseItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
                          value={caseItem.before_status}
                          onChange={(e) => handleSuccessCaseChange(caseItem.id, "before_status", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`case-after-${caseItem.id}`}>이후 상태</Label>
                        <Input
                          id={`case-after-${caseItem.id}`}
                          value={caseItem.after_status}
                          onChange={(e) => handleSuccessCaseChange(caseItem.id, "after_status", e.target.value)}
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
                      <Label htmlFor={`case-image-${caseItem.id}`}>이미지 URL</Label>
                      <Input
                        id={`case-image-${caseItem.id}`}
                        value={caseItem.image_url || ""}
                        onChange={(e) => handleSuccessCaseChange(caseItem.id, "image_url", e.target.value)}
                        placeholder="이미지 URL을 입력하세요"
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveSuccessCases} disabled={isSaving}>
                {isSaving ? (
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

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>삭제 확인</DialogTitle>
            <DialogDescription>
              {itemToDelete?.type === "executive"
                ? "이 임원 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                : "이 성공 사례를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
