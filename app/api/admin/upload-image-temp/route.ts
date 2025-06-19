import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  console.log("🔥🔥🔥 === 임시 이미지 업로드 API 시작 === 🔥🔥🔥")

  try {
    const body = await request.json()
    const { image, filename } = body

    if (!image || !filename) {
      return NextResponse.json({ error: "이미지와 파일명이 필요합니다" }, { status: 400 })
    }

    // Base64 데이터 변환
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: "유효하지 않은 이미지 데이터입니다" }, { status: 400 })
    }

    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, "base64")

    // 고유한 파일명 생성
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = filename.split(".").pop() || "jpg"
    const uniqueFilename = `${timestamp}-${randomId}.${extension}`

    // public/uploads 폴더에 저장
    const uploadsDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const filePath = join(uploadsDir, uniqueFilename)
    await writeFile(filePath, buffer)

    const imageUrl = `/uploads/${uniqueFilename}`

    console.log("🔥 임시 이미지 저장 성공:", imageUrl)

    return NextResponse.json({
      success: true,
      url: imageUrl,
      originalFilename: filename,
      size: buffer.length,
    })
  } catch (error) {
    console.error("💥 임시 이미지 업로드 실패:", error)
    return NextResponse.json({ error: `이미지 업로드 실패: ${error.message}` }, { status: 500 })
  }
}
