import { type NextRequest, NextResponse } from "next/server"
import { readCompanyData, writeCompanyData } from "@/lib/file-db"

export async function GET() {
  try {
    console.log("🔥 회사 정보 GET 요청")
    const companyInfo = await readCompanyData()
    console.log("📖 읽어온 회사 정보:", companyInfo)

    return NextResponse.json({
      success: true,
      companyInfo: companyInfo,
    })
  } catch (error: any) {
    console.error("💥 회사 정보 읽기 실패:", error)
    return NextResponse.json({ success: false, error: "회사 정보를 읽을 수 없습니다." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔥 회사 정보 POST 요청")
    const body = await request.json()
    console.log("📝 받은 데이터:", body)

    // 기존 데이터 읽기
    const existingData = await readCompanyData()
    console.log("📖 기존 데이터:", existingData)

    // 새 데이터와 병합
    const updatedData = {
      ...existingData,
      ...body,
    }
    console.log("🔄 업데이트될 데이터:", updatedData)

    // 데이터 저장
    await writeCompanyData(updatedData)
    console.log("✅ 회사 정보 저장 완료")

    return NextResponse.json({
      success: true,
      companyInfo: updatedData,
    })
  } catch (error: any) {
    console.error("💥 회사 정보 저장 실패:", error)
    return NextResponse.json({ success: false, error: "회사 정보를 저장할 수 없습니다." }, { status: 500 })
  }
}
