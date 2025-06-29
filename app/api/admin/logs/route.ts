import { NextResponse } from "next/server"

// GitHub 파일 시스템 기반 로그 관리
export async function GET() {
  try {
    // 임시로 빈 로그 배열 반환
    const logs = []

    return NextResponse.json({
      success: true,
      logs,
    })
  } catch (error) {
    console.error("로그 조회 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
