import { NextResponse } from "next/server"

// 임시 로그 데이터 (실제로는 데이터베이스에서 가져옴)
const mockLogs = [
  {
    id: 1,
    type: "login_success",
    username: "admin",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
    details: "로그인 성공",
  },
  {
    id: 2,
    type: "login_failure",
    username: "admin",
    ip_address: "203.0.113.5",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
    details: "로그인 실패 - 잘못된 비밀번호",
  },
  {
    id: 3,
    type: "privacy_consent",
    sessionId: "sess_abc123",
    ip_address: "10.0.0.1",
    user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
    details: "개인정보 처리방침 동의",
  },
  {
    id: 4,
    type: "ip_block",
    ip_address: "198.51.100.10",
    user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3일 전
    details: "로그인 실패 3회로 인한 자동 차단",
  },
]

export async function GET() {
  try {
    // 최근 30일 필터링
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const filteredLogs = mockLogs.filter((log) => new Date(log.timestamp) >= thirtyDaysAgo)

    // 최신순 정렬
    const sortedLogs = filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ logs: sortedLogs })
  } catch (error) {
    console.error("Failed to fetch logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
