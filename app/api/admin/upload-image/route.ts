import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  console.log("🔥🔥🔥 === 이미지 업로드 API 시작 === 🔥🔥🔥")

  try {
    const body = await request.json()
    const { image, filename } = body

    if (!image || !filename) {
      console.error("💥 이미지 또는 파일명 없음")
      return NextResponse.json({ error: "이미지와 파일명이 필요합니다" }, { status: 400 })
    }

    console.log("🔥 업로드할 파일명:", filename)
    console.log("🔥 이미지 데이터 길이:", image.length)

    // Base64에서 실제 데이터 부분만 추출
    const base64Data = image.split(",")[1] || image
    const buffer = Buffer.from(base64Data, "base64")

    console.log("🔥 버퍼 크기:", buffer.length)

    // Vercel Blob에 업로드
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: getContentType(filename),
    })

    console.log("🔥 Blob 업로드 성공:", blob.url)

    return NextResponse.json({
      success: true,
      url: blob.url,
      originalFilename: filename,
      size: buffer.length,
    })
  } catch (error) {
    console.error("💥💥💥 이미지 업로드 실패:", error)
    return NextResponse.json(
      {
        error: `이미지 업로드 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 },
    )
  }
}

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop()
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg"
    case "png":
      return "image/png"
    case "gif":
      return "image/gif"
    case "webp":
      return "image/webp"
    default:
      return "image/jpeg"
  }
}
