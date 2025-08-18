import { type NextRequest, NextResponse } from "next/server"
import { updateCompanyData } from "@/lib/file-db"

export async function POST(request: NextRequest) {
  try {
    console.log("🏢 Admin company API called")
    const companyData = await request.json()
    console.log("📥 Received company data:", JSON.stringify(companyData, null, 2))

    const result = await updateCompanyData(companyData)
    console.log("💾 Update result:", result)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Company data updated successfully",
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to update company data",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("❌ Admin company API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    )
  }
}
