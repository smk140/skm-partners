import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  console.log("업로드 API 호출됨")

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("파일이 없음")
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }

    console.log("파일 정보:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("파일 크기 초과:", file.size)
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
    }

    // 파일 형식 확인
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.log("지원하지 않는 파일 형식:", file.type)
      return NextResponse.json({ error: "지원하지 않는 파일 형식입니다." }, { status: 400 })
    }

    // 파일 데이터 읽기
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 안전한 파일명 생성
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const fileExtension = path.extname(file.name).toLowerCase()
    const safeFileName = `${timestamp}_${randomString}${fileExtension}`

    // 업로드 디렉토리 경로
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadDir, safeFileName)

    console.log("업로드 디렉토리:", uploadDir)
    console.log("파일 경로:", filePath)

    // 디렉토리 생성 (존재하지 않는 경우)
    if (!existsSync(uploadDir)) {
      console.log("업로드 디렉토리 생성 중...")
      await mkdir(uploadDir, { recursive: true })
    }

    // 파일 저장
    await writeFile(filePath, buffer)
    console.log("파일 저장 완료:", filePath)

    // 웹 접근 가능한 URL
    const fileUrl = `/uploads/${safeFileName}`
    console.log("파일 URL:", fileUrl)

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: safeFileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("업로드 처리 중 오류:", error)
    return NextResponse.json(
      {
        error: "파일 업로드 중 서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}

// GET 요청도 처리 (테스트용)
export async function GET() {
  return NextResponse.json({ message: "업로드 API가 작동 중입니다." })
}
