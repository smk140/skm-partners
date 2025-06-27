import { type NextRequest, NextResponse } from "next/server"
import { getCompanyData, updateCompanyData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("📊 회사 정보 조회 요청")
    const companyData = await getCompanyData()
    console.log("✅ 회사 정보 조회 성공")

    return NextResponse.json({
      success: true,
      data: companyData,
    })
  } catch (error) {
    console.error("💥 회사 정보 조회 실패:", error)
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
    console.log("📝 회사 정보 업데이트 요청")
    const body = await request.json()
    console.log("📝 업데이트 데이터:", body)

    const result = await updateCompanyData(body)

    if (result.success) {
      console.log("✅ 회사 정보 업데이트 성공")
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "회사 정보가 성공적으로 업데이트되었습니다.",
      })
    } else {
      console.error("💥 회사 정보 업데이트 실패:", result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("💥 회사 정보 업데이트 API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
