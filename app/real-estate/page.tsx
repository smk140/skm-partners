"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-gray-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">부동산 서비스</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">현재 지원하지 않는 서비스입니다.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </Button>
            <Button asChild>
              <Link href="/contact">문의하기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
