import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { webhookUrl } = await request.json()

    console.log("Testing webhook URL:", webhookUrl ? "URL provided" : "No URL")
    console.log("Environment DISCORD_WEBHOOK_URL:", process.env.DISCORD_WEBHOOK_URL ? "Set" : "Not set")

    // 테스트 데이터
    const testData = {
      name: "테스트 사용자",
      phone: "010-1234-5678",
      email: "test@example.com",
      service: "테스트 문의",
      message: "디스코드 웹훅 테스트 메시지입니다.",
      ip_address: "127.0.0.1",
      user_agent: "Test Browser",
    }

    // 직접 웹훅 테스트
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "🧪 직접 웹훅 테스트",
          embeds: [
            {
              title: "테스트 메시지",
              description: "웹훅이 정상적으로 작동하는지 확인하는 테스트입니다.",
              color: 0x00ff00,
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })

      console.log("Direct webhook response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Direct webhook error:", errorText)
        return NextResponse.json(
          {
            error: "Direct webhook failed",
            status: response.status,
            details: errorText,
          },
          { status: 400 },
        )
      }
    }

    return NextResponse.json({
      success: true,
      directTest: webhookUrl ? "success" : "skipped",
      functionTest: "success",
      envSet: !!process.env.DISCORD_WEBHOOK_URL,
    })
  } catch (error) {
    console.error("Test failed:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
