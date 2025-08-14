"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, Wrench, TrendingUp, Shield, Clock } from "lucide-react"

const services = [
  {
    id: "construction",
    title: "건축 시공",
    description: "전문적인 건축 시공 서비스를 제공합니다.",
    icon: Building,
    details: ["신축 건물 시공", "리모델링 및 증축", "인테리어 공사", "설계부터 완공까지 원스톱 서비스"],
  },
  {
    id: "management",
    title: "건물 관리",
    description: "체계적이고 전문적인 건물 관리 서비스입니다.",
    icon: Users,
    details: ["일상 관리 및 청소", "시설물 점검 및 보수", "보안 관리", "입주민 서비스"],
  },
  {
    id: "maintenance",
    title: "시설 유지보수",
    description: "건물의 가치를 유지하는 전문 유지보수 서비스입니다.",
    icon: Wrench,
    details: ["정기 점검 및 진단", "예방 정비", "긴급 수리", "설비 교체 및 업그레이드"],
  },
  {
    id: "consulting",
    title: "부동산 컨설팅",
    description: "전문적인 부동산 투자 및 관리 컨설팅을 제공합니다.",
    icon: TrendingUp,
    details: ["투자 분석 및 자문", "시장 조사 및 분석", "자산 관리 전략", "수익성 최적화"],
  },
]

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">우리의 서비스</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SKM파트너스는 건축부터 관리까지 부동산과 관련된 모든 서비스를 전문적으로 제공합니다. 고객의 니즈에 맞는
            맞춤형 솔루션을 통해 최고의 가치를 창출합니다.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-gray-600">{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {selectedService === service.id && (
                  <CardContent>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-gray-900">주요 서비스</h4>
                      <ul className="space-y-2">
                        {service.details.map((detail, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">왜 SKM파트너스를 선택해야 할까요?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">전문성과 신뢰</h3>
              <p className="text-gray-600">수년간의 경험과 전문 지식을 바탕으로 최고 품질의 서비스를 제공합니다.</p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">맞춤형 서비스</h3>
              <p className="text-gray-600">고객의 특별한 요구사항에 맞춘 개별화된 솔루션을 제공합니다.</p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">신속한 대응</h3>
              <p className="text-gray-600">24시간 대기 체제로 긴급 상황에도 빠르게 대응합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
