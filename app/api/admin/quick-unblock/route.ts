import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get("ip")

    if (!ip) {
      return NextResponse.json({ success: false, error: "IP address is required" }, { status: 400 })
    }

    // IP 차단 해제 로직 (실제 구현 필요)
    console.log(`Quick unblocking IP: ${ip}`)

    return NextResponse.json({
      success: true,
      message: `IP ${ip} has been unblocked`,
    })
  } catch (error) {
    console.error("Quick IP unblock error:", error)
    return NextResponse.json({ success: false, error: "Failed to unblock IP" }, { status: 500 })
  }
}
