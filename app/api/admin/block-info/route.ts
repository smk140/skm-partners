import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    console.log(`🔍 Block info 요청 - IP: ${clientIP}`)

    return NextResponse.json({
      success: true,
      ip: clientIP,
      timestamp: new Date().toISOString(),
      message: "IP 정보 조회 성공",
    })
  } catch (error) {
    console.error("❌ Block info 오류:", error)
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 })
  }
}
