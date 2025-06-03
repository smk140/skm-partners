import { type NextRequest, NextResponse } from "next/server"

// 임시 관리자 계정
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "skm2024!@#",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log("Login attempt:", { username, password: password ? "***" : "empty" })

    // 자격 증명 확인
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      console.log("Login successful")

      return NextResponse.json({
        success: true,
        message: "로그인 성공",
        user: { username },
      })
    } else {
      console.log("Login failed - invalid credentials")

      return NextResponse.json(
        {
          success: false,
          message: "잘못된 사용자명 또는 비밀번호입니다.",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Login API error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "로그인 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
