import { NextResponse } from "next/server"
import { getGitHubDebugInfo, testGitHubConnection } from "@/lib/github"

export async function GET() {
  console.log("🔍 GitHub 디버깅 정보 요청")

  try {
    const debugInfo = getGitHubDebugInfo()
    console.log("🔍 GitHub 환경 변수 상태:", debugInfo)

    // GitHub 연결 테스트
    const connectionTest = await testGitHubConnection()
    console.log("🔍 GitHub 연결 테스트 결과:", connectionTest)

    // 권장 사항 생성
    const recommendations = generateRecommendations(debugInfo, connectionTest)

    return NextResponse.json({
      success: true,
      debugInfo,
      connectionTest,
      recommendations,
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

function generateRecommendations(debugInfo: any, connectionTest: any) {
  const recommendations = []

  if (!debugInfo.hasToken) {
    recommendations.push({
      type: "error",
      title: "GitHub 토큰 누락",
      description: "GitHub Personal Access Token (Classic)을 생성하고 GITHUB_TOKEN 환경 변수에 설정하세요.",
      action: "Classic 토큰 생성하기",
      url: "https://github.com/settings/tokens/new",
      priority: "high",
    })
  }

  if (debugInfo.tokenType === "fine-grained") {
    recommendations.push({
      type: "warning",
      title: "Fine-grained 토큰 감지",
      description: "Fine-grained 토큰은 베타 기능이며 제한사항이 많습니다. Classic 토큰 사용을 강력히 권장합니다.",
      action: "Classic 토큰으로 변경",
      url: "https://github.com/settings/tokens/new",
      priority: "high",
    })
  }

  if (debugInfo.tokenType === "unknown") {
    recommendations.push({
      type: "error",
      title: "알 수 없는 토큰 형식",
      description: "GitHub 토큰 형식이 올바르지 않습니다. Classic 토큰(ghp_로 시작)을 사용하세요.",
      action: "올바른 토큰 생성",
      url: "https://github.com/settings/tokens/new",
      priority: "high",
    })
  }

  if (debugInfo.repoOwner === "없음") {
    recommendations.push({
      type: "error",
      title: "저장소 소유자 누락",
      description: "GITHUB_REPO_OWNER 환경 변수를 'smk140'으로 설정하세요.",
      priority: "high",
    })
  }

  if (debugInfo.repoName === "없음") {
    recommendations.push({
      type: "error",
      title: "저장소 이름 누락",
      description: "GITHUB_REPO_NAME 환경 변수를 'skm-partners'로 설정하세요.",
      priority: "high",
    })
  }

  if (connectionTest && !connectionTest.success) {
    switch (connectionTest.step) {
      case "REPO_NOT_FOUND":
        if (connectionTest.tokenType === "fine-grained") {
          recommendations.push({
            type: "error",
            title: "Fine-grained 토큰 저장소 접근 실패",
            description: "Fine-grained 토큰은 저장소별 권한 설정이 복잡합니다. Classic 토큰으로 변경하세요.",
            action: "Classic 토큰 생성",
            url: "https://github.com/settings/tokens/new",
            priority: "high",
          })
        } else {
          recommendations.push({
            type: "warning",
            title: "저장소를 찾을 수 없음",
            description:
              "저장소가 비공개이거나 존재하지 않습니다. 저장소를 공개로 변경하거나 토큰에 적절한 권한을 부여하세요.",
            action: "저장소 설정 확인",
            url: `https://github.com/${debugInfo.repoOwner}/${debugInfo.repoName}/settings`,
            priority: "medium",
          })
        }
        break
      case "REPO_ACCESS_DENIED":
        recommendations.push({
          type: "error",
          title: "저장소 접근 권한 없음",
          description: "GitHub 토큰에 repo 스코프가 있는지 확인하세요.",
          action: "토큰 권한 확인",
          url: "https://github.com/settings/tokens",
          priority: "high",
        })
        break
      case "TOKEN_INVALID":
        recommendations.push({
          type: "error",
          title: "유효하지 않은 토큰",
          description: "GitHub 토큰이 만료되었거나 유효하지 않습니다. 새 Classic 토큰을 생성하세요.",
          action: "새 Classic 토큰 생성",
          url: "https://github.com/settings/tokens/new",
          priority: "high",
        })
        break
    }
  }

  if (connectionTest && connectionTest.success) {
    if (connectionTest.repoPrivate) {
      recommendations.push({
        type: "info",
        title: "비공개 저장소 감지",
        description:
          "저장소가 비공개로 설정되어 있습니다. 토큰에 적절한 권한이 있는지 확인하거나 저장소를 공개로 변경할 수 있습니다.",
        action: "저장소 공개로 변경",
        url: `https://github.com/${debugInfo.repoOwner}/${debugInfo.repoName}/settings`,
        priority: "low",
      })
    }

    if (!connectionTest.hasWriteAccess) {
      recommendations.push({
        type: "error",
        title: "쓰기 권한 없음",
        description: "저장소에 대한 쓰기 권한이 없습니다. 토큰 권한을 확인하거나 저장소 협업자로 추가되어야 합니다.",
        action: "권한 확인",
        url: `https://github.com/${debugInfo.repoOwner}/${debugInfo.repoName}/settings/access`,
        priority: "high",
      })
    }
  }

  // 우선순위별 정렬
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}
