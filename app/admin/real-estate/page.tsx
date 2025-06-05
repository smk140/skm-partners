"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Plus, Search, Trash2, Building, ImageIcon } from "lucide-react"
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
import { ImageUpload } from "@/components/image-upload" // Import ImageUpload

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
  image_url?: string // Add image_url
}

const INITIAL_NEW_PROPERTY_STATE = {
  title: "",
  location: "",
  type: "오피스",
  size: "",
  price: "",
  description: "",
  image_url: "", // Add image_url
}

export default function AdminRealEstatePage() {
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null)

  const [newProperty, setNewProperty] = useState(INITIAL_NEW_PROPERTY_STATE)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/properties")
      if (!response.ok) {
        throw new Error("매물 정보를 불러오는데 실패했습니다.")
      }
      const data = await response.json()
      if (data.success && Array.isArray(data.properties)) {
        setProperties(data.properties)
      } else {
        setProperties([])
        console.error("API 응답 형식이 올바르지 않거나 매물이 없습니다:", data)
      }
    } catch (error) {
      console.error("매물 로딩 오류:", error)
      toast({ title: "오류", description: (error as Error).message, variant: "destructive" })
      setProperties([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddProperty = async () => {
    if (!newProperty.title || !newProperty.location) {
      toast({ title: "입력 오류", description: "매물명과 위치는 필수입니다.", variant: "destructive" })
      return
    }
    try {
      const response = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProperty),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "알 수 없는 오류 발생" }))
        throw new Error(errorData.message || "매물 추가에 실패했습니다.")
      }

      const result = await response.json()

      if (result.success && result.property) {
        // setProperties([...properties, result.property]) // Optimistic update
        await fetchProperties() // Re-fetch to get the latest list including new ID
        setNewProperty(INITIAL_NEW_PROPERTY_STATE) // Reset form
        setIsAddDialogOpen(false)
        toast({
          title: "매물 추가 완료",
          description: "새로운 매물이 성공적으로 추가되었습니다.",
        })
      } else {
        throw new Error(result.message || "매물 추가 결과가 올바르지 않습니다.")
      }
    } catch (error) {
      console.error("매물 추가 중 오류:", error)
      toast({
        title: "오류 발생",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteProperty = async () => {
    if (selectedPropertyId === null) return

    try {
      const response = await fetch(`/api/admin/properties?id=${selectedPropertyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "알 수 없는 오류 발생" }))
        throw new Error(errorData.message || "매물 삭제에 실패했습니다.")
      }
      const result = await response.json()

      if (result.success) {
        // setProperties(properties.filter((p) => p.id !== selectedPropertyId)) // Optimistic update
        await fetchProperties() // Re-fetch
        setIsDeleteDialogOpen(false)
        setSelectedPropertyId(null)
        toast({
          title: "매물 삭제 완료",
          description: "선택한 매물이 성공적으로 삭제되었습니다.",
        })
      } else {
        throw new Error(result.message || "매물 삭제 결과가 올바르지 않습니다.")
      }
    } catch (error) {
      console.error("매물 삭제 중 오류:", error)
      toast({
        title: "오류 발생",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleNewPropertyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProperty((prev) => ({ ...prev, [name]: value }))
  }

  const handleNewPropertySelectChange = (value: string) => {
    setNewProperty((prev) => ({ ...prev, type: value }))
  }

  const handleNewPropertyImageChange = (url: string) => {
    setNewProperty((prev) => ({ ...prev, image_url: url }))
  }

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
              if (!isOpen) setNewProperty(INITIAL_NEW_PROPERTY_STATE) // Reset form on close
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />새 매물 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
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
                      name="title"
                      value={newProperty.title}
                      onChange={handleNewPropertyInputChange}
                      placeholder="매물 이름을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">매물 유형</Label>
                    <Select value={newProperty.type} onValueChange={handleNewPropertySelectChange}>
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
                    name="location"
                    value={newProperty.location}
                    onChange={handleNewPropertyInputChange}
                    placeholder="주소를 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">면적</Label>
                    <Input
                      id="size"
                      name="size"
                      value={newProperty.size}
                      onChange={handleNewPropertyInputChange}
                      placeholder="면적을 입력하세요 (예: 85평)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">가격</Label>
                    <Input
                      id="price"
                      name="price"
                      value={newProperty.price}
                      onChange={handleNewPropertyInputChange}
                      placeholder="가격을 입력하세요 (예: 월 580만원)"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">상세 설명</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newProperty.description}
                    onChange={handleNewPropertyInputChange}
                    placeholder="매물에 대한 상세 설명을 입력하세요"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <ImageUpload
                    label="매물 대표 이미지"
                    value={newProperty.image_url || ""}
                    onChange={handleNewPropertyImageChange}
                    description="매물 목록 및 상세 페이지에 사용될 대표 이미지입니다."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setNewProperty(INITIAL_NEW_PROPERTY_STATE) // Reset form on cancel
                  }}
                >
                  취소
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddProperty}>
                  매물 추가
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>매물 목록</CardTitle>
            <CardDescription>총 {isLoading ? "..." : properties.length}개의 매물이 등록되어 있습니다.</CardDescription>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <Input
                placeholder="매물명, 위치, 유형으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
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
                            <Image
                              src={property.image_url || "/placeholder.svg"}
                              alt={property.title}
                              width={64}
                              height={64}
                              className="object-cover rounded-md h-16 w-16"
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
                            <Button variant="ghost" size="icon" asChild disabled>
                              {/* TODO: Edit functionality */}
                              <Link href={`#`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">수정</span>
                              </Link>
                            </Button>
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
