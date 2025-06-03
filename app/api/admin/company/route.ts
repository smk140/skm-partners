import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData } from "@/lib/file-db"

// 회사 정보 조회
export async function GET() {
  try {
    const data = getCompanyData()
    return NextResponse.json({
      companyInfo: data.info,
      executives: data.executives,
      successCases: data.successCases,
    })
  } catch (error) {
    console.error("회사 정보 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 회사 정보 업데이트
export async function PUT(request: Request) {
  try {
    const { type, data: updateData } = await request.json()
    const companyData = getCompanyData()

    if (type === "company") {
      // 회사 기본 정보 업데이트
      companyData.info = {
        ...companyData.info,
        ...updateData,
      }
    } else if (type === "executives") {
      // 임원 정보 업데이트
      companyData.executives = updateData.map((exec: any) => ({
        ...exec,
        id: exec.id > 0 ? exec.id : Date.now() + Math.random(), // 새로운 ID 생성
      }))
    } else if (type === "success_cases") {
      // 성공 사례 업데이트
      companyData.successCases = updateData.map((caseItem: any) => ({
        ...caseItem,
        id: caseItem.id > 0 ? caseItem.id : Date.now() + Math.random(), // 새로운 ID 생성
      }))
    }

    const success = saveCompanyData(companyData)

    if (!success) {
      return NextResponse.json({ error: "데이터 저장에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("회사 정보 업데이트 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 개별 항목 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = Number.parseInt(searchParams.get("id") || "0")

    if (!type || !id) {
      return NextResponse.json({ error: "타입과 ID가 필요합니다." }, { status: 400 })
    }

    const companyData = getCompanyData()

    if (type === "executive") {
      companyData.executives = companyData.executives.filter((exec: any) => exec.id !== id)
    } else if (type === "success-case") {
      companyData.successCases = companyData.successCases.filter((caseItem: any) => caseItem.id !== id)
    } else {
      return NextResponse.json({ error: "유효하지 않은 타입입니다." }, { status: 400 })
    }

    const success = saveCompanyData(companyData)

    if (!success) {
      return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("항목 삭제 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
