import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { getInquiriesData, saveInquiriesData, generateId } from "@/lib/file-db"

// 문의 조회
export async function GET() {
  try {
    // 실제 데이터베이스에서 문의 조회
    const result = await sql`
      SELECT * FROM inquiries 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ inquiries: result.rows })
  } catch (error) {
    console.error("문의 조회 실패:", error)

    // 데이터베이스 연결 실패 시 파일 기반 백업 데이터 사용
    try {
      const data = getInquiriesData()
      return NextResponse.json({ inquiries: data.inquiries || [] })
    } catch (backupError) {
      console.error("백업 데이터 조회 실패:", backupError)
      return NextResponse.json({ error: "문의 조회에 실패했습니다.", inquiries: [] }, { status: 500 })
    }
  }
}

// 문의 등록
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, type } = body

    // 필수 필드 검증
    if (!name || !phone || !message) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    // 데이터베이스에 저장
    try {
      const result = await sql`
        INSERT INTO inquiries (name, email, phone, message, type, status)
        VALUES (${name}, ${email || null}, ${phone}, ${message}, ${type || "일반"}, 'new')
        RETURNING *
      `

      return NextResponse.json({
        success: true,
        message: "문의가 성공적으로 등록되었습니다.",
        inquiry: result.rows[0],
      })
    } catch (dbError) {
      console.error("데이터베이스 저장 실패:", dbError)

      // 데이터베이스 저장 실패 시 파일에 백업
      const data = getInquiriesData()
      const newInquiry = {
        id: generateId(data.inquiries),
        name,
        email: email || null,
        phone,
        message,
        type: type || "일반",
        status: "new",
        created_at: new Date().toISOString(),
      }

      data.inquiries.push(newInquiry)
      saveInquiriesData(data)

      return NextResponse.json({
        success: true,
        message: "문의가 성공적으로 등록되었습니다. (백업 저장)",
        inquiry: newInquiry,
      })
    }
  } catch (error) {
    console.error("문의 등록 실패:", error)
    return NextResponse.json({ error: "문의 등록에 실패했습니다." }, { status: 500 })
  }
}
