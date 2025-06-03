import { type NextRequest, NextResponse } from "next/server"
import { updateBlockedIPs } from "@/middleware"
import { sendIPBlockNotification } from "@/lib/discord"
import { getBlockedIPsFromAPI, updateBlockedIPsFromAPI } from "@/app/api/admin/ip-block/route"

export async function GET(request: NextRequest) {
  try {
    // URL 파라미터에서 IP와 액션 가져오기
    const searchParams = request.nextUrl.searchParams
    const ip = searchParams.get("ip")
    const action = searchParams.get("action") as "block" | "unblock"
    const reason = searchParams.get("reason") || "Discord에서 즉시 차단"

    if (!ip) {
      return NextResponse.json({ error: "IP 주소가 필요합니다." }, { status: 400 })
    }

    if (action !== "block" && action !== "unblock") {
      return NextResponse.json({ error: "액션은 'block' 또는 'unblock'이어야 합니다." }, { status: 400 })
    }

    // IP 차단/해제 처리
    if (action === "block") {
      // 이미 차단된 IP인지 확인
      const blockedIPs = getBlockedIPsFromAPI()
      if (blockedIPs.includes(ip)) {
        return NextResponse.json({
          success: true,
          message: "이미 차단된 IP입니다.",
          ip,
          action,
        })
      }

      // IP 차단
      updateBlockedIPsFromAPI(ip, "block")

      // middleware에도 반영
      updateBlockedIPs(ip, "block")

      // Discord 알림 발송
      await sendIPBlockNotification({
        ip,
        action: "block",
        reason,
        admin: "Discord 빠른 차단",
      })

      return NextResponse.json({
        success: true,
        message: `IP ${ip}가 성공적으로 차단되었습니다.`,
        ip,
        action,
      })
    } else {
      // IP 차단 해제
      updateBlockedIPsFromAPI(ip, "unblock")

      // middleware에도 반영
      updateBlockedIPs(ip, "unblock")

      // Discord 알림 발송
      await sendIPBlockNotification({
        ip,
        action: "unblock",
        admin: "Discord 빠른 허용",
      })

      return NextResponse.json({
        success: true,
        message: `IP ${ip}의 차단이 해제되었습니다.`,
        ip,
        action,
      })
    }
  } catch (error) {
    console.error("IP 차단/해제 처리 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
