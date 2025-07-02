import { NextResponse } from "next/server"
import { getCompanyData } from "@/lib/file-db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("🔍 GET /api/company 호출됨")
    const companyData = await getCompanyData()
    console.log("📤 GET 응답 데이터:", { name: companyData.name, hasLogo: !!companyData.logoUrl })

    return NextResponse.json(companyData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    })
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
