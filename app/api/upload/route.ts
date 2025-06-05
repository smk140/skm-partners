import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("=== POST /api/upload ===")

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("파일이 없음")
      return NextResponse.json(
        {
          success: false,
          error: "파일이 선택되지 않았습니다.",
        },
        { status: 400 },
      )
    }

    console.log("파일 정보:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("파일 크기 초과")
      return NextResponse.json(
        {
          success: false,
          error: "파일 크기는 5MB 이하여야 합니다.",
        },
        { status: 400 },
      )
    }

    // 파일 형식 체크
    if (!file.type.startsWith("image/")) {
      console.log("이미지 파일이 아님")
      return NextResponse.json(
        {
          success: false,
          error: "이미지 파일만 업로드할 수 있습니다.",
        },
        { status: 400 },
      )
    }

    // Base64 변환
    console.log("Base64 변환 시작...")
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    console.log("Base64 변환 완료, 길이:", dataUrl.length)

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
      message: "이미지가 성공적으로 업로드되었습니다.",
    })
  } catch (error) {
    console.error("업로드 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "업로드 중 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "이미지 업로드 API 정상 작동 중",
    timestamp: new Date().toISOString(),
  })
}
