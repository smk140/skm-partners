import { NextResponse } from "next/server"
import { getBlockedIPs } from "@/middleware"

// 실제 클라이언트 IP 주소를 가져오는 함수
function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()

  return "127.0.0.1"
}

export async function GET(request: Request) {
  try {
    const clientIP = getClientIP(request)
    const blockedIPs = getBlockedIPs()

    // 현재 IP가 차단된 IP 목록에 있는지 확인
    const blockInfo = blockedIPs.find((blocked) => blocked.ip === clientIP)

    if (blockInfo) {
      return NextResponse.json({
        ip: blockInfo.ip,
        reason: blockInfo.reason,
        blockedAt: blockInfo.blockedAt.toISOString(),
      })
    } else {
      return NextResponse.json({ error: "IP not blocked" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching block info:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
