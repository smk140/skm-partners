import { NextResponse } from "next/server"
import { getAdminLogs } from "@/lib/security-logger"

export async function GET() {
  try {
    const logs = getAdminLogs(100) // 최근 100개 로그

    return NextResponse.json({
      logs,
    })
  } catch (error) {
    console.error("관리자 로그 조회 실패:", error)
    return NextResponse.json({ error: "관리자 로그 조회에 실패했습니다." }, { status: 500 })
  }
}
