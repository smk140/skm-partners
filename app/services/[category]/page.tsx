import { FlameIcon as Fire, HomeIcon, KeyRound, ShieldCheck, SprayCanIcon as Spray } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const serviceCategories = {
  security: {
    title: "보안",
    icon: <ShieldCheck className="h-8 w-8" />,
    description: "안전하고 신뢰할 수 있는 보안 솔루션을 제공합니다.",
    details: [
      "출입 통제 시스템 설치 및 유지보수",
      "CCTV 설치 및 유지보수",
      "보안 시스템 컨설팅",
      "비상 연락망 구축",
      "보안 교육",
    ],
    benefits: ["사고 예방", "재산 보호", "안전한 환경 조성", "심리적 안정감 제공"],
  },
  cleaning: {
    title: "청소",
    icon: <Spray className="h-8 w-8" />,
    description: "쾌적하고 깨끗한 환경을 만들어 드립니다.",
    details: ["정기 청소", "특수 청소", "소독 방역", "건물 관리"],
    benefits: ["쾌적한 환경", "위생적인 공간", "업무 효율성 향상", "건강 증진"],
  },
  "facility-management": {
    title: "시설 관리",
    icon: <HomeIcon className="h-8 w-8" />,
    description: "건물 유지보수 및 관리를 전문적으로 수행합니다.",
    details: [
      "전기 설비 유지보수",
      "소방 설비 유지보수",
      "냉난방 설비 유지보수",
      "배관 설비 유지보수",
      "건물 외관 관리",
    ],
    benefits: ["건물 가치 유지", "안전 사고 예방", "쾌적한 환경 조성", "비용 절감"],
  },
  "key-management": {
    title: "키 관리",
    icon: <KeyRound className="h-8 w-8" />,
    description: "안전하고 효율적인 키 관리 시스템을 제공합니다.",
    details: ["키 복사 및 제작", "키 보관 및 관리", "키 분실 시 긴급 대응", "디지털 키 시스템 구축"],
    benefits: ["키 분실 방지", "보안 강화", "편리한 키 관리", "비용 절감"],
  },
  "fire-inspection": {
    title: "소방 점검",
    icon: <Fire className="h-8 w-8" />,
    description: "소방 시설 점검 및 관리로 화재 안전을 보장합니다.",
    details: [
      "소방 시설 정기 점검",
      "소방 설비 유지보수",
      "스프링클러 시스템 점검 및 관리",
      "소방 안전 교육",
      "화재 대응 계획 수립",
      "소방 시설 개선 컨설팅",
    ],
    benefits: ["화재 위험 최소화", "법적 요구사항 준수", "보험료 절감 가능", "입주자 안전 보장"],
  },
}

interface ServiceCategoryPageProps {
  params: {
    category: string
  }
}

export default function ServiceCategoryPage({ params }: ServiceCategoryPageProps) {
  const category = params.category
  const service = serviceCategories[category]

  if (!service) {
    return <div>Service category not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            {service.icon}
            <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
          </div>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <h3 className="text-xl font-semibold mb-2">세부 사항</h3>
          <ul className="list-disc list-inside">
            {service.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
          <Separator className="my-4" />
          <h3 className="text-xl font-semibold mb-2">혜택</h3>
          <ul className="list-disc list-inside">
            {service.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
          <Separator className="my-4" />
          <Button>문의하기</Button>
        </CardContent>
      </Card>
    </div>
  )
}
