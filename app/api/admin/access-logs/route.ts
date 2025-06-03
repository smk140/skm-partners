import { NextResponse } from "next/server"

// 임시 접속 로그 저장소 (실제로는 데이터베이스 사용)
const accessLogs: any[] = []

export async function GET() {
  try {
    // 최근 100개 로그만 반환 (최신순)
    const recentLogs = accessLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 100)

    return NextResponse.json({
      logs: recentLogs,
      total: accessLogs.length,
    })
  } catch (error) {
    console.error("접속 로그 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // IP 주소 수집
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // User-Agent 수집
    const userAgent = request.headers.get("user-agent") || "unknown"

    const logEntry = {
      id: Date.now(),
      ip_address: ip,
      user_agent: userAgent,
      action: data.action || "unknown",
      page: data.page || "unknown",
      success: data.success !== false,
      timestamp: new Date().toISOString(),
      ...data,
    }

    accessLogs.push(logEntry)
    console.log("Access log added:", logEntry)

    return NextResponse.json({ success: true, logId: logEntry.id })
  } catch (error) {
    console.error("접속 로그 저장 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
