"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  SprayCanIcon as Spray,
  HomeIcon,
  KeyRound,
  FlameIcon as Fire,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import Link from "next/link"

const services = [
  {
    id: "security",
    title: "보안 서비스",
    icon: <ShieldCheck className="h-8 w-8" />,
    description: "안전하고 신뢰할 수 있는 보안 솔루션을 제공합니다.",
    image: "/placeholder.svg?height=300&width=400",
    features: ["출입 통제 시스템", "CCTV 설치 및 관리", "보안 시스템 컨설팅", "비상 연락망 구축"],
    benefits: ["사고 예방", "재산 보호", "안전한 환경 조성", "심리적 안정감 제공"],
    color: "blue",
  },
  {
    id: "cleaning",
    title: "청소 서비스",
    icon: <Spray className="h-8 w-8" />,
    description: "쾌적하고 깨끗한 환경을 만들어 드립니다.",
    image: "/placeholder.svg?height=300&width=400",
    features: ["정기 청소", "특수 청소", "소독 방역", "건물 관리"],
    benefits: ["쾌적한 환경", "위생적인 공간", "업무 효율성 향상", "건강 증진"],
    color: "green",
  },
  {
    id: "facility-management",
    title: "시설 관리",
    icon: <HomeIcon className="h-8 w-8" />,
    description: "건물 유지보수 및 관리를 전문적으로 수행합니다.",
    image: "/placeholder.svg?height=300&width=400",
    features: ["전기 설비 유지보수", "소방 설비 관리", "냉난방 시스템", "배관 설비 관리"],
    benefits: ["건물 가치 유지", "안전 사고 예방", "쾌적한 환경", "비용 절감"],
    color: "purple",
  },
  {
    id: "key-management",
    title: "키 관리",
    icon: <KeyRound className="h-8 w-8" />,
    description: "안전하고 효율적인 키 관리 시스템을 제공합니다.",
    image: "/placeholder.svg?height=300&width=400",
    features: ["키 복사 및 제작", "키 보관 및 관리", "긴급 대응", "디지털 키 시스템"],
    benefits: ["키 분실 방지", "보안 강화", "편리한 관리", "비용 절감"],
    color: "orange",
  },
  {
    id: "fire-inspection",
    title: "소방 점검",
    icon: <Fire className="h-8 w-8" />,
    description: "소방 시설 점검 및 관리로 화재 안전을 보장합니다.",
    image: "/placeholder.svg?height=300&width=400",
    features: ["소방 시설 정기 점검", "스프링클러 관리", "소방 안전 교육", "화재 대응 계획"],
    benefits: ["화재 위험 최소화", "법적 요구사항 준수", "보험료 절감", "안전 보장"],
    color: "red",
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-6">
              전문 서비스
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              건물 관리의 모든 것을
              <br />
              <span className="text-blue-600">한 번에 해결</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              SKM파트너스의 전문적인 서비스로 건물의 가치를 높이고 관리의 효율성을 극대화하세요.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
              무료 상담 신청하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">서비스 목록</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              각 분야의 전문가들이 제공하는 차별화된 서비스를 경험해보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <SafeImage
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackText={service.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div
                    className={`absolute top-4 left-4 w-12 h-12 bg-${service.color}-100 rounded-xl flex items-center justify-center`}
                  >
                    <div className={`text-${service.color}-600`}>{service.icon}</div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">주요 서비스</h4>
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-50" asChild>
                    <Link href={`/services/${service.id}`}>
                      자세히 보기
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">왜 SKM파트너스인가?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              수년간의 경험과 전문성으로 고객에게 최고의 서비스를 제공합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">전문성</h3>
              <p className="text-gray-600">
                각 분야별 전문가들이 최신 기술과 방법론을 적용하여 최고 품질의 서비스를 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">신뢰성</h3>
              <p className="text-gray-600">투명한 서비스 제공과 약속 이행으로 고객과의 신뢰 관계를 구축합니다.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">효율성</h3>
              <p className="text-gray-600">
                체계적인 관리 시스템과 프로세스로 효율적이고 경제적인 서비스를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">지금 바로 전문 상담을 받아보세요</h2>
            <p className="text-xl text-blue-100 mb-8">
              건물 관리 전문가가 직접 방문하여 맞춤형 솔루션을 제안해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                무료 상담 신청
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600"
              >
                서비스 문의
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
