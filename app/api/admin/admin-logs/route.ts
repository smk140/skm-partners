import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== 관리자 로그 조회 API 호출 ===")

    // GitHub 파일 시스템에서는 관리자 로그를 별도로 관리하지 않으므로
    // 더미 데이터 반환
    const adminLogs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        action: "company_info_update",
        admin: "관리자",
        details: "회사 정보가 업데이트되었습니다.",
        ip: "127.0.0.1",
      },
    ]

    console.log("관리자 로그 조회 성공:", adminLogs.length, "개")

    return NextResponse.json({
      success: true,
      logs: adminLogs,
      total: adminLogs.length,
    })
  } catch (error) {
    console.error("관리자 로그 조회 실패:", error)

    return NextResponse.json({
      success: false,
      error: "관리자 로그 조회에 실패했습니다.",
      logs: [],
      total: 0,
    })
  }
}
