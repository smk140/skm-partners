import { NextResponse } from "next/server"
import { trackLoginFailure, clearLoginFailures } from "@/middleware"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // IP 주소 수집
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // User-Agent 수집
    const userAgent = request.headers.get("user-agent") || "unknown"

    // 로그인 로그 저장 (임시로 콘솔에만 출력)
    console.log("Admin login log:", {
      username: data.username,
      ip_address: ip,
      user_agent: userAgent,
      success: data.success,
      timestamp: new Date().toISOString(),
    })

    // 로그인 실패/성공 처리
    if (data.success) {
      // 로그인 성공 시 실패 기록 초기화
      clearLoginFailures(ip)
      console.log(`✅ Login successful for IP ${ip}, failure count cleared`)
    } else {
      // 로그인 실패 시 추적 (3번 실패하면 자동 차단)
      const wasBlocked = trackLoginFailure(ip, data.username)
      if (wasBlocked) {
        console.log(`🚨 IP ${ip} was auto-blocked due to login failures`)
        return NextResponse.json({
          success: false,
          blocked: true,
          message: "IP has been automatically blocked due to multiple login failures",
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to log admin login:", error)
    return NextResponse.json({ error: "Failed to log login" }, { status: 500 })
  }
}
