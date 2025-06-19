import { NextResponse } from "next/server"
import { commitFileToGitHub } from "@/lib/github" // GitHub 유틸리티 임포트

export async function POST(request: Request) {
  console.log("🔥🔥🔥 === GitHub 이미지 업로드 API 시작 === 🔥🔥🔥")

  try {
    // GitHub 환경 변수 확인
    const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
    const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

    if (!GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
      console.error("💥 GitHub 저장소 정보 환경 변수가 설정되지 않았습니다.")
      return NextResponse.json({ error: "GitHub 저장소 소유자 또는 이름이 설정되지 않았습니다." }, { status: 500 })
    }

    const body = await request.json()
    const { image, filename } = body

    if (!image || !filename) {
      console.error("💥 이미지 또는 파일명 없음")
      return NextResponse.json({ error: "이미지 데이터와 파일명이 필요합니다." }, { status: 400 })
    }

    console.log("🔥 업로드할 파일명:", filename)

    // Base64 데이터 검증 및 변환
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      console.error("💥 Base64 형식이 잘못됨")
      return NextResponse.json({ error: "유효하지 않은 이미지 데이터입니다." }, { status: 400 })
    }

    const mimeType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, "base64")

    console.log("🔥 MIME 타입:", mimeType)
    console.log("🔥 버퍼 크기:", buffer.length)

    // 파일 크기 제한 (10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      console.error("💥 파일 크기 초과:", buffer.length)
      return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 })
    }

    // 고유한 파일명 생성 (GitHub 경로에 맞게)
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = filename.split(".").pop() || "jpg"
    const githubFilePath = `public/uploads/${timestamp}-${randomId}.${extension}` // GitHub 저장소 내 경로

    console.log("🔥 GitHub 파일 경로:", githubFilePath)

    // GitHub에 파일 커밋
    const commitSuccess = await commitFileToGitHub(
      githubFilePath,
      buffer.toString("utf8"), // Buffer를 UTF-8 문자열로 변환하여 전달
      `feat: Add image ${githubFilePath} via admin upload`,
    )

    if (!commitSuccess) {
      console.error("💥 GitHub 커밋 실패")
      return NextResponse.json({ error: "이미지 GitHub 커밋에 실패했습니다." }, { status: 500 })
    }

    // GitHub Raw URL 생성
    const githubRawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/${githubFilePath}`

    console.log("🔥🔥🔥 GitHub 이미지 업로드 성공:", githubRawUrl)

    return NextResponse.json({
      success: true,
      url: githubRawUrl,
      originalFilename: filename,
      githubFilePath: githubFilePath,
      size: buffer.length,
      mimeType: mimeType,
    })
  } catch (error) {
    console.error("💥💥💥 GitHub 이미지 업로드 최종 실패:", error)
    console.error("💥 오류 스택:", error.stack)
    return NextResponse.json(
      {
        error: `이미지 업로드 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
        details: error instanceof Error ? error.stack : "스택 정보 없음",
      },
      { status: 500 },
    )
  }
}
