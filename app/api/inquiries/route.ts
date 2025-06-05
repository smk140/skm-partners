import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

// 문의 조회
export async function GET() {
  try {
    console.log("=== 문의 조회 API 호출 ===")

    // 데이터베이스에서 문의 조회
    const result = await sql`
      SELECT * FROM inquiries 
      ORDER BY created_at DESC
    `

    console.log("조회된 문의 수:", result.rows.length)

    return NextResponse.json({
      success: true,
      inquiries: result.rows,
      total: result.rows.length,
    })
  } catch (error) {
    console.error("문의 조회 실패:", error)

    // 데이터베이스 연결 실패 시 빈 배열 반환
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

    // 데이터베이스에 저장
    try {
      const result = await sql`
        INSERT INTO inquiries (name, email, phone, message, company, service, type, status, created_at)
        VALUES (${name}, ${email}, ${phone || null}, ${message}, ${company || null}, ${service || "일반 문의"}, ${type || "contact"}, 'new', NOW())
        RETURNING *
      `

      console.log("문의 저장 성공:", result.rows[0])

      return NextResponse.json({
        success: true,
        message: "문의가 성공적으로 등록되었습니다.",
        inquiry: result.rows[0],
      })
    } catch (dbError) {
      console.error("데이터베이스 저장 실패:", dbError)

      // 테이블이 없는 경우 생성
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS inquiries (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            message TEXT NOT NULL,
            company VARCHAR(100),
            service VARCHAR(100),
            type VARCHAR(50) DEFAULT 'contact',
            status VARCHAR(20) DEFAULT 'new',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `

        // 테이블 생성 후 다시 저장 시도
        const result = await sql`
          INSERT INTO inquiries (name, email, phone, message, company, service, type, status, created_at)
          VALUES (${name}, ${email}, ${phone || null}, ${message}, ${company || null}, ${service || "일반 문의"}, ${type || "contact"}, 'new', NOW())
          RETURNING *
        `

        console.log("테이블 생성 후 문의 저장 성공:", result.rows[0])

        return NextResponse.json({
          success: true,
          message: "문의가 성공적으로 등록되었습니다.",
          inquiry: result.rows[0],
        })
      } catch (createError) {
        console.error("테이블 생성 및 저장 실패:", createError)
        return NextResponse.json({ error: "문의 등록에 실패했습니다." }, { status: 500 })
      }
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

    const result = await sql`
      UPDATE inquiries 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "문의를 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      inquiry: result.rows[0],
    })
  } catch (error) {
    console.error("문의 상태 업데이트 실패:", error)
    return NextResponse.json({ error: "상태 업데이트에 실패했습니다." }, { status: 500 })
  }
}
