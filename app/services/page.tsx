import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Building, Droplet, CableCarIcon as Elevator, FlameIcon as Fire, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <Image src="/placeholder.svg?height=300&width=1200" alt="Services" fill className="object-cover" priority />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">서비스</h1>
          <p className="text-lg text-white/90 max-w-xl">SKM파트너스의 전문적인 건물 관리 서비스를 소개합니다.</p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">서비스 목록</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "청소 서비스",
                icon: <Droplet className="h-8 w-8" />,
                description: "전문적인 청소 서비스로 건물의 청결을 유지합니다.",
                slug: "cleaning",
              },
              {
                title: "소방 관리",
                icon: <Fire className="h-8 w-8" />,
                description: "소방 시설 및 스프링클러 점검과 관리로 화재 안전을 보장합니다.",
                slug: "fire-inspection",
              },
              {
                title: "엘리베이터 관리",
                icon: <Elevator className="h-8 w-8" />,
                description: "정기적인 점검과 유지보수로 엘리베이터 안전을 확보합니다.",
                slug: "elevator-maintenance",
              },
              {
                title: "시설 유지보수",
                icon: <Wrench className="h-8 w-8" />,
                description: "건물 시설의 정기적인 점검과 유지보수 서비스를 제공합니다.",
                slug: "facility-maintenance",
              },
              {
                title: "건물 관리",
                icon: <Building className="h-8 w-8" />,
                description: "종합적인 건물 관리 서비스로 건물 가치를 높입니다.",
                slug: "building-management",
              },
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2 group-hover:bg-slate-200 transition-colors">
                    <div className="text-slate-700 group-hover:text-slate-900 transition-colors">{service.icon}</div>
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-slate-900 font-medium hover:underline inline-flex items-center"
                  >
                    자세히 보기 <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">서비스 상세 설명</h2>
          <Tabs defaultValue="cleaning" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="cleaning">청소 서비스</TabsTrigger>
              <TabsTrigger value="fire">소방 관리</TabsTrigger>
              <TabsTrigger value="elevator">엘리베이터 관리</TabsTrigger>
            </TabsList>
            <TabsContent value="cleaning" className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">청소 서비스</h3>
                  <p className="text-slate-600 mb-4">
                    SKM파트너스의 청소 서비스는 건물의 모든 공간을 깨끗하게 유지하는 데 중점을 둡니다. 로비, 복도,
                    화장실, 사무실 등 모든 공간에 대한 전문적인 청소 서비스를 제공합니다.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>일상 청소 및 정기 청소</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>특수 바닥 관리 (대리석, 마루 등)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>유리창 청소</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>카펫 및 의자 세척</span>
                    </li>
                  </ul>
                  <Button>문의하기</Button>
                </div>
                <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                  <Image src="/placeholder.svg?height=300&width=400" alt="청소 서비스" fill className="object-cover" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="fire" className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">소방 관리</h3>
                  <p className="text-slate-600 mb-4">
                    SKM파트너스의 소방 관리 서비스는 건물의 화재 안전을 위한 종합적인 솔루션을 제공합니다. 정기적인
                    점검과 유지보수를 통해 소방 시설의 정상 작동을 보장합니다.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>소방 시설 정기 점검</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>소방 설비 유지보수</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>스프링클러 시스템 점검 및 관리</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>소방 안전 교육</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>화재 대응 계획 수립</span>
                    </li>
                  </ul>
                  <Button>문의하기</Button>
                </div>
                <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                  <Image src="/placeholder.svg?height=300&width=400" alt="소방 관리" fill className="object-cover" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="elevator" className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">엘리베이터 관리</h3>
                  <p className="text-slate-600 mb-4">
                    SKM파트너스의 엘리베이터 관리 서비스는 건물 내 엘리베이터의 안전하고 효율적인 운영을 보장합니다.
                    정기적인 점검과 유지보수를 통해 엘리베이터의 수명을 연장하고 안전성을 높입니다.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>정기 안전 점검</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>부품 교체 및 유지보수</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>24시간 비상 대응</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-1 text-green-500">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>엘리베이터 현대화 컨설팅</span>
                    </li>
                  </ul>
                  <Button>문의하기</Button>
                </div>
                <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="엘리베이터 관리"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">전문적인 건물 관리 서비스가 필요하신가요?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            SKM파트너스와 함께 건물 관리의 모든 고민을 해결하세요.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-slate-900 group"
          >
            지금 문의하기
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </main>
  )
}
