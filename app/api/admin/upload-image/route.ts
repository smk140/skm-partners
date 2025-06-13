import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// 이미지 업로드 처리
export async function POST(request: Request) {
  try {
    const { image, filename } = await request.json()

    // Base64 데이터 추출 (data:image/jpeg;base64,/9j/4AAQSkZ... 형식에서 실제 데이터만 추출)
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "유효하지 않은 이미지 데이터입니다." }, { status: 400 })
    }

    const type = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, "base64")

    // 파일 타입 확인
    if (!type.startsWith("image/")) {
      return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다." }, { status: 400 })
    }

    // 파일 크기 확인 (5MB 제한)
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
    }

    // 파일명 생성 (중복 방지를 위해 타임스탬프 추가)
    const timestamp = Date.now()
    const ext = path.extname(filename) || ".jpg" // 확장자 추출 또는 기본값 사용
    const sanitizedFilename = path.basename(filename, ext).replace(/[^a-zA-Z0-9]/g, "-")
    const newFilename = `${sanitizedFilename}-${timestamp}${ext}`

    // 저장 경로 설정
    const publicDir = path.join(process.cwd(), "public")
    const uploadsDir = path.join(publicDir, "uploads")

    // uploads 디렉토리가 없으면 생성
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const filePath = path.join(uploadsDir, newFilename)

    // 파일 저장
    fs.writeFileSync(filePath, buffer)

    // 클라이언트에서 접근 가능한 URL 반환
    const fileUrl = `/uploads/${newFilename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: newFilename,
    })
  } catch (error) {
    console.error("이미지 업로드 중 오류:", error)
    return NextResponse.json({ error: "이미지 업로드에 실패했습니다." }, { status: 500 })
  }
}
