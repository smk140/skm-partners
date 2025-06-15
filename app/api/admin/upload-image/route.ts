import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// 이미지 업로드 처리
export async function POST(request: Request) {
  console.log("=== 이미지 업로드 API 시작 ===")

  try {
    // 요청 본문 파싱
    let body
    try {
      body = await request.json()
      console.log("요청 본문 파싱 성공")
    } catch (parseError) {
      console.error("요청 본문 파싱 실패:", parseError)
      return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 })
    }

    const { image, filename } = body

    if (!image || !filename) {
      console.log("이미지 또는 파일명이 없음")
      return NextResponse.json({ error: "이미지 데이터와 파일명이 필요합니다." }, { status: 400 })
    }

    console.log("파일명:", filename)
    console.log("이미지 데이터 길이:", image.length)

    // Base64 데이터 추출
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

    if (!matches || matches.length !== 3) {
      console.log("Base64 형식이 잘못됨")
      return NextResponse.json({ error: "유효하지 않은 이미지 데이터입니다." }, { status: 400 })
    }

    const type = matches[1]
    const base64Data = matches[2]

    console.log("이미지 타입:", type)
    console.log("Base64 데이터 길이:", base64Data.length)

    // 파일 타입 확인
    if (!type.startsWith("image/")) {
      console.log("이미지 파일이 아님:", type)
      return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다." }, { status: 400 })
    }

    // Buffer로 변환
    let buffer
    try {
      buffer = Buffer.from(base64Data, "base64")
      console.log("Buffer 변환 성공, 크기:", buffer.length)
    } catch (bufferError) {
      console.error("Buffer 변환 실패:", bufferError)
      return NextResponse.json({ error: "이미지 데이터 처리 중 오류가 발생했습니다." }, { status: 400 })
    }

    // 파일 크기 확인 (5MB 제한)
    if (buffer.length > 5 * 1024 * 1024) {
      console.log("파일 크기 초과:", buffer.length)
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다." }, { status: 400 })
    }

    // 파일명 생성 (더 안전한 방식)
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(filename).toLowerCase() || ".jpg"

    // 파일명에서 특수문자 제거
    const baseName = path
      .basename(filename, ext)
      .replace(/[^a-zA-Z0-9가-힣\-_]/g, "")
      .substring(0, 20) // 길이 제한

    const newFilename = `${baseName || "image"}-${timestamp}-${randomId}${ext}`
    console.log("새 파일명:", newFilename)

    // 저장 경로 설정 (절대 경로 사용)
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    console.log("업로드 디렉토리:", uploadsDir)
    console.log("현재 작업 디렉토리:", process.cwd())

    // uploads 디렉토리 생성 (비동기 방식)
    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
        console.log("uploads 디렉토리 생성됨")
      } else {
        console.log("uploads 디렉토리 이미 존재함")
      }
    } catch (dirError) {
      console.error("디렉토리 생성 실패:", dirError)
      return NextResponse.json(
        {
          error: `파일 저장 디렉토리를 생성할 수 없습니다: ${dirError.message}`,
        },
        { status: 500 },
      )
    }

    const filePath = path.join(uploadsDir, newFilename)
    console.log("파일 저장 경로:", filePath)

    // 파일 저장 (비동기 방식)
    try {
      await writeFile(filePath, buffer)
      console.log("파일 저장 완료")

      // 파일이 실제로 저장되었는지 확인
      if (existsSync(filePath)) {
        console.log("파일 존재 확인됨")
      } else {
        console.error("파일이 저장되지 않음")
        return NextResponse.json({ error: "파일 저장 확인 실패" }, { status: 500 })
      }
    } catch (writeError) {
      console.error("파일 저장 실패:", writeError)
      console.error("오류 코드:", writeError.code)
      console.error("오류 메시지:", writeError.message)

      // 구체적인 오류 메시지 제공
      let errorMessage = "파일 저장 중 오류가 발생했습니다."
      if (writeError.code === "EACCES") {
        errorMessage = "파일 저장 권한이 없습니다."
      } else if (writeError.code === "ENOENT") {
        errorMessage = "저장 경로를 찾을 수 없습니다."
      } else if (writeError.code === "ENOSPC") {
        errorMessage = "저장 공간이 부족합니다."
      }

      return NextResponse.json(
        {
          error: `${errorMessage} (${writeError.code}: ${writeError.message})`,
        },
        { status: 500 },
      )
    }

    // 클라이언트에서 접근 가능한 URL 반환
    const fileUrl = `/uploads/${newFilename}`
    console.log("최종 URL:", fileUrl)

    console.log("=== 이미지 업로드 API 성공 ===")

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: newFilename,
      size: buffer.length,
      type: type,
    })
  } catch (error) {
    console.error("=== 이미지 업로드 API 오류 ===")
    console.error("오류 상세:", error)
    console.error("오류 스택:", error.stack)
    return NextResponse.json(
      {
        error: `이미지 업로드에 실패했습니다: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
