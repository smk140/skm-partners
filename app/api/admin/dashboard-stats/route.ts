import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // 문의 수 조회
    const inquiriesResult = await sql`
      SELECT COUNT(*) as count FROM inquiries
    `

    // 부동산 매물 수 조회
    const propertiesResult = await sql`
      SELECT COUNT(*) as count FROM properties
    `

    // 최근 24시간 로그인 수 조회
    const loginsResult = await sql`
      SELECT COUNT(*) as count 
      FROM admin_access_logs 
      WHERE created_at > NOW() - INTERVAL '24 hours'
      AND action = 'login'
    `

    const stats = {
      totalInquiries: Number(inquiriesResult[0]?.count || 0),
      totalProperties: Number(propertiesResult[0]?.count || 0),
      recentLogins: Number(loginsResult[0]?.count || 0),
      systemStatus: "정상",
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      {
        totalInquiries: 0,
        totalProperties: 0,
        recentLogins: 0,
        systemStatus: "오류",
      },
      { status: 500 },
    )
  }
}
