import { NextResponse } from "next/server"
import { getInquiriesData, getPropertiesData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("=== 최근 활동 조회 API 호출 ===")

    // GitHub에서 데이터 조회
    const inquiries = await getInquiriesData()
    const properties = await getPropertiesData()

    // 최근 활동 생성
    const activities = []

    // 최근 문의 추가
    inquiries.slice(0, 5).forEach((inquiry) => {
      activities.push({
        id: `inquiry-${inquiry.id}`,
        type: "inquiry",
        title: `새로운 문의: ${inquiry.name}`,
        description: inquiry.message?.substring(0, 100) + "...",
        timestamp: inquiry.createdAt,
        user: inquiry.name,
      })
    })

    // 최근 부동산 추가
    properties.slice(0, 3).forEach((property) => {
      activities.push({
        id: `property-${property.id}`,
        type: "property",
        title: `새로운 부동산: ${property.title}`,
        description: property.description?.substring(0, 100) + "...",
        timestamp: property.createdAt,
        user: "관리자",
      })
    })

    // 시간순 정렬
    activities.sort((a, b) => new Date(b.timestamp || "").getTime() - new Date(a.timestamp || "").getTime())

    console.log("최근 활동 조회 성공:", activities.length, "개")

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 10), // 최대 10개
    })
  } catch (error) {
    console.error("최근 활동 조회 실패:", error)

    return NextResponse.json({
      success: false,
      error: "최근 활동 조회에 실패했습니다.",
      activities: [],
    })
  }
}
