import { NextResponse } from "next/server"

// 외부에서 propertiesStore에 접근하기 위해 임시로 하드코딩
// 실제로는 데이터베이스나 파일 시스템을 사용해야 합니다
let propertiesStore: any[] = [
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log("=== GET /api/admin/properties/[id] ===")
  console.log("요청된 매물 ID:", params.id)

  try {
    const id = Number(params.id)

    if (!id || isNaN(id)) {
      console.log("❌ 잘못된 ID 형식")
      return NextResponse.json(
        {
          success: false,
          error: "유효한 매물 ID가 필요합니다.",
        },
        { status: 400 },
      )
    }

    // 전체 매물 목록에서 해당 ID 찾기
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/properties`,
      {
        method: "GET",
        cache: "no-store",
      },
    )

    if (response.ok) {
      const data = await response.json()
      if (data.success && Array.isArray(data.properties)) {
        propertiesStore = data.properties
      }
    }

    const property = propertiesStore.find((p) => p.id === id)

    if (!property) {
      console.log("❌ 매물을 찾을 수 없음")
      return NextResponse.json(
        {
          success: false,
          error: "매물을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    console.log("✅ 매물 조회 성공:", property.title)
    console.log("이미지 URL:", property.image_url)

    return NextResponse.json({
      success: true,
      property: property,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 매물 조회 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "매물 조회 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
