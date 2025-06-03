import { NextResponse } from "next/server"
import { getPropertiesData, savePropertiesData, generateId } from "@/lib/file-db"

// 부동산 매물 목록 조회
export async function GET() {
  try {
    const data = getPropertiesData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("부동산 매물 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 부동산 매물 추가
export async function POST(request: Request) {
  try {
    const propertyData = await request.json()
    const data = getPropertiesData()

    const newProperty = {
      id: generateId(data.properties),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...propertyData,
    }

    data.properties.push(newProperty)

    const success = savePropertiesData(data)

    if (!success) {
      return NextResponse.json({ error: "부동산 매물 저장에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      property: newProperty,
    })
  } catch (error) {
    console.error("부동산 매물 추가 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 부동산 매물 수정
export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    const data = getPropertiesData()

    const index = data.properties.findIndex((property: any) => property.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "해당 매물을 찾을 수 없습니다." }, { status: 404 })
    }

    data.properties[index] = {
      ...data.properties[index],
      ...updateData,
      updated_at: new Date().toISOString(),
    }

    const success = savePropertiesData(data)

    if (!success) {
      return NextResponse.json({ error: "부동산 매물 업데이트에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      property: data.properties[index],
    })
  } catch (error) {
    console.error("부동산 매물 수정 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 부동산 매물 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = Number.parseInt(searchParams.get("id") || "0")

    if (!id) {
      return NextResponse.json({ error: "매물 ID가 필요합니다." }, { status: 400 })
    }

    const data = getPropertiesData()
    const index = data.properties.findIndex((property: any) => property.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "해당 매물을 찾을 수 없습니다." }, { status: 404 })
    }

    data.properties.splice(index, 1)

    const success = savePropertiesData(data)

    if (!success) {
      return NextResponse.json({ error: "부동산 매물 삭제에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("부동산 매물 삭제 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
