import { NextResponse } from "next/server"
import { sendInquiryNotification } from "@/lib/discord"

// 임시 데이터 저장소
const inquiries: any[] = []
let nextId = 1

export async function POST(request: Request) {
  try {
    console.log("Inquiry API called")
    const data = await request.json()
    console.log("Received data:", data)

    // 필수 필드 검증
    if (!data.name || !data.phone || !data.service) {
      console.log("Missing required fields:", { name: !!data.name, phone: !!data.phone, service: !!data.service })
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    // 전화번호 형식 검증
    const phoneRegex = /^[0-9-+\s()]+$/
    if (!phoneRegex.test(data.phone)) {
      console.log("Invalid phone format:", data.phone)
      return NextResponse.json({ error: "올바른 전화번호 형식이 아닙니다." }, { status: 400 })
    }

    // 이메일 형식 검증 (선택사항)
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        console.log("Invalid email format:", data.email)
        return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 })
      }
    }

    // 개인정보 동의 검증
    if (!data.privacyConsent) {
      console.log("Privacy consent not given")
      return NextResponse.json({ error: "개인정보 수집 및 이용에 동의해주세요." }, { status: 400 })
    }

    // IP 주소 수집
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // User-Agent 수집
    const userAgent = request.headers.get("user-agent") || "unknown"

    console.log("Client info:", { ip, userAgent })

    // 임시 데이터 저장
    const inquiry = {
      id: nextId++,
      ...data,
      ip_address: ip,
      user_agent: userAgent,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    inquiries.push(inquiry)
    console.log("Inquiry saved:", inquiry.id)

    // 디스코드 알림 발송 (비동기)
    console.log("Sending Discord notification...")
    try {
      const discordResult = await sendInquiryNotification({
        ...data,
        ip_address: ip,
        user_agent: userAgent,
      })
      console.log("Discord notification result:", discordResult)
    } catch (discordError) {
      console.error("Discord notification failed:", discordError)
    }

    return NextResponse.json(
      {
        success: true,
        message: "문의가 성공적으로 접수되었습니다.",
        inquiryId: inquiry.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("문의 처리 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let filteredInquiries = inquiries

    if (status && status !== "all") {
      filteredInquiries = inquiries.filter((inquiry) => inquiry.status === status)
    }

    return NextResponse.json({
      inquiries: filteredInquiries,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredInquiries.length,
        totalPages: 1,
      },
    })
  } catch (error) {
    console.error("문의 목록 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
