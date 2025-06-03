import { NextResponse } from "next/server"
import { sendQuickInquiryNotification } from "@/lib/discord"

// 이 파일은 실제 서버 구현을 위한 예시입니다.
// 실제 프로젝트에서는 데이터베이스 연결 등이 필요합니다.

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 필수 필드 검증
    if (!data.name || !data.phone || !data.service) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    // 여기서 데이터베이스에 저장하거나 이메일 발송 등의 작업을 수행합니다
    // 예: await db.consultations.create({ data })

    console.log("상담 요청 접수:", data)

    // Discord 알림 발송
    await sendQuickInquiryNotification(data)

    // 성공 응답
    return NextResponse.json({ success: true, message: "상담 요청이 접수되었습니다." }, { status: 201 })
  } catch (error) {
    console.error("상담 요청 처리 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
