import { NextResponse } from "next/server"
import { getCompanyData } from "@/lib/file-db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("🏢 Company API called")
    const companyData = await getCompanyData()
    console.log("✅ Company data retrieved:", JSON.stringify(companyData, null, 2))

    return NextResponse.json({
      success: true,
      company: companyData,
    })
  } catch (error: any) {
    console.error("❌ Company API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch company data",
      },
      { status: 500 },
    )
  }
}
