import { NextResponse } from "next/server"

// 이 파일은 실제 서버 구현을 위한 예시입니다.
// 실제 프로젝트에서는 데이터베이스 연결 등이 필요합니다.

export async function GET() {
  try {
    // 여기서 데이터베이스에서 후기 목록을 가져옵니다
    // 예: const testimonials = await db.testimonials.findMany({ where: { approved: true } })

    // 임시 데이터
    const testimonials = [
      {
        id: 1,
        name: "김철수",
        position: "건물주, 서울 강남",
        service: "cleaning",
        rating: 5,
        review:
          "SKM파트너스의 서비스는 정말 만족스럽습니다. 건물 관리가 한결 수월해졌고, 입주자들의 만족도도 높아졌습니다.",
        createdAt: new Date().toISOString(),
      },
      // 더 많은 후기 데이터...
    ]

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("후기 목록 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 필수 필드 검증
    if (!data.name || !data.phone || !data.service || !data.rating || !data.review) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 })
    }

    // 고객 인증 검증
    // 실제로는 데이터베이스에서 고객 정보를 확인합니다
    // 예: const customer = await db.consultations.findFirst({ where: { phone: data.phone, name: data.name } })
    // if (!customer) {
    //   return NextResponse.json(
    //     { error: "고객 정보를 찾을 수 없습니다." },
    //     { status: 403 }
    //   )
    // }

    // 후기 저장
    // 예: await db.testimonials.create({ data: { ...data, approved: false } })

    console.log("후기 등록:", data)

    // 성공 응답
    return NextResponse.json({ success: true, message: "후기가 등록되었습니다." }, { status: 201 })
  } catch (error) {
    console.error("후기 등록 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
