import { type NextRequest, NextResponse } from "next/server"
import { commitFileToGitHub } from "@/lib/github"

export async function POST(request: NextRequest) {
  try {
    console.log("🔥 이미지 업로드 API 시작")

    // 환경 변수 확인
    const requiredEnvVars = {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER,
      GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME,
      GITHUB_BRANCH: process.env.GITHUB_BRANCH || "main",
    }

    console.log("🔍 환경 변수 확인:", {
      GITHUB_TOKEN: requiredEnvVars.GITHUB_TOKEN ? "설정됨" : "❌ 없음",
      GITHUB_REPO_OWNER: requiredEnvVars.GITHUB_REPO_OWNER || "❌ 없음",
      GITHUB_REPO_NAME: requiredEnvVars.GITHUB_REPO_NAME || "❌ 없음",
      GITHUB_BRANCH: requiredEnvVars.GITHUB_BRANCH,
    })

    // 필수 환경 변수 체크
    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        console.error(`❌ 환경 변수 ${key}가 설정되지 않았습니다.`)
        return NextResponse.json({ success: false, error: `환경 변수 ${key}가 설정되지 않았습니다.` }, { status: 500 })
      }
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const imageType = formData.get("imageType") as string

    if (!file) {
      console.error("❌ 파일이 없습니다.")
      return NextResponse.json({ success: false, error: "파일이 없습니다." }, { status: 400 })
    }

    if (!imageType) {
      console.error("❌ 이미지 타입이 없습니다.")
      return NextResponse.json({ success: false, error: "이미지 타입이 필요합니다." }, { status: 400 })
    }

    console.log("📁 파일 정보:", {
      name: file.name,
      size: file.size,
      type: file.type,
      imageType: imageType,
    })

    // 파일을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("🔄 Buffer 변환 완료, 크기:", buffer.length)

    // 파일 확장자 추출
    const fileExtension = file.name.split(".").pop() || "jpg"
    const fileName = `${imageType}-${Date.now()}.${fileExtension}`
    const filePath = `public/uploads/${fileName}`

    console.log("📝 GitHub 커밋 시도:", {
      fileName,
      filePath,
      bufferSize: buffer.length,
    })

    try {
      // GitHub에 파일 커밋
      const result = await commitFileToGitHub(filePath, buffer, `Add image: ${fileName}`)

      console.log("✅ GitHub 커밋 성공:", result)

      // GitHub Raw URL 생성
      const githubRawUrl = `https://raw.githubusercontent.com/${requiredEnvVars.GITHUB_REPO_OWNER}/${requiredEnvVars.GITHUB_REPO_NAME}/${requiredEnvVars.GITHUB_BRANCH}/${filePath}`

      console.log("🌐 생성된 GitHub Raw URL:", githubRawUrl)

      return NextResponse.json({
        success: true,
        url: githubRawUrl,
        fileName: fileName,
        imageType: imageType,
      })
    } catch (githubError: any) {
      console.error("💥 GitHub 커밋 실패:", githubError)
      console.error("💥 GitHub 오류 상세:", {
        message: githubError.message,
        status: githubError.status,
        response: githubError.response?.data,
      })

      return NextResponse.json(
        {
          success: false,
          error: "GitHub 커밋에 실패했습니다.",
          details: githubError.message,
          status: githubError.status,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("💥 이미지 업로드 전체 실패:", error)
    return NextResponse.json(
      {
        success: false,
        error: "이미지 업로드에 실패했습니다.",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
