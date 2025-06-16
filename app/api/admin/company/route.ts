import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData } from "@/lib/file-db"

export async function GET() {
  console.log("🔥🔥🔥 === 회사 정보 조회 API 시작 === 🔥🔥🔥")
  try {
    const data = getCompanyData()
    console.log("🔥 조회 성공, 반환 데이터:", JSON.stringify(data, null, 2))
    return NextResponse.json(data)
  } catch (error) {
    console.error("💥 조회 실패:", error)
    return NextResponse.json({ error: "데이터 조회 실패" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  console.log("🔥🔥🔥 === 회사 정보 저장 API 시작 === 🔥🔥🔥")
  try {
    const requestBody = await request.json()
    console.log("🔥 받은 요청 전체:", JSON.stringify(requestBody, null, 2))

    const { type, data } = requestBody

    if (!type) {
      console.error("💥 type이 없음")
      return NextResponse.json({ error: "type이 필요합니다" }, { status: 400 })
    }

    if (data === undefined || data === null) {
      console.error("💥 data가 없음")
      return NextResponse.json({ error: "data가 필요합니다" }, { status: 400 })
    }

    console.log("🔥 요청 타입:", type)
    console.log("🔥 요청 데이터:", JSON.stringify(data, null, 2))

    // 기존 데이터 가져오기
    const currentData = getCompanyData()
    console.log("🔥 현재 저장된 데이터:", JSON.stringify(currentData, null, 2))

    const updatedData = { ...currentData }

    if (type === "company") {
      console.log("🔥 회사 정보 업데이트 중...")
      updatedData.info = data
      console.log("🔥 업데이트된 info:", JSON.stringify(updatedData.info, null, 2))
    } else if (type === "executives") {
      console.log("🔥 임원 정보 업데이트 중...")
      updatedData.executives = data
      console.log("🔥 업데이트된 executives:", JSON.stringify(updatedData.executives, null, 2))
    } else {
      console.error("💥 알 수 없는 타입:", type)
      return NextResponse.json({ error: "잘못된 타입" }, { status: 400 })
    }

    console.log("🔥 최종 저장할 데이터:", JSON.stringify(updatedData, null, 2))

    // 파일에 저장
    const saveResult = saveCompanyData(updatedData)
    console.log("🔥 저장 결과:", saveResult)

    if (!saveResult) {
      console.error("💥 파일 저장 실패")
      return NextResponse.json({ error: "파일 저장 실패" }, { status: 500 })
    }

    // 저장 후 다시 읽어서 확인
    const verifyData = getCompanyData()
    console.log("🔥 저장 후 검증 데이터:", JSON.stringify(verifyData, null, 2))

    console.log("🔥🔥🔥 === 저장 완료! === 🔥🔥🔥")

    return NextResponse.json({
      success: true,
      message: "저장 완료",
      savedData: updatedData,
    })
  } catch (error) {
    console.error("💥💥💥 저장 중 치명적 오류:", error)
    console.error("💥 오류 스택:", error.stack)
    return NextResponse.json(
      {
        error: `저장 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 },
    )
  }
}
