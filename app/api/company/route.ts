import { NextResponse } from "next/server"
import { getCompanyData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("🔍 GET /api/company 호출됨 (홈페이지용)")
    const companyData = await getCompanyData()
    console.log("📤 GET 홈페이지 응답 데이터:", companyData)

    return NextResponse.json(companyData)
  } catch (error) {
    console.error("❌ GET /api/company 오류:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
