import { NextResponse } from "next/server"
import { getSecurityLogs, getSecurityStats } from "@/lib/security-logger"

export async function GET() {
  try {
    const logs = getSecurityLogs(100) // 최근 100개 로그
    const stats = getSecurityStats()

    return NextResponse.json({
      logs,
      stats,
    })
  } catch (error) {
    console.error("보안 로그 조회 실패:", error)
    return NextResponse.json({ error: "보안 로그 조회에 실패했습니다." }, { status: 500 })
  }
}
