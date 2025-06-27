import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== 로그 조회 API 호출 ===")

    // GitHub 파일 시스템에서는 로그를 별도로 관리하지 않으므로
    // 더미 데이터 반환
    const logs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        level: "info",
        message: "시스템이 정상적으로 작동 중입니다.",
        source: "system",
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: "info",
        message: "GitHub 파일 시스템 연결 성공",
        source: "github",
      },
    ]

    console.log("로그 조회 성공:", logs.length, "개")

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
    })
  } catch (error) {
    console.error("로그 조회 실패:", error)

    return NextResponse.json({
      success: false,
      error: "로그 조회에 실패했습니다.",
      logs: [],
      total: 0,
    })
  }
}
