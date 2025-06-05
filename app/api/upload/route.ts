import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("=== 파일 업로드 API 시작 ===")

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("❌ 파일이 없음")
      return NextResponse.json(
        {
          success: false,
          error: "파일이 선택되지 않았습니다.",
        },
        { status: 400 },
      )
    }

    console.log("📁 파일 정보:", {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type,
    })

    // 파일 크기 체크 (5MB로 줄임)
    if (file.size > 5 * 1024 * 1024) {
      console.log("❌ 파일 크기 초과")
      return NextResponse.json(
        {
          success: false,
          error: "파일 크기는 5MB 이하여야 합니다.",
        },
        { status: 400 },
      )
    }

    // 파일 형식 체크
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      console.log("❌ 지원하지 않는 파일 형식:", file.type)
      return NextResponse.json(
        {
          success: false,
          error: "지원하지 않는 파일 형식입니다. JPG, PNG, WebP, GIF만 가능합니다.",
        },
        { status: 400 },
      )
    }

    // Base64로 변환 (파일 시스템 대신)
    console.log("🔄 Base64 변환 시작...")
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    console.log("✅ Base64 변환 완료!")
    console.log("📊 데이터 URL 길이:", `${(dataUrl.length / 1024).toFixed(2)}KB`)

    // 변환 검증
    if (!dataUrl.startsWith("data:image/") || dataUrl.length < 100) {
      console.error("❌ 잘못된 데이터 URL")
      return NextResponse.json(
        {
          success: false,
          error: "이미지 변환에 실패했습니다.",
        },
        { status: 500 },
      )
    }

    const response = {
      success: true,
      url: dataUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
      message: "이미지가 성공적으로 업로드되었습니다.",
      timestamp: new Date().toISOString(),
    }

    console.log("✅ 업로드 성공!")
    return NextResponse.json(response)
  } catch (error) {
    console.error("💥 업로드 API 오류:", error)

    // 더 자세한 오류 정보 제공
    let errorMessage = "파일 업로드 중 오류가 발생했습니다."
    let errorDetails = "알 수 없는 오류"

    if (error instanceof Error) {
      errorDetails = error.message
      if (error.message.includes("File too large")) {
        errorMessage = "파일 크기가 너무 큽니다."
      } else if (error.message.includes("Invalid file")) {
        errorMessage = "유효하지 않은 파일입니다."
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "파일 업로드 API 정상 작동 중",
    timestamp: new Date().toISOString(),
    maxSize: "5MB",
    supportedFormats: ["JPG", "PNG", "WebP", "GIF"],
    method: "Base64 encoding",
    status: "ready",
  })
}
