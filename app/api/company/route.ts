import { type NextRequest, NextResponse } from "next/server"
import { getCompanyData } from "@/lib/file-db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log("📡 API: /api/company GET 요청 받음")

    const companyData = await getCompanyData()
    console.log("📡 API: 회사 데이터 조회 완료:", {
      name: companyData.name,
      phone: companyData.phone,
      email: companyData.email,
      address: companyData.address,
    })

    // 캐시 방지 헤더 추가
    const response = NextResponse.json(companyData)
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Surrogate-Control", "no-store")

    return response
  } catch (error) {
    console.error("❌ API: 회사 데이터 조회 실패:", error)
    return NextResponse.json({ error: "회사 데이터를 불러올 수 없습니다." }, { status: 500 })
  }
}
