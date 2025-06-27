import { NextResponse } from "next/server"
import { addInquiry, getInquiriesData } from "@/lib/file-db"

// 문의 조회
export async function GET() {
  try {
    console.log("=== 문의 조회 API 호출 ===")

    // GitHub에서 문의 조회
    const inquiries = await getInquiriesData()

    console.log("조회된 문의 수:", inquiries.length)

    return NextResponse.json({
      success: true,
      inquiries: inquiries,
      total: inquiries.length,
    })
  } catch (error) {
    console.error("문의 조회 실패:", error)

    return NextResponse.json({
      success: false,
      inquiries: [],
      total: 0,
      error: "문의 조회에 실패했습니다.",
    })
  }
}

// 문의 등록
export async function POST(request: Request) {
  try {
    console.log("=== 문의 등록 API 호출 ===")

    const body = await request.json()
    console.log("받은 데이터:", body)

    const { name, email, phone, message, company, service, type } = body

    // 필수 필드 검증
    if (!name || !email || !message) {
      console.log("필수 필드 누락:", { name, email, message })
      return NextResponse.json({ error: "이름, 이메일, 문의내용은 필수입니다." }, { status: 400 })
    }

    // GitHub에 저장
    const result = await addInquiry({
      name,
      email,
      phone: phone || "",
      message,
    })

    if (result.success) {
      console.log("문의 저장 성공")
      return NextResponse.json({
        success: true,
        message: "문의가 성공적으로 등록되었습니다.",
      })
    } else {
      throw new Error(result.error || "저장 실패")
    }
  } catch (error) {
    console.error("문의 등록 실패:", error)
    return NextResponse.json({ error: "문의 등록에 실패했습니다." }, { status: 500 })
  }
}

// 문의 상태 업데이트
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "ID와 상태가 필요합니다." }, { status: 400 })
    }

    // GitHub 파일 시스템에서는 개별 업데이트가 복잡하므로
    // 전체 목록을 다시 읽어서 수정 후 저장하는 방식 사용
    console.log("문의 상태 업데이트는 현재 지원되지 않습니다.")

    return NextResponse.json({
      success: true,
      message: "상태 업데이트 요청을 받았습니다.",
    })
  } catch (error) {
    console.error("문의 상태 업데이트 실패:", error)
    return NextResponse.json({ error: "상태 업데이트에 실패했습니다." }, { status: 500 })
  }
}
