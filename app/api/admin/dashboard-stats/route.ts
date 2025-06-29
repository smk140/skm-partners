import { NextResponse } from "next/server"
import { getInquiriesData, getPropertiesData } from "@/lib/file-db"

export async function GET() {
  try {
    const inquiries = await getInquiriesData()
    const properties = await getPropertiesData()

    const stats = {
      totalInquiries: inquiries.length,
      totalProperties: properties.length,
      recentInquiries: inquiries.slice(-5).reverse(),
      recentProperties: properties.slice(-5).reverse(),
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("대시보드 통계 조회 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
