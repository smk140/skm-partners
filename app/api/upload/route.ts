import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

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

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log("❌ 파일 크기 초과")
      return NextResponse.json(
        {
          success: false,
          error: "파일 크기는 10MB 이하여야 합니다.",
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

    // 업로드 디렉토리 생성
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
      console.log("📁 업로드 디렉토리 생성:", uploadDir)
    }

    // 파일명 생성 (타임스탬프 + 원본명)
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = path.join(uploadDir, fileName)

    console.log("💾 저장할 파일 경로:", filePath)

    // 파일 저장
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    console.log("✅ 파일 저장 완료!")

    // 웹에서 접근 가능한 URL 생성
    const fileUrl = `/uploads/${fileName}`

    const response = {
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      message: "파일이 성공적으로 업로드되었습니다.",
      timestamp: new Date().toISOString(),
    }

    console.log("📤 응답 데이터:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("💥 파일 업로드 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: "파일 업로드 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "파일 업로드 API 정상 작동 중",
    timestamp: new Date().toISOString(),
    maxSize: "10MB",
    supportedFormats: ["JPG", "PNG", "WebP", "GIF"],
    uploadPath: "/uploads/",
    status: "ready",
  })
}
