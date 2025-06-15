import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import os from "os"

// 임시 디렉토리를 사용한 이미지 업로드 (대안)
export async function POST(request: Request) {
  console.log("=== 임시 디렉토리 이미지 업로드 API 시작 ===")

  try {
    const { image, filename } = await request.json()

    if (!image || !filename) {
      return NextResponse.json({ error: "이미지 데이터와 파일명이 필요합니다." }, { status: 400 })
    }

    // Base64 데이터 추출
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "유효하지 않은 이미지 데이터입니다." }, { status: 400 })
    }

    const type = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, "base64")

    // 파일 크기 확인
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
    }

    // 임시 디렉토리 사용
    const tempDir = os.tmpdir()
    const uploadsDir = path.join(tempDir, "skm-uploads")

    console.log("임시 업로드 디렉토리:", uploadsDir)

    // 임시 디렉토리 생성
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
      console.log("임시 디렉토리 생성됨")
    }

    // 파일명 생성
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(filename).toLowerCase() || ".jpg"
    const newFilename = `temp-${timestamp}-${randomId}${ext}`

    const filePath = path.join(uploadsDir, newFilename)

    // 파일 저장
    await writeFile(filePath, buffer)
    console.log("임시 파일 저장 완료:", filePath)

    // Base64 URL로 반환 (임시 방법)
    const base64Url = `data:${type};base64,${base64Data}`

    return NextResponse.json({
      success: true,
      url: base64Url, // 임시로 Base64 URL 사용
      filename: newFilename,
      tempPath: filePath,
      message: "임시 저장 완료 (Base64 URL 사용)",
    })
  } catch (error) {
    console.error("임시 업로드 오류:", error)
    return NextResponse.json(
      {
        error: `임시 업로드 실패: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
