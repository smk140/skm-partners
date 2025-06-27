import { NextResponse } from "next/server"
import { getPropertiesData } from "@/lib/file-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("=== 부동산 상세 조회 API 호출 ===", params.id)

    const properties = await getPropertiesData()
    const property = properties.find((p) => p.id === Number(params.id))

    if (!property) {
      return NextResponse.json({ error: "부동산을 찾을 수 없습니다." }, { status: 404 })
    }

    console.log("부동산 상세 조회 성공:", property.title)

    return NextResponse.json({
      success: true,
      property: property,
    })
  } catch (error) {
    console.error("부동산 상세 조회 실패:", error)

    return NextResponse.json(
      {
        success: false,
        error: "부동산 조회에 실패했습니다.",
      },
      { status: 500 },
    )
  }
}
