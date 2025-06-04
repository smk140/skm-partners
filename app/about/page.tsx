"use client"

import Image from "next/image"
import { ArrowRight, Building, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
  site_images: {
    hero_about: string
    company_building: string
    team_photo: string
  }
}

interface Executive {
  id: number
  name: string
  position: string
  bio: string
  order_index: number
}

export default function AboutPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    address: "",
    phone: "",
    email: "",
    description: "",
    site_images: {
      hero_about: "",
      company_building: "",
      team_photo: "",
    },
  })
  const [executives, setExecutives] = useState<Executive[]>([])

  useEffect(() => {
    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.info) {
          setCompanyInfo(data.info)
        }
        if (data.executives) {
          setExecutives(data.executives)
        }
      })
      .catch((error) => {
        console.error("회사 정보 로드 실패:", error)
      })
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src={
            companyInfo.site_images.hero_about ||
            "/placeholder.svg?height=400&width=1200&text=About Us" ||
            "/placeholder.svg"
          }
          alt="회사 소개"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">회사 소개</h1>
          <p className="text-lg text-white/90 max-w-xl">{companyInfo.description}</p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-blue-600">{companyInfo.name} 소개</h2>
              <p className="text-slate-600 mb-6">{companyInfo.description}</p>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="flex items-start">
                  <Building className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">회사명</h3>
                    <p className="text-gray-700">{companyInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">주소</h3>
                    <p className="text-gray-700">{companyInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">전화번호</h3>
                    <p className="text-gray-700">{companyInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">이메일</h3>
                    <p className="text-gray-700">{companyInfo.email}</p>
                  </div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 group" asChild>
                <Link href="/services">
                  서비스 알아보기
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={
                  companyInfo.site_images.company_building ||
                  "/placeholder.svg?height=400&width=600&text=Company Image" ||
                  "/placeholder.svg"
                }
                alt={companyInfo.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (사진 없이 텍스트만) */}
      {executives.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">경영진 소개</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">{companyInfo.name}를 이끌어가는 전문가들을 소개합니다.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {executives
                .sort((a, b) => a.order_index - b.order_index)
                .map((executive) => (
                  <Card
                    key={executive.id}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-blue-600"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">{executive.name.charAt(0)}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{executive.name}</h3>
                      <p className="text-blue-600 font-medium mb-4">{executive.position}</p>
                      <p className="text-slate-600">{executive.bio}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Photo Section */}
      {companyInfo.site_images.team_photo && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">우리 팀</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                {companyInfo.name}의 전문가들이 함께 최고의 서비스를 제공합니다.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto">
              <Image
                src={companyInfo.site_images.team_photo || "/placeholder.svg"}
                alt="팀 단체 사진"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{companyInfo.name}와 함께하세요</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            건물 관리와 부동산 서비스의 새로운 기준을 경험해보세요.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-blue-600 group shadow-lg"
          >
            지금 문의하기
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </main>
  )
}
