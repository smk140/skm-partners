"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Trash2, Building, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminAuthCheck } from "@/components/admin/auth-check"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ImageSelector } from "@/components/image-selector"

interface Property {
  id: number
  title: string
  location: string
  type: string
  size: string
  price: string
  description: string
  status: string
  createdAt: string
  image_url?: string
}

export default function AdminRealEstatePage() {
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 폼 상태
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("오피스")
  const [size, setSize] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    console.log("매물 목록 조회 시작...")
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/properties", {
        method: "GET",
        cache: "no-store",
      })

      console.log("응답 상태:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`)
      }

      const data = await response.json()
      console.log("받은 데이터:", data)

      if (data.success && Array.isArray(data.properties)) {
        setProperties(data.properties)
        console.log("매물 목록 설정 완료:", data.properties.length, "개")
      } else {
        setProperties([])
        console.warn("매물 데이터가 없거나 형식이 잘못됨")
      }
    } catch (error) {
      console.error("매물 조회 실패:", error)
      toast({
        title: "오류",
        description: "매물 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setLocation("")
    setType("오피스")
    setSize("")
    setPrice("")
    setDescription("")
    setImageUrl("")
  }

  const handleAddProperty = async () => {
    console.log("매물 추가 시작...")
    console.log("폼 데이터:", { title, location, type, size, price, description, imageUrl })

    if (!title.trim() || !location.trim()) {
      toast({
        title: "입력 오류",
        description: "매물명과 위치는 필수입니다.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const propertyData = {
        title: title.trim(),
        location: location.trim(),
        type,
        size: size.trim(),
        price: price.trim(),
        description: description.trim(),
        image_url: imageUrl.trim(),
      }

      console.log("전송할 데이터:", propertyData)

      const response = await fetch("/api/admin/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      console.log("추가 응답 상태:", response.status)

      const result = await response.json()
      console.log("추가 응답 데이터:", result)

      if (!response.ok) {
        throw new Error(result.error || `HTTP 오류: ${response.status}`)
      }

      if (result.success) {
        console.log("매물 추가 성공!")
        toast({
          title: "성공",
          description: "매물이 성공적으로 추가되었습니다.",
        })

        // 폼 초기화
        resetForm()
        setIsAddDialogOpen(false)

        // 목록 새로고침
        await fetchProperties()
      } else {
        throw new Error(result.message || "매물 추가에 실패했습니다.")
      }
    } catch (error) {
      console.error("매물 추가 실패:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "매물 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProperty = async () => {
    if (selectedPropertyId === null) return

    try {
      const response = await fetch(`/api/admin/properties?id=${selectedPropertyId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "매물 삭제에 실패했습니다.")
      }

      if (result.success) {
        toast({
          title: "성공",
          description: "매물이 성공적으로 삭제되었습니다.",
        })

        setIsDeleteDialogOpen(false)
        setSelectedPropertyId(null)
        await fetchProperties()
      } else {
        throw new Error(result.message || "매물 삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("매물 삭제 실패:", error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "매물 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AdminAuthCheck>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">부동산 관리</h1>
            <p className="text-slate-600 mt-2">매물 정보를 추가, 수정, 삭제할 수 있습니다.</p>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(isOpen) => {
              setIsAddDialogOpen(isOpen)
              if (!isOpen) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />새 매물 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>새 매물 추가</DialogTitle>
                <DialogDescription>
                  새로운 매물 정보를 입력하세요. 추가된 매물은 즉시 사이트에 표시됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      매물명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="매물 이름을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">매물 유형</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="매물 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="오피스">오피스</SelectItem>
                        <SelectItem value="상가">상가</SelectItem>
                        <SelectItem value="오피스텔">오피스텔</SelectItem>
                        <SelectItem value="공장/창고">공장/창고</SelectItem>
                        <SelectItem value="주거용">주거용</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">
                    위치 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="주소를 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">면적</Label>
                    <Input
                      id="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="면적을 입력하세요 (예: 85평)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">가격</Label>
                    <Input
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="가격을 입력하세요 (예: 월 580만원)"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">상세 설명</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="매물에 대한 상세 설명을 입력하세요"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <ImageSelector
                    label="매물 대표 이미지"
                    value={imageUrl}
                    onChange={(url) => {
                      console.log("이미지 선택됨:", url)
                      setImageUrl(url)
                    }}
                    description="매물 목록 및 상세 페이지에 사용될 대표 이미지를 선택하세요."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    resetForm()
                  }}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddProperty} disabled={isSubmitting}>
                  {isSubmitting ? "추가 중..." : "매물 추가"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>매물 목록</CardTitle>
            <CardDescription>총 {properties.length}개의 매물이 등록되어 있습니다.</CardDescription>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <Input
                placeholder="매물명, 위치, 유형으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={fetchProperties} variant="outline" size="sm">
                새로고침
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-slate-500">매물을 불러오는 중...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">등록된 매물이 없습니다</h3>
                <p className="text-slate-500 mb-4">첫 번째 매물을 추가해보세요.</p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  매물 추가하기
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이미지</TableHead>
                    <TableHead>매물명</TableHead>
                    <TableHead>위치</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>가격</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          {property.image_url ? (
                            <img
                              src={property.image_url || "/placeholder.svg"}
                              alt={property.title}
                              className="object-cover rounded-md h-16 w-16"
                              onLoad={() => console.log("테이블 이미지 로드 성공:", property.title)}
                              onError={(e) => {
                                console.error("테이블 이미지 로드 실패:", property.title)
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          ) : (
                            <div className="h-16 w-16 bg-slate-100 rounded-md flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>{property.type}</TableCell>
                        <TableCell>{property.price}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              property.status === "활성" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {property.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(property.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setSelectedPropertyId(property.id)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">삭제</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {properties.length > 0 && (
            <CardFooter className="flex justify-between">
              <div className="text-sm text-slate-500">{filteredProperties.length}개의 매물이 표시되고 있습니다.</div>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>매물 삭제 확인</DialogTitle>
            <DialogDescription>정말로 이 매물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteProperty}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminAuthCheck>
  )
}
