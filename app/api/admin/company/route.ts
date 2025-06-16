import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData } from "@/lib/file-db"

export async function GET() {
  console.log("=== 회사 정보 조회 API 시작 ===")
  try {
    const data = getCompanyData()
    console.log("회사 정보 조회 성공")
    return NextResponse.json(data) // { info: {...}, executives: [...] } 구조로 반환
  } catch (error) {
    console.error("회사 정보 조회 오류:", error)
    return NextResponse.json({ error: "회사 정보 조회 실패" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  console.log("=== 회사 정보 업데이트 API 시작 ===")
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || data === undefined) {
      return NextResponse.json({ error: "요청에 'type'과 'data'가 필요합니다." }, { status: 400 })
    }

    const existingData = getCompanyData()
    const updatedData = { ...existingData }

    if (type === "company") {
      console.log("회사 정보(info) 업데이트 중...")
      // 클라이언트에서 받은 data는 info 객체에 해당
      updatedData.info = {
        ...existingData.info,
        ...data,
      }
    } else if (type === "executives") {
      console.log("임원 정보(executives) 업데이트 중...")
      // 클라이언트에서 받은 data는 executives 배열에 해당
      updatedData.executives = data
    } else {
      return NextResponse.json({ error: `알 수 없는 타입: ${type}` }, { status: 400 })
    }

    const success = saveCompanyData(updatedData)

    if (!success) {
      console.error("파일 DB 저장 실패")
      return NextResponse.json({ error: "서버에서 정보를 저장하는 데 실패했습니다." }, { status: 500 })
    }

    console.log("회사 정보 저장 성공")
    return NextResponse.json({
      success: true,
      message: "정보가 성공적으로 저장되었습니다.",
    })
  } catch (error) {
    console.error("회사 정보 업데이트 API 오류:", error)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류 발생"
    return NextResponse.json({ error: `정보 업데이트 중 서버 오류가 발생했습니다: ${errorMessage}` }, { status: 500 })
  }
}
