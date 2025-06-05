import { NextResponse } from "next/server"
import { getPropertiesData, savePropertiesData, generateId } from "@/lib/file-db"

// 부동산 매물 목록 조회
export async function GET() {
  try {
    console.log("=== 부동산 매물 조회 시작 ===")
    const data = getPropertiesData()
    console.log("📊 조회된 매물 수:", data.properties?.length || 0)
    console.log("📋 매물 데이터:", JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      properties: data.properties || [],
      total: data.properties?.length || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 부동산 매물 조회 중 오류:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        success: false,
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 추가
export async function POST(request: Request) {
  try {
    console.log("=== 부동산 매물 추가 시작 ===")
    const propertyData = await request.json()
    console.log("📝 받은 매물 데이터:", JSON.stringify(propertyData, null, 2))

    const data = getPropertiesData()
    console.log("📊 기존 매물 수:", data.properties?.length || 0)

    const newProperty = {
      id: generateId(data.properties || []),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "활성",
      ...propertyData,
    }

    console.log("🆕 새 매물 데이터:", JSON.stringify(newProperty, null, 2))

    if (!data.properties) {
      data.properties = []
    }

    data.properties.push(newProperty)
    console.log("📊 저장할 총 매물 수:", data.properties.length)

    const success = savePropertiesData(data)
    console.log("💾 저장 결과:", success)

    if (!success) {
      console.error("❌ 매물 저장 실패")
      return NextResponse.json({ error: "부동산 매물 저장에 실패했습니다." }, { status: 500 })
    }

    console.log("✅ 매물 추가 완료")
    return NextResponse.json({
      success: true,
      property: newProperty,
      message: "매물이 성공적으로 추가되었습니다.",
    })
  } catch (error) {
    console.error("💥 부동산 매물 추가 중 오류:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 수정
export async function PUT(request: Request) {
  try {
    console.log("=== 부동산 매물 수정 시작 ===")
    const { id, ...updateData } = await request.json()
    console.log("🔄 수정할 매물 ID:", id)
    console.log("📝 수정 데이터:", JSON.stringify(updateData, null, 2))

    const data = getPropertiesData()

    const index = data.properties?.findIndex((property: any) => property.id === id) ?? -1
    console.log("📍 매물 인덱스:", index)

    if (index === -1) {
      console.error("❌ 매물을 찾을 수 없음")
      return NextResponse.json({ error: "해당 매물을 찾을 수 없습니다." }, { status: 404 })
    }

    data.properties[index] = {
      ...data.properties[index],
      ...updateData,
      updated_at: new Date().toISOString(),
    }

    console.log("🔄 수정된 매물:", JSON.stringify(data.properties[index], null, 2))

    const success = savePropertiesData(data)
    console.log("💾 저장 결과:", success)

    if (!success) {
      console.error("❌ 매물 수정 저장 실패")
      return NextResponse.json({ error: "부동산 매물 업데이트에 실패했습니다." }, { status: 500 })
    }

    console.log("✅ 매물 수정 완료")
    return NextResponse.json({
      success: true,
      property: data.properties[index],
      message: "매물이 성공적으로 수정되었습니다.",
    })
  } catch (error) {
    console.error("💥 부동산 매물 수정 중 오류:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 삭제
export async function DELETE(request: Request) {
  try {
    console.log("=== 부동산 매물 삭제 시작 ===")
    const { searchParams } = new URL(request.url)
    const id = Number.parseInt(searchParams.get("id") || "0")
    console.log("🗑️ 삭제할 매물 ID:", id)

    if (!id) {
      console.error("❌ 매물 ID가 없음")
      return NextResponse.json({ error: "매물 ID가 필요합니다." }, { status: 400 })
    }

    const data = getPropertiesData()
    const index = data.properties?.findIndex((property: any) => property.id === id) ?? -1
    console.log("📍 삭제할 매물 인덱스:", index)

    if (index === -1) {
      console.error("❌ 삭제할 매물을 찾을 수 없음")
      return NextResponse.json({ error: "해당 매물을 찾을 수 없습니다." }, { status: 404 })
    }

    const deletedProperty = data.properties[index]
    data.properties.splice(index, 1)
    console.log("🗑️ 매물 삭제됨:", JSON.stringify(deletedProperty, null, 2))
    console.log("📊 남은 매물 수:", data.properties.length)

    const success = savePropertiesData(data)
    console.log("💾 저장 결과:", success)

    if (!success) {
      console.error("❌ 매물 삭제 저장 실패")
      return NextResponse.json({ error: "부동산 매물 삭제에 실패했습니다." }, { status: 500 })
    }

    console.log("✅ 매물 삭제 완료")
    return NextResponse.json({
      success: true,
      message: "매물이 성공적으로 삭제되었습니다.",
    })
  } catch (error) {
    console.error("💥 부동산 매물 삭제 중 오류:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
