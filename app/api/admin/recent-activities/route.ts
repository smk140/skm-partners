import { NextResponse } from "next/server"
import { getInquiriesData, getPropertiesData } from "@/lib/file-db"

export async function GET() {
  try {
    const inquiries = await getInquiriesData()
    const properties = await getPropertiesData()

    // 최근 활동 목록 생성
    const activities = [
      ...inquiries.slice(-10).map((inquiry) => ({
        id: inquiry.id,
        type: "inquiry",
        title: `새 문의: ${inquiry.name}`,
        description: inquiry.message.substring(0, 100) + "...",
        timestamp: inquiry.createdAt,
      })),
      ...properties.slice(-10).map((property) => ({
        id: property.id,
        type: "property",
        title: `새 부동산: ${property.title}`,
        description: property.description.substring(0, 100) + "...",
        timestamp: property.createdAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 20),
    })
  } catch (error) {
    console.error("최근 활동 조회 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
