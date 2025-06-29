import { NextResponse } from "next/server"

export async function GET() {
  try {
    // GitHub 파일 시스템 기반 보안 로그 (임시로 빈 배열)
    const securityLogs = []

    return NextResponse.json({
      success: true,
      logs: securityLogs,
    })
  } catch (error) {
    console.error("보안 로그 조회 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
