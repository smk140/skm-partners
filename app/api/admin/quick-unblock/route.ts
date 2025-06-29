import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get("ip")

    if (!ip) {
      return NextResponse.json({ success: false, error: "IP address is required" }, { status: 400 })
    }

    // 여기서 실제 IP 차단 해제 로직을 구현
    console.log(`Quick unblock request for IP: ${ip}`)

    return NextResponse.json({
      success: true,
      message: `IP ${ip} unblocked successfully`,
    })
  } catch (error) {
    console.error("Quick unblock error:", error)
    return NextResponse.json({ success: false, error: "Failed to unblock IP" }, { status: 500 })
  }
}
