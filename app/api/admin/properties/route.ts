import { NextResponse } from "next/server"
import { getPropertiesData, savePropertiesData, generateId } from "@/lib/file-db"

// 부동산 매물 목록 조회
export async function GET() {
  console.log("=== 부동산 매물 조회 API 시작 ===")
  try {
    const data = getPropertiesData()
    console.log("📊 조회된 매물 데이터:", data)
    console.log("📊 매물 개수:", data.properties?.length || 0)

    return NextResponse.json({
      success: true,
      properties: data.properties || [],
      total: data.properties?.length || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 매물 조회 실패:", error)
    return NextResponse.json(
      {
        error: "매물 조회 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        success: false,
        properties: [],
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 추가
export async function POST(request: Request) {
  console.log("=== 부동산 매물 추가 API 시작 ===")
  try {
    const requestData = await request.json()
    console.log("📥 받은 매물 데이터:", requestData)

    // 필수 필드 검증
    if (!requestData.title || !requestData.location) {
      console.log("❌ 필수 필드 누락")
      return NextResponse.json({ error: "매물명과 위치는 필수입니다.", success: false }, { status: 400 })
    }

    // 현재 데이터 로드
    const currentData = getPropertiesData()
    console.log("📂 현재 매물 개수:", currentData.properties?.length || 0)

    // 새 매물 생성
    const newProperty = {
      id: generateId(currentData.properties || []),
      title: requestData.title,
      location: requestData.location,
      type: requestData.type || "오피스",
      size: requestData.size || "",
      price: requestData.price || "",
      description: requestData.description || "",
      image_url: requestData.image_url || "",
      status: "활성",
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("🆕 생성할 매물:", newProperty)

    // 매물 배열에 추가
    const updatedProperties = [...(currentData.properties || []), newProperty]
    console.log("📝 업데이트된 매물 배열 길이:", updatedProperties.length)

    // 저장
    const saveResult = savePropertiesData({
      properties: updatedProperties,
      last_updated: new Date().toISOString(),
    })

    console.log("💾 저장 결과:", saveResult)

    if (!saveResult) {
      console.error("💥 저장 실패")
      return NextResponse.json({ error: "매물 저장에 실패했습니다.", success: false }, { status: 500 })
    }

    console.log("✅ 매물 추가 성공!")
    return NextResponse.json({
      success: true,
      property: newProperty,
      message: "매물이 성공적으로 추가되었습니다.",
      total: updatedProperties.length,
    })
  } catch (error) {
    console.error("💥 매물 추가 API 오류:", error)
    return NextResponse.json(
      {
        error: "매물 추가 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        success: false,
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 삭제
export async function DELETE(request: Request) {
  console.log("=== 부동산 매물 삭제 API 시작 ===")
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get("id")
    const id = idParam ? Number.parseInt(idParam) : 0

    console.log("🗑️ 삭제할 매물 ID:", id)

    if (!id) {
      return NextResponse.json({ error: "매물 ID가 필요합니다.", success: false }, { status: 400 })
    }

    const currentData = getPropertiesData()
    const initialCount = currentData.properties?.length || 0

    const updatedProperties = (currentData.properties || []).filter((property: any) => property.id !== id)

    if (updatedProperties.length === initialCount) {
      return NextResponse.json({ error: "삭제할 매물을 찾을 수 없습니다.", success: false }, { status: 404 })
    }

    const saveResult = savePropertiesData({
      properties: updatedProperties,
      last_updated: new Date().toISOString(),
    })

    if (!saveResult) {
      return NextResponse.json({ error: "매물 삭제 후 저장에 실패했습니다.", success: false }, { status: 500 })
    }

    console.log("✅ 매물 삭제 성공!")
    return NextResponse.json({
      success: true,
      message: "매물이 성공적으로 삭제되었습니다.",
      total: updatedProperties.length,
    })
  } catch (error) {
    console.error("💥 매물 삭제 API 오류:", error)
    return NextResponse.json(
      {
        error: "매물 삭제 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        success: false,
      },
      { status: 500 },
    )
  }
}
