import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    const userAgent = request.headers.get("user-agent") || "unknown"

    return NextResponse.json({
      success: true,
      data: {
        ip: clientIP,
        userAgent: userAgent,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Block info error:", error)
    return NextResponse.json({ success: false, error: "Failed to get block info" }, { status: 500 })
  }
}
