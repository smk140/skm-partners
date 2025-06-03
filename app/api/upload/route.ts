import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
    }

    // 허용된 파일 형식 확인
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "지원하지 않는 파일 형식입니다." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${timestamp}_${originalName}`

    // public/uploads 디렉토리에 저장
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadDir, fileName)

    // 디렉토리가 없으면 생성
    const fs = require("fs")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    await writeFile(filePath, buffer)

    // 웹에서 접근 가능한 URL 반환
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("파일 업로드 실패:", error)
    return NextResponse.json({ error: "파일 업로드에 실패했습니다." }, { status: 500 })
  }
}
