import { NextResponse } from "next/server"
import { getCompanyData } from "@/lib/file-db"

export async function GET() {
  try {
    const companyData = await getCompanyData()
    return NextResponse.json(companyData)
  } catch (error) {
    console.error("회사 정보 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
