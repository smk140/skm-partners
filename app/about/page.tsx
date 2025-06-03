import Image from "next/image"
import { ArrowRight, Award, CheckCircle2, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image
          src="/placeholder.svg?height=400&width=1200&text=About Us"
          alt="회사 소개"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">회사 소개</h1>
          <p className="text-lg text-white/90 max-w-xl">
            SKM파트너스는 건물 관리와 부동산 임대 대행 전문 기업으로, 고객의 자산 가치를 높이는 최고의 파트너입니다.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-blue-600">SKM파트너스 소개</h2>
              <p className="text-slate-600 mb-6">
                SKM파트너스는 2010년 설립된 건물 관리 및 부동산 임대 대행 전문 기업입니다. 10년 이상의 경험과 노하우를
                바탕으로 고객의 자산 가치를 높이는 최고의 파트너로 자리매김하고 있습니다.
              </p>
              <p className="text-slate-600 mb-6">
                건물 청소, 소방 점검, 엘리베이터 관리 등 건물 관리의 모든 영역에서 전문적인 서비스를 제공하며, 공실 임대
                대행을 통해 건물 소유주의 수익을 극대화하는 데 기여하고 있습니다.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">10년+ 경험</span>
                </div>
                <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">500+ 고객사</span>
                </div>
                <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium">98% 고객 만족도</span>
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
                src="/placeholder.svg?height=400&width=600&text=Company Image"
                alt="SKM파트너스"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">비전 & 미션</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              SKM파트너스는 건물 관리와 부동산 서비스의 새로운 기준을 제시합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-50 to-white border-t-4 border-blue-600">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">비전</h3>
                <p className="text-slate-600 mb-6">
                  "건물 관리와 부동산 서비스의 새로운 기준을 제시하여 고객의 자산 가치를 극대화하는 최고의 파트너가
                  된다."
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>고객 중심의 서비스 제공</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>지속적인 혁신과 발전</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>업계 최고의 전문성 확보</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white border-t-4 border-blue-600">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">미션</h3>
                <p className="text-slate-600 mb-6">
                  "전문적인 건물 관리와 부동산 서비스를 통해 고객의 자산 가치를 높이고, 안전하고 쾌적한 환경을
                  조성한다."
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>고객 자산 가치 극대화</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>안전하고 쾌적한 환경 조성</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>지속 가능한 건물 관리 실현</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">핵심 가치</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              SKM파트너스의 모든 서비스와 활동은 다음의 핵심 가치를 바탕으로 합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Award className="h-12 w-12 text-blue-600" />,
                title: "전문성",
                description:
                  "건물 관리와 부동산 서비스에 대한 깊은 전문 지식과 경험을 바탕으로 최고의 서비스를 제공합니다.",
              },
              {
                icon: <CheckCircle2 className="h-12 w-12 text-blue-600" />,
                title: "신뢰성",
                description: "약속을 지키고 투명하게 소통하여 고객의 신뢰를 얻는 것을 최우선으로 합니다.",
              },
              {
                icon: <Users className="h-12 w-12 text-blue-600" />,
                title: "고객 중심",
                description: "고객의 니즈를 정확히 파악하고 맞춤형 솔루션을 제공하여 고객 만족을 실현합니다.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="mx-auto mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">경영진 소개</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">SKM파트너스를 이끌어가는 전문가들을 소개합니다.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "김대표",
                position: "대표이사",
                bio: "건물 관리 업계에서 20년 이상의 경험을 가진 전문가로, SKM파트너스를 설립하여 업계를 선도하고 있습니다.",
                image: "/placeholder.svg?height=300&width=300&text=CEO",
              },
              {
                name: "이부장",
                position: "운영 이사",
                bio: "15년 이상의 건물 관리 경험을 바탕으로 SKM파트너스의 운영을 총괄하고 있습니다.",
                image: "/placeholder.svg?height=300&width=300&text=COO",
              },
              {
                name: "박이사",
                position: "부동산 이사",
                bio: "부동산 업계에서 10년 이상의 경험을 가진 전문가로, SKM파트너스의 부동산 서비스를 이끌고 있습니다.",
                image: "/placeholder.svg?height=300&width=300&text=CRO",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-blue-600"
              >
                <div className="relative h-64">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.position}</p>
                  <p className="text-slate-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">SKM파트너스와 함께하세요</h2>
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
