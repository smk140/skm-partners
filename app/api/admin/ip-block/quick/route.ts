import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get("ip")
    const action = searchParams.get("action")

    if (!ip) {
      return NextResponse.json({ success: false, error: "IP address is required" }, { status: 400 })
    }

    // 여기서 실제 IP 차단/해제 로직을 구현
    console.log(`IP ${action} request for: ${ip}`)

    return NextResponse.json({
      success: true,
      message: `IP ${ip} ${action === "block" ? "blocked" : "unblocked"} successfully`,
    })
  } catch (error) {
    console.error("IP block/unblock error:", error)
    return NextResponse.json({ success: false, error: "Failed to process IP action" }, { status: 500 })
  }
}
