import { type NextRequest, NextResponse } from "next/server"
import { updateProperty, deleteProperty, getPropertiesData } from "@/lib/file-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const properties = await getPropertiesData()
    const property = properties.find((p) => p.id.toString() === params.id)

    if (!property) {
      return NextResponse.json({ error: "부동산을 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      property,
    })
  } catch (error) {
    console.error("부동산 조회 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const result = await updateProperty(params.id, body)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "부동산 정보가 업데이트되었습니다.",
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("부동산 업데이트 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteProperty(params.id)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "부동산이 삭제되었습니다.",
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("부동산 삭제 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
