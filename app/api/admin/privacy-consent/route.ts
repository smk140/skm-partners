import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // IP 주소 가져오기
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || request.ip || "unknown"

    // 사용자 에이전트 가져오기
    const userAgent = request.headers.get("user-agent") || "unknown"

    // 개인정보 동의 로그 저장 (콘솔에만 출력, 실제로는 DB에 저장)
    console.log("Privacy consent log:", {
      type: "privacy_consent",
      sessionId: sessionId,
      ip_address: ip,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in privacy consent API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
