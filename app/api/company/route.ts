import { NextResponse } from "next/server"
import { getCompanyData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("🔥 GET /api/company 호출됨 (홈페이지용)")
    const data = await getCompanyData()
    console.log("📤 홈페이지로 반환 데이터:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("💥 홈페이지 GET 오류:", error)
    return NextResponse.json({ error: "Failed to fetch company data" }, { status: 500 })
  }
}
