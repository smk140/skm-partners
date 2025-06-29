import { type NextRequest, NextResponse } from "next/server"
import { getCompanyData, updateCompanyData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("🔥 GET /api/admin/company 호출됨")
    const data = await getCompanyData()
    console.log("📤 반환 데이터:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("💥 GET 오류:", error)
    return NextResponse.json({ error: "Failed to fetch company data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔥 POST /api/admin/company 호출됨")
    const body = await request.json()
    console.log("📥 받은 데이터:", body)

    await updateCompanyData(body)
    console.log("✅ 데이터 업데이트 완료")

    const updatedData = await getCompanyData()
    console.log("📤 업데이트된 데이터:", updatedData)

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: "Company data updated successfully",
    })
  } catch (error) {
    console.error("💥 POST 오류:", error)
    return NextResponse.json({ error: "Failed to update company data" }, { status: 500 })
  }
}
