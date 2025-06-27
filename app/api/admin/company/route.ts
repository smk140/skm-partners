import { NextResponse } from "next/server"
import { getCompanyData, updateCompanyData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("=== 회사 정보 조회 API 호출 ===")

    const companyData = await getCompanyData()

    return NextResponse.json({
      success: true,
      companyInfo: companyData,
    })
  } catch (error) {
    console.error("회사 정보 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("=== 회사 정보 저장 API 호출 ===")

    const body = await request.json()
    console.log("받은 데이터:", body)

    const result = await updateCompanyData(body)

    if (result.success) {
      return NextResponse.json({
        success: true,
        companyInfo: result.data,
        message: "회사 정보가 성공적으로 저장되었습니다.",
      })
    } else {
      throw new Error(result.error || "저장 실패")
    }
  } catch (error) {
    console.error("회사 정보 저장 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
