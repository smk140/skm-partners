import { type NextRequest, NextResponse } from "next/server"
import { updateConsentSession } from "@/middleware"
import { sendUnauthorizedAdminAccessNotification } from "@/lib/discord"

// 실제 클라이언트 IP 주소를 가져오는 함수
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()

  return request.ip || "127.0.0.1"
}

// 허용된 IP 목록 확인
function getAllowedIPs(): Set<string> {
  const allowedIPs = process.env.ALLOWED_ADMIN_IPS
  if (!allowedIPs) {
    console.log("⚠️ ALLOWED_ADMIN_IPS not configured - all IPs will be monitored")
    return new Set<string>()
  }

  const ips = allowedIPs
    .split(",")
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0)
  console.log(`✅ Loaded ${ips.length} allowed admin IPs from environment`)
  return new Set(ips)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, checkUnauthorizedAccess } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const clientIP = getClientIP(request)
    const userAgent = request.headers.get("user-agent") || "unknown"

    console.log(`📝 Registering admin session: ${sessionId} from IP: ${clientIP}`)

    // 세션을 동의된 세션 목록에 추가
    updateConsentSession(sessionId, "add")

    // 허용되지 않은 IP 접근 검증 및 Discord 알림
    if (checkUnauthorizedAccess) {
      const allowedIPs = getAllowedIPs()

      if (allowedIPs.size > 0 && !allowedIPs.has(clientIP)) {
        console.log(`⚠️ Unauthorized IP ${clientIP} accessing admin system`)
        console.log(`📋 Allowed IPs: ${Array.from(allowedIPs).join(", ")}`)

        // 허용되지 않은 IP 접속 알림 발송
        try {
          await sendUnauthorizedAdminAccessNotification({
            ip_address: clientIP,
            user_agent: userAgent,
            page: "개인정보 동의 후 관리자 시스템 접근",
          })
          console.log("✅ Unauthorized access notification sent")
        } catch (error) {
          console.error("❌ Failed to send unauthorized access notification:", error)
        }
      } else if (allowedIPs.size > 0) {
        console.log(`✅ Authorized IP ${clientIP} accessing admin system`)
      } else {
        console.log(`ℹ️ No IP restrictions configured - allowing access from ${clientIP}`)
      }
    }

    // 개인정보 동의 로그 저장 (데이터베이스에 저장하는 로직이 있다면 여기에 추가)
    console.log(`📋 Privacy consent logged for session ${sessionId} from IP ${clientIP}`)

    return NextResponse.json({
      success: true,
      message: "Session registered successfully",
      sessionId,
      ip: clientIP,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error registering session:", error)
    return NextResponse.json({ error: "Failed to register session" }, { status: 500 })
  }
}
