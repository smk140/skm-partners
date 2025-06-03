"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Plus, Search, Trash2, Building } from "lucide-react"
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
}

export default function AdminRealEstatePage() {
  const { toast } = useToast()
  const [properties, setProperties] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    type: "오피스",
    size: "",
    price: "",
    description: "",
  })

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddProperty = async () => {
    try {
      const id = properties.length > 0 ? Math.max(...properties.map((p) => p.id)) + 1 : 1

      const newProp: Property = {
        id,
        ...newProperty,
        status: "활성",
        createdAt: new Date().toISOString().split("T")[0],
      }

      setProperties([...properties, newProp])

      setNewProperty({
        title: "",
        location: "",
        type: "오피스",
        size: "",
        price: "",
        description: "",
      })

      setIsAddDialogOpen(false)

      toast({
        title: "매물 추가 완료",
        description: "새로운 매물이 성공적으로 추가되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "매물 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProperty = async () => {
    if (selectedProperty === null) return

    try {
      setProperties(properties.filter((p) => p.id !== selectedProperty))
      setIsDeleteDialogOpen(false)
      setSelectedProperty(null)

      toast({
        title: "매물 삭제 완료",
        description: "선택한 매물이 성공적으로 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "매물 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminAuthCheck>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">부동산 관리</h1>
            <p className="text-slate-600 mt-2">매물 정보를 추가, 수정, 삭제할 수 있습니다.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">매물명</Label>
                    <Input
                      id="title"
                      value={newProperty.title}
                      onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                      placeholder="매물 이름을 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">매물 유형</Label>
                    <Select
                      value={newProperty.type}
                      onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}
                    >
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
                  <Label htmlFor="location">위치</Label>
                  <Input
                    id="location"
                    value={newProperty.location}
                    onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                    placeholder="주소를 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">면적</Label>
                    <Input
                      id="size"
                      value={newProperty.size}
                      onChange={(e) => setNewProperty({ ...newProperty, size: e.target.value })}
                      placeholder="면적을 입력하세요 (예: 85평)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">가격</Label>
                    <Input
                      id="price"
                      value={newProperty.price}
                      onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                      placeholder="가격을 입력하세요 (예: 월 580만원)"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">상세 설명</Label>
                  <Textarea
                    id="description"
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                    placeholder="매물에 대한 상세 설명을 입력하세요"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">이미지 업로드</Label>
                  <Input id="image" type="file" accept="image/*" />
                  <p className="text-sm text-slate-500">최대 5MB, JPG, PNG 형식만 지원합니다.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
            <CardDescription>총 {properties.length}개의 매물이 등록되어 있습니다.</CardDescription>
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
            {properties.length === 0 ? (
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
                    <TableHead>매물명</TableHead>
                    <TableHead>위치</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>면적</TableHead>
                    <TableHead>가격</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>{property.type}</TableCell>
                        <TableCell>{property.size}</TableCell>
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
                        <TableCell>{property.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/real-estate/${property.id}`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">수정</span>
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setSelectedProperty(property.id)
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
