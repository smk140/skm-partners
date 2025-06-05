import { NextResponse } from "next/server"
import { getPropertiesData, savePropertiesData, generateId } from "@/lib/file-db"

// 부동산 매물 목록 조회
export async function GET() {
  console.log("=== 📋 매물 조회 API 시작 ===")
  try {
    const data = getPropertiesData()
    console.log("📊 조회된 매물:", data)

    // 데이터 구조 확인
    if (!data || typeof data !== "object") {
      console.warn("⚠️ 잘못된 데이터 구조, 기본값 반환")
      return NextResponse.json({
        success: true,
        properties: [],
        total: 0,
        message: "데이터 구조 초기화됨",
      })
    }

    const properties = Array.isArray(data.properties) ? data.properties : []
    console.log("✅ 매물 개수:", properties.length)

    return NextResponse.json({
      success: true,
      properties: properties,
      total: properties.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 매물 조회 실패:", error)
    return NextResponse.json(
      {
        success: false,
        error: "매물 조회 중 오류가 발생했습니다.",
        properties: [],
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 추가
export async function POST(request: Request) {
  console.log("=== 🆕 매물 추가 API 시작 ===")
  try {
    const requestData = await request.json()
    console.log("📥 받은 요청 데이터:", requestData)

    // 필수 필드 검증
    if (!requestData.title?.trim() || !requestData.location?.trim()) {
      console.log("❌ 필수 필드 누락")
      return NextResponse.json(
        {
          success: false,
          error: "매물명과 위치는 필수입니다.",
        },
        { status: 400 },
      )
    }

    // 현재 데이터 로드
    const currentData = getPropertiesData()
    console.log("📂 현재 데이터:", currentData)

    const currentProperties = Array.isArray(currentData.properties) ? currentData.properties : []
    console.log("📂 현재 매물 개수:", currentProperties.length)

    // 새 매물 생성
    const newId = generateId(currentProperties)
    const newProperty = {
      id: newId,
      title: requestData.title.trim(),
      location: requestData.location.trim(),
      type: requestData.type || "오피스",
      size: requestData.size?.trim() || "",
      price: requestData.price?.trim() || "",
      description: requestData.description?.trim() || "",
      image_url: requestData.image_url?.trim() || "",
      status: "활성",
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("🆕 생성할 매물:", newProperty)

    // 매물 배열에 추가
    const updatedProperties = [...currentProperties, newProperty]
    console.log("📝 업데이트된 매물 배열 길이:", updatedProperties.length)

    // 저장
    const saveData = {
      properties: updatedProperties,
      last_updated: new Date().toISOString(),
    }

    console.log("💾 저장할 데이터:", saveData)
    const saveResult = savePropertiesData(saveData)
    console.log("💾 저장 결과:", saveResult)

    if (!saveResult) {
      console.error("💥 저장 실패")
      return NextResponse.json(
        {
          success: false,
          error: "매물 저장에 실패했습니다.",
        },
        { status: 500 },
      )
    }

    // 저장 후 검증
    const verificationData = getPropertiesData()
    const verificationProperties = Array.isArray(verificationData.properties) ? verificationData.properties : []
    console.log("🔍 저장 후 검증 - 매물 개수:", verificationProperties.length)

    const savedProperty = verificationProperties.find((p) => p.id === newId)
    if (!savedProperty) {
      console.error("💥 저장 검증 실패 - 매물을 찾을 수 없음")
      return NextResponse.json(
        {
          success: false,
          error: "매물 저장 검증에 실패했습니다.",
        },
        { status: 500 },
      )
    }

    console.log("✅ 매물 추가 및 검증 완료!")
    return NextResponse.json({
      success: true,
      property: savedProperty,
      message: "매물이 성공적으로 추가되었습니다.",
      total: verificationProperties.length,
    })
  } catch (error) {
    console.error("💥 매물 추가 API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "매물 추가 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 삭제
export async function DELETE(request: Request) {
  console.log("=== 🗑️ 매물 삭제 API 시작 ===")
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get("id")
    const id = idParam ? Number.parseInt(idParam) : 0

    console.log("🗑️ 삭제할 매물 ID:", id)

    if (!id || isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효한 매물 ID가 필요합니다.",
        },
        { status: 400 },
      )
    }

    const currentData = getPropertiesData()
    const currentProperties = Array.isArray(currentData.properties) ? currentData.properties : []
    const initialCount = currentProperties.length

    console.log("📂 삭제 전 매물 개수:", initialCount)

    const updatedProperties = currentProperties.filter((property: any) => property.id !== id)
    console.log("📂 삭제 후 매물 개수:", updatedProperties.length)

    if (updatedProperties.length === initialCount) {
      console.warn("⚠️ 삭제할 매물을 찾을 수 없음")
      return NextResponse.json(
        {
          success: false,
          error: "삭제할 매물을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    const saveResult = savePropertiesData({
      properties: updatedProperties,
      last_updated: new Date().toISOString(),
    })

    if (!saveResult) {
      console.error("💥 삭제 후 저장 실패")
      return NextResponse.json(
        {
          success: false,
          error: "매물 삭제 후 저장에 실패했습니다.",
        },
        { status: 500 },
      )
    }

    console.log("✅ 매물 삭제 완료!")
    return NextResponse.json({
      success: true,
      message: "매물이 성공적으로 삭제되었습니다.",
      total: updatedProperties.length,
    })
  } catch (error) {
    console.error("💥 매물 삭제 API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "매물 삭제 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
