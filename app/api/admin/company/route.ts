import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData } from "@/lib/file-db"

export async function GET() {
  console.log("=== 회사 정보 조회 시작 ===")
  try {
    const data = getCompanyData()
    console.log("조회된 데이터:", JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (error) {
    console.error("조회 실패:", error)
    return NextResponse.json({ error: "데이터 조회 실패" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  console.log("=== 회사 정보 저장 시작 ===")
  try {
    const requestBody = await request.json()
    console.log("받은 요청:", JSON.stringify(requestBody, null, 2))

    const { type, data } = requestBody

    if (!type || !data) {
      console.error("잘못된 요청 형식")
      return NextResponse.json({ error: "type과 data가 필요합니다" }, { status: 400 })
    }

    // 기존 데이터 가져오기
    const currentData = getCompanyData()
    console.log("현재 데이터:", JSON.stringify(currentData, null, 2))

    const updatedData = { ...currentData }

    if (type === "company") {
      // 회사 정보 업데이트
      updatedData.info = data
      console.log("회사 정보 업데이트 완료")
    } else if (type === "executives") {
      // 임원 정보 업데이트
      updatedData.executives = data
      console.log("임원 정보 업데이트 완료")
    } else {
      console.error("알 수 없는 타입:", type)
      return NextResponse.json({ error: "잘못된 타입" }, { status: 400 })
    }

    console.log("저장할 최종 데이터:", JSON.stringify(updatedData, null, 2))

    // 파일에 저장
    const saveResult = saveCompanyData(updatedData)
    console.log("저장 결과:", saveResult)

    if (!saveResult) {
      console.error("파일 저장 실패")
      return NextResponse.json({ error: "파일 저장 실패" }, { status: 500 })
    }

    // 저장 후 다시 읽어서 확인
    const verifyData = getCompanyData()
    console.log("저장 후 확인 데이터:", JSON.stringify(verifyData, null, 2))

    return NextResponse.json({
      success: true,
      message: "저장 완료",
      savedData: updatedData,
    })
  } catch (error) {
    console.error("저장 중 오류:", error)
    return NextResponse.json(
      {
        error: `저장 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 },
    )
  }
}
