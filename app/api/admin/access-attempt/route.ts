import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // IP 주소 수집
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // User-Agent 수집
    const userAgent = request.headers.get("user-agent") || "unknown"

    // 접속 시도 로그
    const accessLog = {
      action: data.action,
      ip_address: ip,
      user_agent: userAgent,
      consent: data.consent,
      timestamp: new Date().toISOString(),
    }

    console.log("Admin access attempt:", accessLog)

    // 디스코드 알림 발송
    await sendAdminAccessAttemptNotification(accessLog)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to log admin access attempt:", error)
    return NextResponse.json({ error: "Failed to log access attempt" }, { status: 500 })
  }
}

async function sendAdminAccessAttemptNotification(accessData: {
  action: string
  ip_address: string
  user_agent: string
  consent: boolean
  timestamp: string
}) {
  const webhookUrl = process.env.NEXT_PUBLIC_ADMIN_DISCORD_WEBHOOK_URL || process.env.ADMIN_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.log("Admin webhook URL not configured")
    return false
  }

  try {
    const embed = {
      title: "🚨 관리자 페이지 접속 시도 감지",
      description: "누군가 관리자 페이지에 접속을 시도했습니다.",
      color: 0xff6b35, // 주황색
      fields: [
        {
          name: "🌐 IP 주소",
          value: accessData.ip_address,
          inline: true,
        },
        {
          name: "📅 접속 시간",
          value: new Date(accessData.timestamp).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
          inline: true,
        },
        {
          name: "✅ 개인정보 동의",
          value: accessData.consent ? "동의함" : "동의하지 않음",
          inline: true,
        },
        {
          name: "🔧 액션",
          value: accessData.action,
          inline: true,
        },
        {
          name: "💻 브라우저 정보",
          value:
            accessData.user_agent.length > 100
              ? accessData.user_agent.substring(0, 100) + "..."
              : accessData.user_agent,
          inline: false,
        },
      ],
      timestamp: accessData.timestamp,
      footer: {
        text: "SKM파트너스 보안 모니터링 시스템",
      },
    }

    const message = {
      content: "🚨 **관리자 페이지 접속 시도가 감지되었습니다!**",
      embeds: [embed],
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status}`)
    }

    console.log("Discord admin access attempt notification sent successfully")
    return true
  } catch (error) {
    console.error("Failed to send Discord admin access attempt notification:", error)
    return false
  }
}
