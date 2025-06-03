import { NextResponse } from "next/server"
import { sendAdminAccessNotification } from "@/lib/discord"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // IP 주소 수집
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // User-Agent 수집
    const userAgent = request.headers.get("user-agent") || "unknown"

    // 접속 로그 저장 (임시로 콘솔에만 출력)
    console.log("Admin panel access:", {
      page: data.page,
      ip_address: ip,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    })

    // 디스코드 알림 발송
    await sendAdminAccessNotification({
      page: data.page,
      ip_address: ip,
      user_agent: userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to log admin access:", error)
    return NextResponse.json({ error: "Failed to log access" }, { status: 500 })
  }
}
