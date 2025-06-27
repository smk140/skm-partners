import { NextResponse } from "next/server"
import { commitFileToGitHub } from "@/lib/github"

export async function POST(request: Request) {
  console.log("🔥 GitHub 이미지 업로드 API 시작")

  try {
    const body = await request.json()
    const { image, filename } = body

    if (!image || !filename) {
      return NextResponse.json({ error: "이미지와 파일명이 필요합니다" }, { status: 400 })
    }

    console.log("업로드할 파일명:", filename)

    // Base64 데이터 검증
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "유효하지 않은 이미지 데이터입니다" }, { status: 400 })
    }

    const mimeType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, "base64")

    console.log("MIME 타입:", mimeType)
    console.log("버퍼 크기:", buffer.length)

    // 파일 크기 제한 (10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다" }, { status: 400 })
    }

    // 고유한 파일명 생성
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = filename.split(".").pop() || "jpg"
    const githubFilePath = `public/uploads/${timestamp}-${randomId}.${extension}`

    console.log("GitHub 파일 경로:", githubFilePath)

    // GitHub에 이미지 커밋
    const commitSuccess = await commitFileToGitHub(githubFilePath, buffer, `Add image: ${filename}`)

    if (!commitSuccess) {
      return NextResponse.json({ error: "GitHub 커밋에 실패했습니다" }, { status: 500 })
    }

    // GitHub Raw URL 생성
    const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
    const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

    const githubRawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/${githubFilePath}`

    console.log("GitHub 이미지 업로드 성공:", githubRawUrl)

    return NextResponse.json({
      success: true,
      url: githubRawUrl,
      originalFilename: filename,
      githubFilePath: githubFilePath,
      size: buffer.length,
      mimeType: mimeType,
    })
  } catch (error) {
    console.error("GitHub 이미지 업로드 실패:", error)
    return NextResponse.json(
      {
        error: `이미지 업로드 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 },
    )
  }
}
