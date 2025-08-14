import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Award, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">SKM파트너스</h1>
              <div className="text-lg text-gray-600 space-y-4 mb-8">
                <p>
                  SKM파트너스는 수많은 건축 경험을 통해 축적된 실무 노하우를 바탕으로, 시행부터 시공, 관리까지 원스톱
                  서비스를 제공하는 부동산 통합 솔루션 기업입니다.
                </p>
                <p>
                  단순한 건물 관리가 아닌, 공간의 기획부터 운영까지 전 과정을 아우르는 맞춤형 서비스를 통해 고객의 자산
                  가치를 극대화하고, 사업이 안정적이고 지속 가능한 방향으로 성장할 수 있도록 함께 하겠습니다.
                </p>
              </div>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">무료 상담 신청</Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/modern-office-building.png"
                alt="Modern office building"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 우리의 가치 Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">우리의 가치</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
              "설계부터 관리까지, 고객의 니즈를 이해하고 실행하는 파트너"
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              SKM파트너스는 2025년 설립되었지만, 그 이전 10년 이상의 건축 및 부동산 운영 경험을 바탕으로 임대인의 자산을
              더 가치 있게, 더 안전하게 만들기 위한 솔루션을 지속적으로 제공해오고 있습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">01 최고의 서비스 구현</h3>
                <p className="text-gray-600 leading-relaxed">
                  설계, 시공, 운영, 리노베이션, 법률 자문까지 부동산의 전 생애주기를 아우르는 통합 서비스를 통해
                  임대인의 니즈를 정확히 파악하고, 현실적이고 실행 가능한 대안을 제시합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">02 안전한 건물 관리</h3>
                <p className="text-gray-600 leading-relaxed">
                  건축 및 시공 분야에서 축적한 현장 경험과 기술 노하우를 바탕으로 건물 하자 및 유지보수 이슈에
                  선제적으로 대응하여 리스크를 최소화합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">03 고객의 만족 추구</h3>
                <p className="text-gray-600 leading-relaxed">
                  우리는 단순한 관리 대행을 넘어 공실 없는 건물과 안정적인 임대 수익 실현을 함께 고민하는 신뢰받는
                  파트너가 되겠습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Image Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/professional-office-workspace.png"
                alt="Professional office workspace"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">전문적인 업무환경</h2>
              <div className="text-lg text-gray-600 space-y-4 mb-8">
                <p>
                  최신 기술과 체계적인 프로세스를 바탕으로 고객에게 최고의 서비스를 제공합니다. 전문성과 신뢰성을
                  바탕으로 한 파트너십을 통해 고객의 성공을 함께 만들어갑니다.
                </p>
              </div>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">서비스 자세히 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">지금 바로 무료 상담을 받아보세요</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            전문가와의 상담을 통해 귀하의 부동산 프로젝트에 최적화된 솔루션을 찾아보세요.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/contact">무료 상담 신청</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
