import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData } from "@/lib/file-db"

export async function GET() {
  console.log("=== 회사 정보 조회 API 시작 ===")
  try {
    const data = getCompanyData()
    console.log("회사 정보 조회 성공")
    // 전체 회사 데이터를 반환합니다. 클라이언트에서 필요에 따라 success:true를 확인할 수 있습니다.
    return NextResponse.json(data)
  } catch (error) {
    console.error("회사 정보 조회 오류:", error)
    return NextResponse.json({ error: "회사 정보 조회 실패" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  console.log("=== 회사 정보 업데이트 API 시작 ===")
  try {
    const body = await request.json() // 클라이언트에서 업데이트할 필드를 포함한 객체를 보냅니다.
    console.log("수신된 업데이트 데이터:", JSON.stringify(body, null, 2))

    const existingData = getCompanyData()
    const updatedData = { ...existingData } // 기존 데이터로 시작

    // 'info' 필드가 요청 본문에 있으면 업데이트
    if (body.info) {
      updatedData.info = {
        ...(existingData.info || {}), // 기존 info 데이터 유지
        ...body.info, // 새로운 info 데이터 병합
        site_images: {
          ...((existingData.info && existingData.info.site_images) || {}), // 기존 site_images 유지
          ...((body.info && body.info.site_images) || {}), // 새로운 site_images 병합 (Blob URL 포함)
        },
      }
    }

    // 'executives' 필드가 요청 본문에 있으면 업데이트 (undefined와 null을 구분하여 빈 배열 전송 가능)
    if (body.executives !== undefined) {
      updatedData.executives = body.executives
    }

    // 'successCases' 필드가 요청 본문에 있으면 업데이트
    if (body.successCases !== undefined) {
      updatedData.successCases = body.successCases
    }

    // 여기에 다른 최상위 레벨 키 (예: 'history', 'philosophy' 등)가 있다면 유사한 로직 추가

    console.log("최종 업데이트될 데이터:", JSON.stringify(updatedData, null, 2))

    const success = saveCompanyData(updatedData)

    if (!success) {
      console.error("회사 정보 저장 실패")
      return NextResponse.json({ error: "회사 정보 저장에 실패했습니다." }, { status: 500 })
    }

    console.log("회사 정보 저장 성공")
    return NextResponse.json({
      success: true,
      message: "회사 정보가 성공적으로 업데이트되었습니다.",
      data: updatedData, // 업데이트된 전체 데이터 반환
    })
  } catch (error) {
    console.error("회사 정보 업데이트 API 오류:", error)
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류 발생"
    return NextResponse.json(
      {
        error: `회사 정보 업데이트에 실패했습니다: ${errorMessage}`,
      },
      { status: 500 },
    )
  }
}
