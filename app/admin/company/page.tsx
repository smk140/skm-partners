"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { CompanyData } from "@/lib/file-db"

export default function CompanyAdmin() {
  const [data, setData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  /* -------------------------------------------------------------- */
  /* Load                                                            */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/admin/company")
        const json = await res.json()
        if (json.success) setData(json.companyInfo)
        else toast({ title: "오류", description: json.error, variant: "destructive" })
      } catch {
        toast({ title: "네트워크 오류", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* -------------------------------------------------------------- */
  /* Save                                                            */
  /* -------------------------------------------------------------- */
  async function handleSave() {
    if (!data) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) toast({ title: "저장 완료" })
      else toast({ title: "저장 실패", description: json.error, variant: "destructive" })
    } catch {
      toast({ title: "네트워크 오류", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  function set<K extends keyof CompanyData>(key: K, value: CompanyData[K]) {
    setData((d) => (d ? { ...d, [key]: value } : d))
  }

  /* -------------------------------------------------------------- */
  /* Render                                                          */
  /* -------------------------------------------------------------- */
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        로딩 중...
      </div>
    )

  if (!data)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="mb-4">데이터를 불러오지 못했습니다.</p>
        <Link href="/admin/debug" className="text-blue-600 underline">
          GitHub 연결 상태 확인
        </Link>
      </div>
    )

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">회사 정보 관리</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          저장
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="images">이미지 URL</TabsTrigger>
        </TabsList>

        {/* 기본 정보 ------------------------------------------------ */}
        <TabsContent value="basic" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>회사 개요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>회사명</Label>
                <Input value={data.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>한 줄 소개</Label>
                <Textarea rows={3} value={data.description} onChange={(e) => set("description", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>연락처</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>전화번호</Label>
                <Input value={data.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <Input value={data.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>주소</Label>
                <Input value={data.address} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>웹사이트</Label>
                <Input value={data.website} onChange={(e) => set("website", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 이미지 URL ---------------------------------------------- */}
        <TabsContent value="images" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>이미지 URL</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {(
                [
                  ["logoUrl", "로고"],
                  ["heroImageUrl", "메인 히어로"],
                  ["aboutImageUrl", "회사 소개 이미지"],
                  ["buildingManagementUrl", "서비스: 건물 관리"],
                  ["cleaningServiceUrl", "서비스: 청소"],
                  ["fireInspectionUrl", "서비스: 소방 안전"],
                  ["elevatorManagementUrl", "서비스: 엘리베이터"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <Input
                    value={(data[key] as string) ?? ""}
                    placeholder="https://"
                    onChange={(e) => set(key, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
