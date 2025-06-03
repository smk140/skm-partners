import { NextResponse } from "next/server"
import { sendSystemUpdateNotification } from "@/lib/discord"

export async function GET() {
  try {
    // 임시로 빈 설정 반환
    const settings = {
      inquiry_webhook_url: "",
      admin_webhook_url: "",
      privacy_policy_url: "/privacy",
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()

    // 임시로 설정 저장 (콘솔에만 출력)
    console.log("Settings updated:", data)

    // 시스템 변경 알림 발송
    await sendSystemUpdateNotification({
      admin: "관리자",
      action: "시스템 설정 변경",
      details: "웹훅 URL 및 보안 설정이 업데이트되었습니다.",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
