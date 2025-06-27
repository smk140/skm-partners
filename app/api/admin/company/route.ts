import { NextResponse } from "next/server"
import { readFileDB, writeFileDB } from "@/lib/file-db"

interface CompanyData {
  name: string
  description: string
  mission: string
  vision: string
  values: string[]
  history: string
  ceoMessage: string
  logoUrl: string
  heroImageUrl: string
  teamImageUrl: string
  officeImageUrl: string
  certifications: string[]
  awards: string[]
  partnerships: string[]
  contactInfo: {
    address: string
    phone: string
    email: string
    businessHours: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
}

const defaultCompanyData: CompanyData = {
  name: "SKM파트너스",
  description: "전문적인 부동산 컨설팅과 투자 서비스를 제공하는 신뢰할 수 있는 파트너입니다.",
  mission: "고객의 성공적인 부동산 투자를 위한 최고의 서비스를 제공합니다.",
  vision: "부동산 업계의 혁신을 선도하는 글로벌 기업이 되겠습니다.",
  values: ["신뢰", "전문성", "혁신", "고객중심", "투명성"],
  history: "2020년 설립 이후 지속적인 성장을 통해 업계 선도기업으로 자리잡았습니다.",
  ceoMessage: "고객의 꿈을 실현하는 것이 저희의 사명입니다.",
  logoUrl: "",
  heroImageUrl: "",
  teamImageUrl: "",
  officeImageUrl: "",
  certifications: ["부동산 중개업 면허", "투자자문업 등록"],
  awards: ["2023년 우수 부동산 기업상", "고객만족도 1위"],
  partnerships: ["주요 건설사", "금융기관", "법무법인"],
  contactInfo: {
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    email: "info@skmpartners.co.kr",
    businessHours: "평일 09:00-18:00",
  },
  socialMedia: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
}

export async function GET() {
  try {
    console.log("🏢 회사 정보 조회 요청")

    const data = await readFileDB<CompanyData>("company.json")

    if (!data) {
      console.log("📝 기본 회사 정보 반환")
      return NextResponse.json({
        success: true,
        data: defaultCompanyData,
      })
    }

    console.log("✅ 회사 정보 조회 성공")
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("💥 회사 정보 조회 실패:", error)
    return NextResponse.json(
      {
        success: false,
        error: "회사 정보를 불러올 수 없습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("🏢 회사 정보 업데이트 요청")

    const body = await request.json()
    console.log("📝 업데이트할 데이터:", Object.keys(body))

    // 데이터 검증
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json({ success: false, error: "회사명은 필수입니다." }, { status: 400 })
    }

    // 기존 데이터 읽기
    const existingData = await readFileDB<CompanyData>("company.json")

    // 새 데이터와 병합
    const updatedData: CompanyData = {
      ...defaultCompanyData,
      ...existingData,
      ...body,
      // 중첩 객체는 별도로 병합
      contactInfo: {
        ...defaultCompanyData.contactInfo,
        ...(existingData?.contactInfo || {}),
        ...(body.contactInfo || {}),
      },
      socialMedia: {
        ...defaultCompanyData.socialMedia,
        ...(existingData?.socialMedia || {}),
        ...(body.socialMedia || {}),
      },
    }

    // 파일에 저장
    await writeFileDB("company.json", updatedData)

    console.log("✅ 회사 정보 업데이트 성공")
    return NextResponse.json({
      success: true,
      data: updatedData,
      message: "회사 정보가 성공적으로 업데이트되었습니다.",
    })
  } catch (error) {
    console.error("💥 회사 정보 업데이트 실패:", error)
    return NextResponse.json(
      {
        success: false,
        error: "회사 정보 업데이트에 실패했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
