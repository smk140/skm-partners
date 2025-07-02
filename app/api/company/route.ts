import { NextResponse } from "next/server"
import { getCompanyData } from "@/lib/file-db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const companyData = await getCompanyData()
    return NextResponse.json(companyData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Company data fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch company data" }, { status: 500 })
  }
}
