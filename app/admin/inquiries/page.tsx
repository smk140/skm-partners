"use client"

import { useState, useEffect } from "react"
import { Eye, Search, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminAuthCheck } from "@/components/admin/auth-check"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Inquiry {
  id: number
  name: string
  phone: string
  email?: string
  company?: string
  service: string
  message?: string
  status: string
  created_at: string
}

export default function AdminInquiriesPage() {
  const { toast } = useToast()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [statusFilter])

  const fetchInquiries = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const url = `/api/inquiries${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("문의 목록을 불러오는데 실패했습니다.")
      }

      const data = await response.json()
      setInquiries(data.inquiries || [])
    } catch (err: any) {
      console.error("문의 목록 조회 실패:", err)
      setError(err instanceof Error ? err.message : "문의 목록을 불러오는데 실패했습니다.")
      toast({
        title: "오류 발생",
        description: "문의 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.email && inquiry.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inquiry.service.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStatusChange = async (inquiryId: number, newStatus: string) => {
    try {
      setInquiries(inquiries.map((inquiry) => (inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry)))

      toast({
        title: "상태 변경 완료",
        description: "문의 상태가 성공적으로 변경되었습니다.",
      })
    } catch (error) {
      console.error("상태 변경 실패:", error)
      toast({
        title: "상태 변경 실패",
        description: "문의 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <AdminAuthCheck>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">문의 관리</h1>
          <p className="text-slate-600 mt-2">고객 문의 내역을 확인하고 관리할 수 있습니다.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>문의 목록</CardTitle>
            <CardDescription>총 {inquiries.length}개의 문의가 있습니다.</CardDescription>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="이름, 이메일, 서비스로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="processing">처리중</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">문의 목록을 불러오는 중...</h3>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">오류가 발생했습니다</h3>
                <p className="text-slate-500">{error}</p>
                <Button onClick={fetchInquiries} className="mt-4">
                  다시 시도
                </Button>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">접수된 문의가 없습니다</h3>
                <p className="text-slate-500">새로운 문의가 들어오면 여기에 표시됩니다.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>서비스</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>접수일시</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium">{inquiry.name}</TableCell>
                        <TableCell>{inquiry.phone}</TableCell>
                        <TableCell>{inquiry.service}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inquiry.status === "pending"
                                ? "outline"
                                : inquiry.status === "processing"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {inquiry.status === "pending"
                              ? "대기중"
                              : inquiry.status === "processing"
                                ? "처리중"
                                : "완료"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(inquiry.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedInquiry(inquiry)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              상세보기
                            </Button>
                            <Select
                              value={inquiry.status}
                              onValueChange={(value) => handleStatusChange(inquiry.id, value)}
                            >
                              <SelectTrigger className="h-8 w-[100px]">
                                <SelectValue placeholder="상태 변경" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">대기중</SelectItem>
                                <SelectItem value="processing">처리중</SelectItem>
                                <SelectItem value="completed">완료</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
          {inquiries.length > 0 && (
            <CardFooter className="flex justify-between">
              <div className="text-sm text-slate-500">{filteredInquiries.length}개의 문의가 표시되고 있습니다.</div>
              <Button variant="outline" size="sm" onClick={fetchInquiries}>
                새로고침
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* 문의 상세 보기 다이얼로그 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>문의 상세 정보</DialogTitle>
            {selectedInquiry && (
              <DialogDescription>문의 접수일시: {formatDate(selectedInquiry.created_at)}</DialogDescription>
            )}
          </DialogHeader>
          {selectedInquiry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">이름</h3>
                  <p>{selectedInquiry.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">서비스</h3>
                  <p>{selectedInquiry.service}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">이메일</h3>
                  <p>{selectedInquiry.email || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">연락처</h3>
                  <p>{selectedInquiry.phone}</p>
                </div>
              </div>
              {selectedInquiry.company && (
                <div>
                  <h3 className="text-sm font-medium">회사명</h3>
                  <p>{selectedInquiry.company}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium">문의 내용</h3>
                <p className="mt-1 whitespace-pre-wrap">{selectedInquiry.message || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">처리 상태</h3>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedInquiry.status === "pending"
                        ? "outline"
                        : selectedInquiry.status === "processing"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {selectedInquiry.status === "pending"
                      ? "대기중"
                      : selectedInquiry.status === "processing"
                        ? "처리중"
                        : "완료"}
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">상태 변경</h3>
                <div className="flex gap-2">
                  <Button
                    variant={selectedInquiry.status === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedInquiry.id, "pending")}
                  >
                    대기중
                  </Button>
                  <Button
                    variant={selectedInquiry.status === "processing" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedInquiry.id, "processing")}
                  >
                    처리중
                  </Button>
                  <Button
                    variant={selectedInquiry.status === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedInquiry.id, "completed")}
                  >
                    완료
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminAuthCheck>
  )
}
