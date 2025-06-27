import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== 보안 로그 조회 API 호출 ===")

    // GitHub 파일 시스템에서는 보안 로그를 별도로 관리하지 않으므로
    // 더미 데이터 반환
    const securityLogs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        event: "login_success",
        ip: "127.0.0.1",
        userAgent: "Mozilla/5.0...",
        details: "관리자 로그인 성공",
      },
    ]

    console.log("보안 로그 조회 성공:", securityLogs.length, "개")

    return NextResponse.json({
      success: true,
      logs: securityLogs,
      total: securityLogs.length,
    })
  } catch (error) {
    console.error("보안 로그 조회 실패:", error)

    return NextResponse.json({
      success: false,
      error: "보안 로그 조회에 실패했습니다.",
      logs: [],
      total: 0,
    })
  }
}
