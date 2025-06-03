import { NextResponse } from "next/server"
import { getInquiriesData, saveInquiriesData, generateId } from "@/lib/file-db"
import { sendDiscordNotification } from "@/lib/discord"

// 문의 목록 조회
export async function GET() {
  try {
    const data = getInquiriesData()
    return NextResponse.json({
      inquiries: data.inquiries || [],
      total: data.inquiries?.length || 0,
    })
  } catch (error) {
    console.error("문의 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 새 문의 추가
export async function POST(request: Request) {
  try {
    const { name, email, phone, service, message } = await request.json()

    // 입력 검증
    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    const data = getInquiriesData()
    const newInquiry = {
      id: generateId(data.inquiries || []),
      name,
      email,
      phone: phone || "",
      service,
      message,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    data.inquiries = data.inquiries || []
    data.inquiries.push(newInquiry)

    const success = saveInquiriesData(data)

    if (!success) {
      return NextResponse.json({ error: "문의 저장에 실패했습니다." }, { status: 500 })
    }

    // Discord 알림 발송
    try {
      await sendDiscordNotification({
        title: "📝 새로운 문의 접수",
        description: `새로운 고객 문의가 접수되었습니다.`,
        color: 0x0099ff,
        fields: [
          {
            name: "고객명",
            value: name,
            inline: true,
          },
          {
            name: "서비스",
            value: service,
            inline: true,
          },
          {
            name: "이메일",
            value: email,
            inline: true,
          },
          {
            name: "문의 내용",
            value: message.length > 100 ? message.substring(0, 100) + "..." : message,
            inline: false,
          },
        ],
      })
    } catch (discordError) {
      console.error("Discord 알림 발송 실패:", discordError)
    }

    return NextResponse.json({
      success: true,
      inquiry: newInquiry,
    })
  } catch (error) {
    console.error("문의 추가 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 문의 상태 업데이트
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "ID와 상태가 필요합니다." }, { status: 400 })
    }

    const data = getInquiriesData()
    const inquiryIndex = data.inquiries?.findIndex((inquiry: any) => inquiry.id === id)

    if (inquiryIndex === -1 || inquiryIndex === undefined) {
      return NextResponse.json({ error: "문의를 찾을 수 없습니다." }, { status: 404 })
    }

    data.inquiries[inquiryIndex].status = status
    data.inquiries[inquiryIndex].updated_at = new Date().toISOString()

    const success = saveInquiriesData(data)

    if (!success) {
      return NextResponse.json({ error: "상태 업데이트에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      inquiry: data.inquiries[inquiryIndex],
    })
  } catch (error) {
    console.error("문의 상태 업데이트 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
