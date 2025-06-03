import { NextResponse } from "next/server"
import { sendIPBlockNotification } from "@/lib/discord"

// middleware에서 사용할 수 있도록 전역 변수로 관리
// 실제 운영환경에서는 Redis나 데이터베이스 사용 권장
const blockedIPs = new Set<string>()

// middleware에서 접근할 수 있도록 export
export function getBlockedIPsFromAPI(): string[] {
  return Array.from(blockedIPs)
}

export function updateBlockedIPsFromAPI(ip: string, action: "block" | "unblock") {
  if (action === "block") {
    blockedIPs.add(ip)
  } else {
    blockedIPs.delete(ip)
  }
}

export async function POST(request: Request) {
  try {
    const { ip, action, reason } = await request.json()

    if (!ip) {
      return NextResponse.json({ error: "IP 주소가 필요합니다." }, { status: 400 })
    }

    if (action === "block") {
      blockedIPs.add(ip)
      console.log(`🚫 IP ${ip} blocked. Reason: ${reason}`)

      // 실시간으로 middleware에 반영하기 위해 전역 함수 호출
      if (typeof globalThis !== "undefined") {
        // @ts-ignore
        globalThis.updateBlockedIPs?.(ip, "block")
      }
    } else if (action === "unblock") {
      blockedIPs.delete(ip)
      console.log(`✅ IP ${ip} unblocked`)

      // 실시간으로 middleware에 반영하기 위해 전역 함수 호출
      if (typeof globalThis !== "undefined") {
        // @ts-ignore
        globalThis.updateBlockedIPs?.(ip, "unblock")
      }
    } else {
      return NextResponse.json({ error: "잘못된 액션입니다." }, { status: 400 })
    }

    // 디스코드 알림 발송
    await sendIPBlockNotification({
      ip,
      action,
      reason: reason || "관리자 수동 차단",
      admin: "관리자",
    })

    return NextResponse.json({
      success: true,
      message:
        action === "block"
          ? "IP가 실제로 차단되었습니다. 해당 IP는 더 이상 사이트에 접속할 수 없습니다."
          : "IP 차단이 해제되었습니다.",
      blockedIPs: Array.from(blockedIPs),
    })
  } catch (error) {
    console.error("IP 차단/해제 처리 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      blockedIPs: Array.from(blockedIPs),
      message: "현재 차단된 IP 목록입니다. 이 IP들은 실제로 사이트 접속이 차단됩니다.",
    })
  } catch (error) {
    console.error("차단 IP 목록 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
