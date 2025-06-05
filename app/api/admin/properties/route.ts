import { NextResponse } from "next/server"

// 메모리 기반 임시 저장소 (테스트용)
let propertiesStore: any[] = []

// 부동산 매물 목록 조회
export async function GET() {
  console.log("=== GET /api/admin/properties ===")
  console.log("현재 저장된 매물:", propertiesStore.length, "개")

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
      id: propertiesStore.length + 1,
      title: body.title,
      location: body.location,
      type: body.type || "오피스",
      size: body.size || "",
      price: body.price || "",
      description: body.description || "",
      image_url: body.image_url || "",
      status: "활성",
      createdAt: new Date().toISOString(),
    }

    console.log("생성할 매물:", newProperty)

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
