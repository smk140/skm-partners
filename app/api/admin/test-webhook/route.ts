import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { webhookUrl, type, message } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 })
    }

    let embed

    if (type === "security") {
      embed = {
        title: `🛡️ 보안 웹훅 테스트`,
        description: message || "보안 시스템 테스트 메시지입니다.",
        color: 0xff6b35, // 주황색
        fields: [
          {
            name: "테스트 시간",
            value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
            inline: true,
          },
          {
            name: "웹훅 타입",
            value: "보안 알림",
            inline: true,
          },
          {
            name: "테스트 IP",
            value: "`192.168.1.100`",
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "SKM파트너스 보안 시스템 테스트",
        },
      }
    } else {
      embed = {
        title: `🧪 ${type === "inquiry" ? "문의" : "관리자"} 웹훅 테스트`,
        description: message || "테스트 메시지입니다.",
        color: type === "inquiry" ? 0x3b82f6 : 0x10b981,
        fields: [
          {
            name: "테스트 시간",
            value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
            inline: true,
          },
          {
            name: "웹훅 타입",
            value: type === "inquiry" ? "문의 알림" : "관리자 알림",
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "SKM파트너스 웹훅 테스트",
        },
      }
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: type === "security" ? "🛡️ 보안 웹훅 테스트 메시지입니다." : "🧪 웹훅 테스트 메시지입니다.",
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Webhook test failed: ${response.status} - ${errorText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook test failed:", error)
    return NextResponse.json(
      {
        error: "Webhook test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
