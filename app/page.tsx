"use client"

import Link from "next/link"
import { ArrowRight, Building, CableCarIcon as Elevator, FlameIcon as Fire, MapPin, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
}

export default function Home() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    address: "",
    phone: "",
    email: "",
    description: "",
  })

  useEffect(() => {
    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.info) {
          setCompanyInfo(data.info)
        }
      })
      .catch((error) => {
        console.error("회사 정보 로드 실패:", error)
      })
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/placeholder.svg?height=600&width=1200&text=SKM파트너스+메인+Hero')`,
          }}
        ></div>
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl leading-tight">
            <span className="text-blue-400">공실률 ZERO</span>를 위한
            <br />
            스마트 건물 관리 솔루션
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-xl">
            청소, 소방, 엘리베이터 관리까지 - 건물 가치를 높이는 {companyInfo.name}의 원스톱 서비스
          </p>
          <Button
            size="lg"
            className="group bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            빠른 상담 신청하기
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Services Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">서비스 소개</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {companyInfo.name}는 건물 관리의 모든 영역에서 전문적인 서비스를 제공합니다. 청소부터 소방, 엘리베이터
              관리까지 건물 관리의 A부터 Z까지 책임집니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Building className="h-8 w-8 text-blue-600" />,
                title: "건물 관리",
                description: "종합적인 건물 관리 서비스로 건물의 가치를 높이고 관리의 효율성을 극대화합니다.",
                link: "/services/building",
                image: "/placeholder.svg?height=200&width=300&text=건물관리+서비스",
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 14h18M3 18h18M3 6h18"
                    />
                  </svg>
                ),
                title: "청소 서비스",
                description: "전문적인 청소 서비스로 건물의 청결을 유지하고 쾌적한 환경을 조성합니다.",
                link: "/services/cleaning",
                image: "/placeholder.svg?height=200&width=300&text=청소+서비스",
              },
              {
                icon: <Fire className="h-8 w-8 text-blue-600" />,
                title: "소방 점검",
                description: "소방 시설 및 스프링클러 점검과 관리로 화재 안전을 보장합니다.",
                link: "/services/fire",
                image: "/placeholder.svg?height=200&width=300&text=소방점검+서비스",
              },
              {
                icon: <Elevator className="h-8 w-8 text-blue-600" />,
                title: "엘리베이터 관리",
                description: "정기적인 점검과 유지보수로 엘리베이터의 안전성과 효율성을 확보합니다.",
                link: "/services/elevator",
                image: "/placeholder.svg?height=200&width=300&text=엘리베이터+관리",
              },
              {
                icon: <MapPin className="h-8 w-8 text-blue-600" />,
                title: "공실 관리",
                description: "임차인 연결 및 공실 매물 관리를 통해 건물 소유주의 수익을 극대화합니다.",
                link: "/services/vacancy",
                image: "/placeholder.svg?height=200&width=300&text=공실+관리",
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                ),
                title: "부동산 서비스",
                description: "건물 매매 및 임대 관리를 통해 부동산 자산 가치를 높이는 서비스를 제공합니다.",
                link: "/real-estate",
                image: "/placeholder.svg?height=200&width=300&text=부동산+서비스",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 group hover:border-blue-500 hover:-translate-y-1"
              >
                <div className="relative h-48 bg-slate-100">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="mb-2 text-white group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <Link
                    href={service.link}
                    className="text-blue-600 font-medium hover:underline inline-flex items-center"
                  >
                    자세히 보기 <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">부동산 서비스</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {companyInfo.name}는 공실 임대 대행 전문 서비스를 제공합니다. 건물주님을 대신하여 최적의 임차인을
              찾아드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">임차인을 대신 찾아드립니다</h3>
              <p className="text-slate-600 mb-6">
                건물 소유주님의 소중한 자산, 공실로 인한 손실이 걱정되시나요? {companyInfo.name}의 공실 임대 대행
                서비스를 통해 최적의 임차인을 빠르게 연결해 드립니다.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">전문적인 마케팅</h4>
                    <p className="text-slate-600">다양한 채널을 통한 효과적인 매물 홍보</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">임차인 심사</h4>
                    <p className="text-slate-600">신뢰할 수 있는 임차인 선별 및 검증</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">계약 관리</h4>
                    <p className="text-slate-600">임대차 계약 체결 및 관리 지원</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">임대료 최적화</h4>
                    <p className="text-slate-600">시장 분석을 통한 최적의 임대료 책정</p>
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                부동산 서비스 자세히 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-40 rounded-lg overflow-hidden shadow-md">
                    <img
                      src="/placeholder.svg?height=160&width=240&text=공실+Before"
                      alt="공실 Before"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-red-500 text-white px-2 py-1 text-sm">Before</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold text-red-500">공실률 35%</h4>
                    <p className="text-sm text-slate-600">관리 전 상태</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="relative h-40 rounded-lg overflow-hidden shadow-md">
                    <img
                      src="/placeholder.svg?height=160&width=240&text=공실+After"
                      alt="공실 After"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-green-500 text-white px-2 py-1 text-sm">After</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h4 className="font-semibold text-green-500">공실률 5%</h4>
                    <p className="text-sm text-slate-600">3개월 후</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-lg font-bold shadow-lg transform rotate-12">
                <div className="text-center">
                  <div className="text-2xl">30%</div>
                  <div className="text-xs">개선</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">전문적인 건물 관리 서비스가 필요하신가요?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {companyInfo.name}와 함께 건물 관리의 모든 고민을 해결하세요.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-blue-600 group shadow-lg"
          >
            지금 빠른 상담 신청
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </main>
  )
}
