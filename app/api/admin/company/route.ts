import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData } from "@/lib/file-db"

export async function GET() {
  console.log("=== 회사 정보 GET API 호출 ===")

  try {
    const data = getCompanyData()
    console.log("GET - 회사 데이터 조회 성공:", Object.keys(data))

    return NextResponse.json({
      success: true,
      info: data.info || {},
      executives: data.executives || [],
      companyInfo: data.info || {}, // 메인 페이지 호환성을 위해 추가
    })
  } catch (error) {
    console.error("GET - 회사 데이터 조회 실패:", error)
    return NextResponse.json(
      {
        success: false,
        error: "회사 정보를 불러오는데 실패했습니다",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  console.log("=== 회사 정보 PUT API 호출 ===")

  try {
    const body = await request.json()
    const { type, data: requestData } = body

    console.log("PUT - 요청 타입:", type)
    console.log("PUT - 요청 데이터 키:", Object.keys(requestData || {}))

    if (!type || !requestData) {
      return NextResponse.json({ success: false, error: "타입과 데이터가 필요합니다" }, { status: 400 })
    }

    // 현재 데이터 가져오기
    const currentData = getCompanyData()
    console.log("PUT - 현재 데이터 구조:", Object.keys(currentData))

    const updatedData = { ...currentData }

    if (type === "company") {
      // 회사 기본 정보 업데이트
      updatedData.info = {
        ...currentData.info,
        ...requestData,
      }
      console.log("PUT - 회사 정보 업데이트됨")
    } else if (type === "executives") {
      // 임원 정보 업데이트
      updatedData.executives = requestData
      console.log("PUT - 임원 정보 업데이트됨, 개수:", requestData.length)
    } else {
      return NextResponse.json({ success: false, error: "지원하지 않는 타입입니다" }, { status: 400 })
    }

    // 데이터 저장
    const saveSuccess = saveCompanyData(updatedData)

    if (!saveSuccess) {
      throw new Error("데이터 저장에 실패했습니다")
    }

    console.log("PUT - 데이터 저장 성공")

    return NextResponse.json({
      success: true,
      message: `${type === "company" ? "회사 정보" : "임원 정보"}가 성공적으로 저장되었습니다`,
      data: type === "company" ? updatedData.info : updatedData.executives,
    })
  } catch (error) {
    console.error("PUT - 회사 정보 저장 실패:", error)
    return NextResponse.json(
      {
        success: false,
        error: "회사 정보 저장에 실패했습니다",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
