import { type NextRequest, NextResponse } from "next/server"
import { getCompanyData, updateCompanyData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("🔍 GET /api/admin/company 호출됨")
    const companyInfo = await getCompanyData()
    console.log("📤 GET 응답 데이터:", companyInfo)

    return NextResponse.json({
      success: true,
      companyInfo,
    })
  } catch (error) {
    console.error("❌ GET /api/admin/company 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📝 POST /api/admin/company 호출됨")
    const body = await request.json()
    console.log("📥 POST 요청 데이터:", body)

    const result = await updateCompanyData(body)
    console.log("📤 POST 응답 결과:", result)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("❌ POST /api/admin/company 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
