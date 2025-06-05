import { NextResponse } from "next/server"

// 메모리 기반 저장소 (파일 URL 포함)
let propertiesStore: any[] = [
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
]

// 부동산 매물 목록 조회
export async function GET() {
  console.log("=== GET /api/admin/properties ===")
  console.log("현재 저장된 매물:", propertiesStore.length, "개")

  // 이미지 URL 로깅
  propertiesStore.forEach((property, index) => {
    console.log(`매물 ${index + 1} 이미지:`, property.image_url || "없음")
  })

  return NextResponse.json({
    success: true,
    properties: propertiesStore,
    total: propertiesStore.length,
    timestamp: new Date().toISOString(),
  })
}

// 부동산 매물 추가
export async function POST(request: Request) {
  console.log("=== POST /api/admin/properties ===")

  try {
    const body = await request.json()
    console.log("받은 데이터:", body)

    // 필수 필드 검증
    if (!body.title || !body.location) {
      console.log("필수 필드 누락")
      return NextResponse.json(
        {
          success: false,
          error: "매물명과 위치는 필수입니다.",
        },
        { status: 400 },
      )
    }

    // 새 매물 생성
    const newProperty = {
      id: Math.max(0, ...propertiesStore.map((p) => p.id)) + 1,
      title: body.title,
      location: body.location,
      type: body.type || "오피스",
      size: body.size || "",
      price: body.price || "",
      description: body.description || "",
      image_url: body.image_url || "", // 파일 URL 저장
      status: "활성",
      createdAt: new Date().toISOString(),
      features: body.features || [],
      contact: {
        manager: "SKM파트너스",
        phone: "02-123-4567",
        email: "bykim@skm.kr",
      },
    }

    console.log("생성할 매물:", newProperty)
    console.log("이미지 URL:", newProperty.image_url)

    // 메모리에 저장
    propertiesStore.push(newProperty)
    console.log("저장 완료. 총 매물 수:", propertiesStore.length)

    return NextResponse.json({
      success: true,
      property: newProperty,
      message: "매물이 성공적으로 추가되었습니다.",
      total: propertiesStore.length,
    })
  } catch (error) {
    console.error("매물 추가 오류:", error)
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

// 부동산 매물 삭제
export async function DELETE(request: Request) {
  console.log("=== DELETE /api/admin/properties ===")

  try {
    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get("id"))

    console.log("삭제할 매물 ID:", id)

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "매물 ID가 필요합니다.",
        },
        { status: 400 },
      )
    }

    const initialLength = propertiesStore.length
    propertiesStore = propertiesStore.filter((property) => property.id !== id)

    if (propertiesStore.length === initialLength) {
      return NextResponse.json(
        {
          success: false,
          error: "삭제할 매물을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    console.log("삭제 완료. 남은 매물 수:", propertiesStore.length)

    return NextResponse.json({
      success: true,
      message: "매물이 성공적으로 삭제되었습니다.",
      total: propertiesStore.length,
    })
  } catch (error) {
    console.error("매물 삭제 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
