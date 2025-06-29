import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get("ip")

    if (!ip) {
      return NextResponse.json({ success: false, error: "IP address is required" }, { status: 400 })
    }

    // IP 차단 로직 (실제 구현 필요)
    console.log(`Quick blocking IP: ${ip}`)

    return NextResponse.json({
      success: true,
      message: `IP ${ip} has been blocked`,
    })
  } catch (error) {
    console.error("Quick IP block error:", error)
    return NextResponse.json({ success: false, error: "Failed to block IP" }, { status: 500 })
  }
}
