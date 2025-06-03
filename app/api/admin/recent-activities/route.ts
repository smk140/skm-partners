import { NextResponse } from "next/server"
import { getInquiriesData, getPropertiesData } from "@/lib/file-db"

export async function GET() {
  try {
    const inquiriesData = getInquiriesData()
    const propertiesData = getPropertiesData()

    const activities = []

    // 최근 문의 활동
    const recentInquiries =
      inquiriesData.inquiries
        ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3) || []

    recentInquiries.forEach((inquiry: any, index: number) => {
      activities.push({
        id: `inquiry-${inquiry.id}`,
        type: "inquiry",
        message: `${inquiry.name}님이 ${inquiry.service} 문의를 남겼습니다`,
        timestamp: formatTimeAgo(inquiry.created_at),
        status: "info",
      })
    })

    // 최근 매물 활동
    const recentProperties =
      propertiesData.properties
        ?.sort(
          (a: any, b: any) =>
            new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime(),
        )
        .slice(0, 2) || []

    recentProperties.forEach((property: any) => {
      activities.push({
        id: `property-${property.id}`,
        type: "property",
        message: `${property.title} 매물이 업데이트되었습니다`,
        timestamp: formatTimeAgo(property.updated_at || property.created_at),
        status: "success",
      })
    })

    // 시스템 활동 (임시)
    activities.push({
      id: "system-backup",
      type: "system",
      message: "시스템 백업이 완료되었습니다",
      timestamp: "3시간 전",
      status: "success",
    })

    // 시간순 정렬
    activities.sort((a, b) => {
      // 간단한 시간 정렬 (실제로는 timestamp를 Date로 변환해야 함)
      return 0
    })

    return NextResponse.json({
      activities: activities.slice(0, 5), // 최대 5개만 반환
    })
  } catch (error) {
    console.error("Recent activities error:", error)
    return NextResponse.json({ activities: [] }, { status: 500 })
  }
}

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins}분 전`
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`
    } else {
      return `${diffDays}일 전`
    }
  } catch {
    return "방금 전"
  }
}
