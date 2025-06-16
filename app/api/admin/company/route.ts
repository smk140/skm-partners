import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData } from "@/lib/file-db"

export async function GET() {
  console.log("=== 회사 정보 조회 API 시작 ===")
  try {
    const data = getCompanyData()
    console.log("회사 정보 조회 성공:", data)
    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error("회사 정보 조회 오류:", error)
    return NextResponse.json({ success: false, error: "회사 정보 조회 실패" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  console.log("=== 회사 정보 업데이트 API 시작 ===")
  try {
    const body = await request.json()
    const { type, data } = body

    console.log("요청 타입:", type)
    console.log("요청 데이터:", data)

    if (!type || !data) {
      return NextResponse.json({ success: false, error: "타입과 데이터가 필요합니다." }, { status: 400 })
    }

    const currentData = getCompanyData()
    let updatedData

    if (type === "company") {
      updatedData = {
        ...currentData,
        info: {
          ...currentData.info,
          ...data,
          // site_images 객체가 없으면 생성
          site_images: {
            ...(currentData.info.site_images || {}),
            ...(data.site_images || {}),
          },
        },
      }
      console.log("회사 정보 업데이트:", updatedData.info)
    } else if (type === "executives") {
      updatedData = {
        ...currentData,
        executives: data,
      }
      console.log("임원 정보 업데이트:", updatedData.executives)
    } else {
      return NextResponse.json({ success: false, error: "잘못된 타입입니다." }, { status: 400 })
    }

    const saveSuccess = saveCompanyData(updatedData)

    if (saveSuccess) {
      console.log("회사 정보 저장 성공")
      return NextResponse.json({ success: true, message: "정보가 성공적으로 저장되었습니다." })
    } else {
      console.error("회사 정보 저장 실패")
      return NextResponse.json({ success: false, error: "정보 저장에 실패했습니다." }, { status: 500 })
    }
  } catch (error) {
    console.error("회사 정보 업데이트 오류:", error)
    return NextResponse.json({ success: false, error: "정보 업데이트 중 오류 발생" }, { status: 500 })
  }
}
