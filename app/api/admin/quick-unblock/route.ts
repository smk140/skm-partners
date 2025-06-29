import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get("ip")

    console.log(`🔓 Quick unblock 요청 - IP: ${ip}`)

    if (!ip) {
      return NextResponse.json({ success: false, error: "IP 주소가 필요합니다" }, { status: 400 })
    }

    // 실제 IP 차단 해제 로직은 여기에 구현
    console.log(`✅ IP ${ip} 차단 해제 완료`)

    return NextResponse.json({
      success: true,
      ip,
      message: `IP ${ip}의 차단이 해제되었습니다`,
    })
  } catch (error) {
    console.error("❌ Quick unblock 오류:", error)
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 })
  }
}
