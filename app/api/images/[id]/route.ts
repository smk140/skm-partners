import { NextResponse } from "next/server"
import { getImageData } from "@/lib/file-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log(`=== 이미지 조회 API: ${params.id} ===`)

  try {
    const imageId = params.id

    if (!imageId) {
      console.log("이미지 ID가 없음")
      return NextResponse.json({ error: "이미지 ID가 필요합니다." }, { status: 400 })
    }

    // 파일 DB에서 이미지 데이터 조회
    const imageInfo = getImageData(imageId)

    if (!imageInfo) {
      console.log(`이미지를 찾을 수 없음: ${imageId}`)
      return NextResponse.json({ error: "이미지를 찾을 수 없습니다." }, { status: 404 })
    }

    console.log(`이미지 조회 성공: ${imageId}`)

    // Base64 데이터에서 MIME 타입과 데이터 추출
    const matches = imageInfo.data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

    if (!matches || matches.length !== 3) {
      console.error("잘못된 Base64 형식")
      return NextResponse.json({ error: "잘못된 이미지 데이터입니다." }, { status: 400 })
    }

    const mimeType = matches[1]
    const base64Data = matches[2]

    // Base64를 Buffer로 변환
    const buffer = Buffer.from(base64Data, "base64")

    console.log(`이미지 반환: ${imageId}, 타입: ${mimeType}, 크기: ${buffer.length}`)

    // 이미지 응답 반환
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable", // 1년 캐시
        ETag: `"${imageId}"`,
      },
    })
  } catch (error) {
    console.error("=== 이미지 조회 API 오류 ===")
    console.error("오류 상세:", error)
    return NextResponse.json(
      {
        error: `이미지 조회에 실패했습니다: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
