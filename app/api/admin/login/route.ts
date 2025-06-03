import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// 임시 관리자 계정 (실제 운영에서는 데이터베이스에 저장하고 암호화해야 함)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "skm2024!@#",
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // 로그인 시도 로그
    await sql`
      INSERT INTO admin_access_logs (ip_address, action, details, created_at)
      VALUES (${clientIP}, 'login_attempt', ${JSON.stringify({ username })}, NOW())
    `

    // 자격 증명 확인
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // 로그인 성공 로그
      await sql`
        INSERT INTO admin_access_logs (ip_address, action, details, created_at)
        VALUES (${clientIP}, 'login_success', ${JSON.stringify({ username })}, NOW())
      `

      return NextResponse.json({
        success: true,
        message: "로그인 성공",
        user: { username },
      })
    } else {
      // 로그인 실패 로그
      await sql`
        INSERT INTO admin_access_logs (ip_address, action, details, created_at)
        VALUES (${clientIP}, 'login_failed', ${JSON.stringify({ username, reason: "invalid_credentials" })}, NOW())
      `

      return NextResponse.json({ success: false, message: "잘못된 사용자명 또는 비밀번호입니다." }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "로그인 중 오류가 발생했습니다." }, { status: 500 })
  }
}
