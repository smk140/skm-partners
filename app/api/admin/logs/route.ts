import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // 실제 데이터베이스에서 로그 조회
    const result = await sql`
      SELECT * FROM logs 
      WHERE created_at >= NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
    `

    return NextResponse.json({ logs: result.rows })
  } catch (error) {
    console.error("Failed to fetch logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs", logs: [] }, { status: 500 })
  }
}
