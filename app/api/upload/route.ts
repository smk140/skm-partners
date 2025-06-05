import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    console.log("=== 업로드 API 시작 ===")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("❌ 파일이 없음")
      return NextResponse.json({ error: "파일이 선택되지 않았습니다." }, { status: 400 })
    }

    console.log("📁 파일 정보:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // 파일 크기 체크 (5MB로 제한)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log("❌ 파일 크기 초과:", file.size)
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
    }

    // 파일 형식 체크
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.log("❌ 지원하지 않는 파일 형식:", file.type)
      return NextResponse.json({ error: "지원하지 않는 파일 형식입니다. (JPG, PNG, WebP만 가능)" }, { status: 400 })
    }

    try {
      // uploads 디렉토리 생성
      const uploadsDir = path.join(process.cwd(), "public", "uploads")
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
        console.log("📁 uploads 디렉토리 생성됨")
      }

      // 파일명 생성 (타임스탬프 + 원본명)
      const timestamp = Date.now()
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const filePath = path.join(uploadsDir, fileName)

      // 파일 저장
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      const publicUrl = `/uploads/${fileName}`
      console.log("✅ 파일 저장 완료:", publicUrl)

      // 성공 응답
      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        message: "이미지가 성공적으로 업로드되었습니다.",
      })
    } catch (fileError) {
      console.error("💥 파일 저장 실패:", fileError)

      // 파일 저장 실패 시 Base64 폴백
      console.log("🔄 Base64 폴백 시도...")
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString("base64")
      const dataUrl = `data:${file.type};base64,${base64}`

      console.log("✅ Base64 폴백 완료")

      return NextResponse.json({
        success: true,
        url: dataUrl,
        fileName: file.name,
        size: file.size,
        type: file.type,
        message: "이미지가 Base64로 업로드되었습니다.",
        fallback: true,
      })
    }
  } catch (error) {
    console.error("💥 업로드 API 오류:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "이미지 업로드 API가 정상 작동 중입니다.",
    timestamp: new Date().toISOString(),
  })
}
