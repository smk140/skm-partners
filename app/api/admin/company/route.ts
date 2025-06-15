import { NextResponse } from "next/server"
import { connectToDatabase } from "@/utils/db"
import Company from "@/models/company"

export async function GET() {
  try {
    const sql = await connectToDatabase()
    const company = new Company(sql)
    const companyInfo = await company.getCompanyInfo()

    return NextResponse.json({
      success: true,
      data: companyInfo,
    })
  } catch (error) {
    console.error("Company info fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch company info" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const sql = await connectToDatabase()
    const company = new Company(sql)

    const result = await company.upsertCompanyInfo(data)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Company info update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update company info" }, { status: 500 })
  }
}
