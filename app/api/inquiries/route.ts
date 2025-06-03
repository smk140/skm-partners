import { NextResponse } from "next/server"
import { getInquiriesData, saveInquiriesData, generateId } from "@/lib/file-db"
import { sendInquiryNotification } from "@/lib/discord"

export async function POST(request: Request) {
  try {
    console.log("Inquiry API called")
    const requestData = await request.json()
    console.log("Received data:", requestData)

    // 필수 필드 검증
    if (!requestData.name || !requestData.phone || !requestData.service) {
      console.log("Missing required fields:", {
        name: !!requestData.name,
        phone: !!requestData.phone,
        service: !!requestData.service,
      })
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    // 전화번호 형식 검증
    const phoneRegex = /^[0-9-+\s()]+$/
    if (!phoneRegex.test(requestData.phone)) {
      console.log("Invalid phone format:", requestData.phone)
      return NextResponse.json({ error: "올바른 전화번호 형식이 아닙니다." }, { status: 400 })
    }

    // 이메일 형식 검증 (선택사항)
    if (requestData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(requestData.email)) {
        console.log("Invalid email format:", requestData.email)
        return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 })
      }
    }

    // 개인정보 동의 검증
    if (!requestData.privacyConsent) {
      console.log("Privacy consent not given")
      return NextResponse.json({ error: "개인정보 수집 및 이용에 동의해주세요." }, { status: 400 })
    }

    // IP 주소 수집
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"

    // User-Agent 수집
    const userAgent = request.headers.get("user-agent") || "unknown"

    console.log("Client info:", { ip, userAgent })

    // 파일에 저장
    const data = getInquiriesData()

    const newInquiry = {
      id: generateId(data.inquiries),
      name: requestData.name,
      phone: requestData.phone,
      email: requestData.email || null,
      company: requestData.company || null,
      service: requestData.service,
      message: requestData.message || null,
      status: "pending",
      ip_address: ip,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
    }

    data.inquiries.unshift(newInquiry)

    const success = saveInquiriesData(data)

    if (!success) {
      return NextResponse.json({ error: "문의 저장에 실패했습니다." }, { status: 500 })
    }

    console.log("Inquiry saved:", newInquiry.id)

    // 디스코드 알림 발송 (비동기)
    console.log("Sending Discord notification...")
    try {
      const discordResult = await sendInquiryNotification({
        ...requestData,
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
        inquiryId: newInquiry.id,
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

    const data = getInquiriesData()
    let inquiries = data.inquiries

    if (status && status !== "all") {
      inquiries = inquiries.filter((inquiry: any) => inquiry.status === status)
    }

    // 최신순으로 정렬
    inquiries.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({
      inquiries,
      pagination: {
        page: 1,
        limit: 100,
        total: inquiries.length,
        totalPages: 1,
      },
    })
  } catch (error) {
    console.error("문의 목록 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()

    const data = getInquiriesData()
    const inquiryIndex = data.inquiries.findIndex((inquiry: any) => inquiry.id === id)

    if (inquiryIndex === -1) {
      return NextResponse.json({ error: "해당 문의를 찾을 수 없습니다." }, { status: 404 })
    }

    data.inquiries[inquiryIndex].status = status

    const success = saveInquiriesData(data)

    if (!success) {
      return NextResponse.json({ error: "상태 변경에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("문의 상태 변경 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
