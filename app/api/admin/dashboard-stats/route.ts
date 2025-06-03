import { NextResponse } from "next/server"
import { getInquiriesData, getPropertiesData } from "@/lib/file-db"

export async function GET() {
  try {
    // 실제 데이터에서 통계 계산
    const inquiriesData = getInquiriesData()
    const propertiesData = getPropertiesData()

    const totalInquiries = inquiriesData.inquiries?.length || 0
    const pendingInquiries = inquiriesData.inquiries?.filter((inquiry: any) => inquiry.status === "pending").length || 0
    const totalProperties = propertiesData.properties?.length || 0
    const activeProperties =
      propertiesData.properties?.filter((property: any) => property.status === "활성").length || 0

    // 최근 24시간 로그인 수 (임시로 랜덤 값)
    const recentLogins = Math.floor(Math.random() * 10) + 1

    const stats = {
      totalInquiries,
      totalProperties,
      recentLogins,
      systemStatus: "정상",
      pendingInquiries,
      activeProperties,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      {
        totalInquiries: 0,
        totalProperties: 0,
        recentLogins: 0,
        systemStatus: "오류",
        pendingInquiries: 0,
        activeProperties: 0,
      },
      { status: 500 },
    )
  }
}
