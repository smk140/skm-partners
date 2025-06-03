import { NextResponse } from "next/server"
import { sendDiscordNotification } from "@/lib/discord"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log("Login attempt:", { username })

    // 하드코딩된 관리자 계정 확인
    if (username === "admin" && password === "skm2024!@#") {
      // 로그인 성공 - Discord 알림 발송
      try {
        await sendDiscordNotification({
          title: "🔐 관리자 로그인 성공",
          description: `관리자가 시스템에 로그인했습니다.`,
          color: 0x00ff00,
          fields: [
            {
              name: "시간",
              value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
              inline: true,
            },
            {
              name: "사용자",
              value: username,
              inline: true,
            },
          ],
        })
      } catch (discordError) {
        console.error("Discord notification failed:", discordError)
      }

      return NextResponse.json({
        success: true,
        message: "로그인 성공",
        user: {
          username: "admin",
          role: "admin",
        },
      })
    } else {
      // 로그인 실패 - Discord 알림 발송
      try {
        await sendDiscordNotification({
          title: "⚠️ 관리자 로그인 실패",
          description: `잘못된 로그인 시도가 감지되었습니다.`,
          color: 0xff0000,
          fields: [
            {
              name: "시간",
              value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
              inline: true,
            },
            {
              name: "시도한 사용자명",
              value: username,
              inline: true,
            },
          ],
        })
      } catch (discordError) {
        console.error("Discord notification failed:", discordError)
      }

      return NextResponse.json(
        {
          success: false,
          message: "아이디 또는 비밀번호가 올바르지 않습니다.",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
