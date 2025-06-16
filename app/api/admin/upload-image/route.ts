import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  console.log("=== 이미지 업로드 API 시작 (Vercel Blob) ===")

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

    // Base64 데이터 검증
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

    // 파일 크기 확인 (10MB 제한)
    if (buffer.length > 10 * 1024 * 1024) {
      console.log("파일 크기 초과:", buffer.length)
      return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 })
    }

    // 고유한 파일명 생성
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_") // 안전한 파일명
    const blobFilename = `uploads/${timestamp}-${randomId}-${safeFilename}`

    console.log("Blob 파일명:", blobFilename)

    // Vercel Blob에 업로드
    console.log("Vercel Blob 업로드 시도...")
    const blob = await put(blobFilename, buffer, {
      access: "public",
      contentType: type,
      addRandomSuffix: false, // 이미 고유한 이름 사용
    })
    console.log("Vercel Blob 업로드 성공:", blob)

    // 이미지 접근 URL
    const imageUrl = blob.url

    console.log("최종 이미지 URL:", imageUrl)
    console.log("=== 이미지 업로드 API 성공 ===")

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: blobFilename,
      originalFilename: filename,
      size: buffer.length,
      type: type,
      message: "이미지가 성공적으로 업로드되었습니다.",
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
