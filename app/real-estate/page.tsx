"use client"

import Link from "next/link"
import { Building, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function RealEstatePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">부동산 서비스</h1>
            <p className="text-xl mb-8 text-blue-100">SKM파트너스 부동산 서비스 안내</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Building className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">부동산 서비스</h2>
                <h3 className="text-xl font-medium text-gray-700 mb-6">현재 지원하지 않는 서비스입니다</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  죄송합니다. 부동산 매물 서비스는 현재 제공하지 않고 있습니다.
                  <br />
                  다른 서비스에 대한 문의는 연락처를 통해 문의해 주세요.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      홈으로 돌아가기
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">문의하기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
