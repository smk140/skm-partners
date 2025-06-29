import { type NextRequest, NextResponse } from "next/server"
import { addInquiry, getInquiriesData } from "@/lib/file-db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 })
    }

    const result = await addInquiry({
      name,
      email,
      phone: phone || "",
      message,
    })

    if (result.success) {
      return NextResponse.json({ message: "문의가 성공적으로 접수되었습니다." })
    } else {
      return NextResponse.json({ error: result.error || "문의 접수에 실패했습니다." }, { status: 500 })
    }
  } catch (error) {
    console.error("문의 접수 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const inquiries = await getInquiriesData()
    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error("문의 목록 조회 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
