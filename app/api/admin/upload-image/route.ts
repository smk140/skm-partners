import { type NextRequest, NextResponse } from "next/server"
import { commitFileToGitHub } from "@/lib/github"

export async function POST(request: NextRequest) {
  console.log("🔥 이미지 업로드 API 호출")

  try {
    const body = await request.json()
    const { image, filename } = body

    if (!image || !filename) {
      return NextResponse.json(
        {
          success: false,
          error: "이미지 데이터와 파일명이 필요합니다",
        },
        { status: 400 },
      )
    }

    console.log("📁 업로드 파일 정보:", {
      filename,
      imageSize: image.length,
    })

    // Base64 데이터에서 실제 이미지 데이터 추출
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, "")
    const imageBuffer = Buffer.from(base64Data, "base64")

    console.log("🔄 이미지 버퍼 생성 완료:", {
      bufferSize: imageBuffer.length,
      originalSize: base64Data.length,
    })

    // 파일 확장자 추출
    const fileExtension = filename.split(".").pop()?.toLowerCase() || "jpg"
    const timestamp = Date.now()
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
    const githubFilePath = `public/uploads/${timestamp}_${sanitizedFilename}`

    console.log("📤 GitHub 커밋 시작:", {
      githubFilePath,
      fileExtension,
      timestamp,
    })

    // GitHub에 파일 커밋
    const commitResult = await commitFileToGitHub(githubFilePath, imageBuffer, `이미지 업로드: ${filename}`)

    if (!commitResult.success) {
      console.error("💥 GitHub 커밋 실패:", commitResult.error)
      return NextResponse.json({
        success: false,
        error: commitResult.error || "GitHub 커밋에 실패했습니다. 환경 변수와 토큰 권한을 확인해주세요.",
        debugInfo: commitResult.debugInfo,
      })
    }

    // GitHub Raw URL 생성
    const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
    const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/${githubFilePath}`

    console.log("✅ 이미지 업로드 성공:", {
      sha: commitResult.sha,
      rawUrl,
      htmlUrl: commitResult.htmlUrl,
    })

    return NextResponse.json({
      success: true,
      url: rawUrl,
      githubUrl: commitResult.htmlUrl,
      sha: commitResult.sha,
      path: githubFilePath,
    })
  } catch (error) {
    console.error("💥 이미지 업로드 API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다",
        debugInfo: {
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    )
  }
}
