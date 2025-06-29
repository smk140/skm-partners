import { type NextRequest, NextResponse } from "next/server"
import { getPropertiesData, addProperty } from "@/lib/file-db"

// 메모리 기반 저장소 - 전역 변수로 관리
const propertiesStore: any[] = [
  // 샘플 데이터
  {
    id: 1,
    title: "강남 프리미엄 오피스",
    location: "서울시 강남구 테헤란로",
    type: "오피스",
    size: "100평",
    price: "월 500만원",
    description: "강남역 도보 5분 거리의 프리미엄 오피스 공간입니다. 최신 시설과 편의시설이 완비되어 있습니다.",
    image_url: "/placeholder.svg?height=400&width=600&text=강남+프리미엄+오피스",
    status: "활성",
    createdAt: new Date().toISOString(),
    features: ["주차장", "엘리베이터", "24시간 보안", "카페테리아"],
    contact: {
      manager: "김부동산",
      phone: "02-123-4567",
      email: "contact@skm.kr",
    },
  },
  {
    id: 2,
    title: "홍대 상권 상가",
    location: "서울시 마포구 홍익로",
    type: "상가",
    size: "50평",
    price: "월 300만원",
    description: "홍대 핫플레이스 중심가의 1층 상가입니다. 유동인구가 많고 접근성이 뛰어납니다.",
    image_url: "/placeholder.svg?height=400&width=600&text=홍대+상권+상가",
    status: "활성",
    createdAt: new Date().toISOString(),
    features: ["1층", "대로변", "지하철역 근처", "주차 가능"],
    contact: {
      manager: "SKM파트너스",
      phone: "02-123-4567",
      email: "bykim@skm.kr",
    },
  },
  {
    id: 3,
    title: "판교 IT 오피스텔",
    location: "경기도 성남시 분당구 판교역로",
    type: "오피스텔",
    size: "30평",
    price: "월 200만원",
    description: "판교 테크노밸리 인근의 신축 오피스텔입니다. IT 기업들이 밀집한 지역으로 네트워킹에 유리합니다.",
    image_url: "/placeholder.svg?height=400&width=600&text=판교+IT+오피스텔",
    status: "활성",
    createdAt: new Date().toISOString(),
    features: ["신축", "IT 밸리", "지하철 연결", "카페 많음"],
    contact: {
      manager: "SKM파트너스",
      phone: "02-123-4567",
      email: "bykim@skm.kr",
    },
  },
]

// 부동산 매물 목록 조회
export async function GET() {
  try {
    console.log("=== 부동산 목록 조회 API 호출 ===")

    const properties = await getPropertiesData()

    console.log("조회된 부동산 수:", properties.length)

    return NextResponse.json({
      success: true,
      properties: properties,
    })
  } catch (error) {
    console.error("부동산 목록 조회 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 부동산 매물 추가
export async function POST(request: NextRequest) {
  try {
    console.log("=== 부동산 등록 API 호출 ===")

    const body = await request.json()
    console.log("받은 데이터:", body)

    const { title, description, price, location, imageUrl } = body

    // 필수 필드 검증
    if (!title || !description || !price || !location) {
      console.log("필수 필드 누락:", { title, description, price, location })
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 })
    }

    // GitHub에 저장
    const result = await addProperty({
      title,
      description,
      price: Number(price),
      location,
      imageUrl: imageUrl || "",
    })

    if (result.success) {
      console.log("부동산 저장 성공")
      return NextResponse.json({
        success: true,
        message: "부동산이 성공적으로 등록되었습니다.",
      })
    } else {
      return NextResponse.json({ error: result.error || "부동산 등록에 실패했습니다." }, { status: 500 })
    }
  } catch (error) {
    console.error("부동산 등록 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 부동산 매물 삭제
export async function DELETE(request: NextRequest) {
  console.log("=== DELETE /api/admin/properties ===")

  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get("id")
    const id = Number(idParam)

    console.log("삭제 요청 - 원본 ID 파라미터:", idParam)
    console.log("삭제 요청 - 변환된 ID:", id)

    if (!idParam || isNaN(id) || id <= 0) {
      console.log("❌ 잘못된 ID:", idParam)
      return NextResponse.json(
        {
          success: false,
          error: "유효한 매물 ID가 필요합니다.",
        },
        { status: 400 },
      )
    }

    console.log("삭제 전 매물 목록:")
    propertiesStore.forEach((property, index) => {
      console.log(`  ${index + 1}. ID=${property.id}, 제목=${property.title}`)
    })

    // 삭제할 매물 찾기
    const propertyIndex = propertiesStore.findIndex((property) => property.id === id)

    if (propertyIndex === -1) {
      console.log("❌ 삭제할 매물을 찾을 수 없음. ID:", id)
      return NextResponse.json(
        {
          success: false,
          error: "삭제할 매물을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    // 삭제할 매물 정보 로깅
    const propertyToDelete = propertiesStore[propertyIndex]
    console.log("삭제할 매물:", propertyToDelete.title, "(ID:", propertyToDelete.id, ")")

    // 매물 삭제 (splice 사용)
    const deletedProperty = propertiesStore.splice(propertyIndex, 1)[0]

    console.log("삭제 완료:", deletedProperty.title)
    console.log("삭제 후 남은 매물 수:", propertiesStore.length)

    console.log("삭제 후 매물 목록:")
    propertiesStore.forEach((property, index) => {
      console.log(`  ${index + 1}. ID=${property.id}, 제목=${property.title}`)
    })

    return NextResponse.json({
      success: true,
      message: `매물 "${deletedProperty.title}"이 성공적으로 삭제되었습니다.`,
      deletedProperty: {
        id: deletedProperty.id,
        title: deletedProperty.title,
      },
      total: propertiesStore.length,
    })
  } catch (error) {
    console.error("💥 매물 삭제 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
