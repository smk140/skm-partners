import { NextResponse } from "next/server"

export async function GET() {
  try {
    // GitHub 파일 시스템 기반 관리자 로그 (임시로 빈 배열)
    const adminLogs = []

    return NextResponse.json({
      success: true,
      logs: adminLogs,
    })
  } catch (error) {
    console.error("관리자 로그 조회 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
