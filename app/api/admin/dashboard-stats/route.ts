import { NextResponse } from "next/server"
import { getInquiriesData, getPropertiesData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("=== 대시보드 통계 조회 API 호출 ===")

    // GitHub에서 데이터 조회
    const inquiries = await getInquiriesData()
    const properties = await getPropertiesData()

    // 통계 계산
    const totalInquiries = inquiries.length
    const totalProperties = properties.length
    const recentInquiries = inquiries.filter(
      (inquiry) => new Date(inquiry.createdAt || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).length

    const stats = {
      totalInquiries,
      totalProperties,
      recentInquiries,
      activeProperties: properties.length, // 모든 부동산을 활성으로 간주
    }

    console.log("대시보드 통계 조회 성공:", stats)

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("대시보드 통계 조회 실패:", error)

    return NextResponse.json({
      success: false,
      error: "통계 조회에 실패했습니다.",
      stats: {
        totalInquiries: 0,
        totalProperties: 0,
        recentInquiries: 0,
        activeProperties: 0,
      },
    })
  }
}
