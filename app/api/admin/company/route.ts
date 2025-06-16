import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData } from "@/lib/file-db"

export async function GET() {
  console.log("=== 회사 정보 조회 API ===")
  try {
    const companyData = getCompanyData()
    console.log("회사 정보 조회 성공")
    return NextResponse.json(companyData)
  } catch (error) {
    console.error("회사 정보 조회 실패:", error)
    return NextResponse.json({ error: "회사 정보를 불러올 수 없습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  console.log("=== 회사 정보 저장 API ===")
  try {
    const body = await request.json()
    console.log("저장할 데이터:", JSON.stringify(body, null, 2))

    // 기존 데이터 가져오기
    const existingData = getCompanyData()

    // 새 데이터로 업데이트 (깊은 병합)
    const updatedData = {
      ...existingData,
      info: {
        ...existingData.info,
        ...body.info,
        site_images: {
          ...existingData.info.site_images,
          ...body.info?.site_images,
        },
      },
      executives: body.executives || existingData.executives,
      successCases: body.successCases || existingData.successCases,
    }

    console.log("업데이트된 데이터:", JSON.stringify(updatedData, null, 2))

    const success = saveCompanyData(updatedData)

    if (!success) {
      console.error("회사 정보 저장 실패")
      return NextResponse.json({ error: "회사 정보 저장에 실패했습니다." }, { status: 500 })
    }

    console.log("회사 정보 저장 성공")
    return NextResponse.json({
      success: true,
      message: "회사 정보가 성공적으로 저장되었습니다.",
      data: updatedData,
    })
  } catch (error) {
    console.error("회사 정보 저장 API 오류:", error)
    return NextResponse.json(
      {
        error: `회사 정보 저장에 실패했습니다: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
