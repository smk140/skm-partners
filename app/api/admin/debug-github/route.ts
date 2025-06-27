import { NextResponse } from "next/server"
import { getGitHubDebugInfo } from "@/lib/github"

export async function GET() {
  console.log("🔍 GitHub 디버깅 정보 요청")

  try {
    const debugInfo = getGitHubDebugInfo()
    console.log("🔍 GitHub 환경 변수 상태:", debugInfo)

    // GitHub API 연결 테스트
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    let apiTest = null

    if (GITHUB_TOKEN) {
      try {
        console.log("🔑 GitHub API 연결 테스트 중...")
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SKM-Partners-Website",
          },
        })

        if (response.ok) {
          const userData = await response.json()
          apiTest = {
            status: "SUCCESS",
            user: userData.login,
            name: userData.name,
            publicRepos: userData.public_repos,
          }
          console.log("✅ GitHub API 연결 성공:", userData.login)
        } else {
          const errorText = await response.text()
          apiTest = {
            status: "FAILED",
            httpStatus: response.status,
            error: errorText,
          }
          console.error("❌ GitHub API 연결 실패:", response.status, errorText)
        }
      } catch (error) {
        apiTest = {
          status: "ERROR",
          error: error instanceof Error ? error.message : "알 수 없는 오류",
        }
        console.error("💥 GitHub API 테스트 중 오류:", error)
      }
    }

    return NextResponse.json({
      success: true,
      debugInfo,
      apiTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 GitHub 디버깅 정보 수집 실패:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 },
    )
  }
}
