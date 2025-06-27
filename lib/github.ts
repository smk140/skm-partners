/**
 * GitHub API를 사용하여 파일을 커밋하는 유틸리티
 */

export function getGitHubDebugInfo() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
  const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

  return {
    hasToken: !!GITHUB_TOKEN,
    tokenPrefix: GITHUB_TOKEN ? GITHUB_TOKEN.substring(0, 10) + "..." : "없음",
    tokenType: GITHUB_TOKEN?.startsWith("github_pat_")
      ? "fine-grained"
      : GITHUB_TOKEN?.startsWith("ghp_")
        ? "classic"
        : "unknown",
    repoOwner: GITHUB_REPO_OWNER || "없음",
    repoName: GITHUB_REPO_NAME || "없음",
    branch: GITHUB_BRANCH,
    expectedUrl:
      GITHUB_REPO_OWNER && GITHUB_REPO_NAME
        ? `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`
        : "환경 변수 없음",
    isConfigured: !!(GITHUB_TOKEN && GITHUB_REPO_OWNER && GITHUB_REPO_NAME),
  }
}

export async function testGitHubConnection() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
  const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME

  if (!GITHUB_TOKEN) {
    return {
      success: false,
      error: "GITHUB_TOKEN이 설정되지 않았습니다",
      step: "TOKEN_MISSING",
    }
  }

  // 토큰 타입 확인
  const tokenType = GITHUB_TOKEN.startsWith("github_pat_")
    ? "fine-grained"
    : GITHUB_TOKEN.startsWith("ghp_")
      ? "classic"
      : "unknown"

  try {
    // 1. 사용자 정보 확인 (토큰 유효성 검사)
    console.log("🔑 GitHub 토큰 유효성 검사... (타입:", tokenType, ")")
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SKM-Partners-Website",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error("❌ GitHub 토큰 검증 실패:", userResponse.status, errorText)

      let errorMessage = ""
      switch (userResponse.status) {
        case 401:
          errorMessage = "GitHub 토큰이 유효하지 않습니다. 토큰을 다시 확인해주세요."
          break
        case 403:
          errorMessage = "GitHub 토큰 권한이 부족합니다. 토큰 스코프를 확인해주세요."
          break
        default:
          errorMessage = `GitHub API 인증 실패 (${userResponse.status})`
      }

      return {
        success: false,
        error: errorMessage,
        details: errorText,
        step: "TOKEN_INVALID",
        tokenType,
        httpStatus: userResponse.status,
      }
    }

    const userData = await userResponse.json()
    console.log("✅ GitHub 사용자 확인:", userData.login, "(타입:", tokenType, ")")

    // 2. 저장소 접근 권한 확인
    if (!GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
      return {
        success: false,
        error: "GITHUB_REPO_OWNER 또는 GITHUB_REPO_NAME이 설정되지 않았습니다",
        step: "REPO_CONFIG_MISSING",
        tokenType,
      }
    }

    console.log("🏠 저장소 접근 권한 확인...")
    const repoResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SKM-Partners-Website",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (!repoResponse.ok) {
      const errorText = await repoResponse.text()
      console.error("❌ 저장소 접근 실패:", repoResponse.status, errorText)

      let errorMessage = ""
      let step = ""

      switch (repoResponse.status) {
        case 404:
          if (tokenType === "fine-grained") {
            errorMessage = `저장소 '${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}'를 찾을 수 없습니다. Fine-grained 토큰의 경우 저장소별 권한 설정이 필요합니다. Classic 토큰 사용을 권장합니다.`
          } else {
            errorMessage = `저장소 '${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}'를 찾을 수 없습니다. 저장소가 존재하지 않거나 비공개 저장소에 대한 접근 권한이 없습니다.`
          }
          step = "REPO_NOT_FOUND"
          break
        case 403:
          errorMessage = `저장소 '${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}'에 대한 접근 권한이 없습니다. 토큰에 repo 스코프가 있는지 확인하세요.`
          step = "REPO_ACCESS_DENIED"
          break
        default:
          errorMessage = `저장소 접근 실패 (${repoResponse.status})`
          step = "REPO_ACCESS_ERROR"
      }

      return {
        success: false,
        error: errorMessage,
        details: errorText,
        step,
        httpStatus: repoResponse.status,
        tokenType,
      }
    }

    const repoData = await repoResponse.json()
    console.log("✅ 저장소 접근 성공:", repoData.full_name)

    // 3. 쓰기 권한 확인
    const hasWriteAccess = repoData.permissions?.push || repoData.permissions?.admin || false
    console.log("📝 쓰기 권한:", hasWriteAccess ? "있음" : "없음")

    return {
      success: true,
      user: userData.login,
      repo: repoData.full_name,
      repoPrivate: repoData.private,
      defaultBranch: repoData.default_branch,
      permissions: repoData.permissions,
      hasWriteAccess,
      tokenType,
    }
  } catch (error) {
    console.error("💥 GitHub 연결 테스트 중 오류:", error)
    return {
      success: false,
      error: `GitHub API 호출 중 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      step: "API_ERROR",
      tokenType,
    }
  }
}

export async function commitFileToGitHub(filePath: string, content: Buffer, commitMessage: string) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
  const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

  console.log("🔥 GitHub 커밋 시작:", {
    filePath,
    contentSize: content.length,
    commitMessage,
    repoOwner: GITHUB_REPO_OWNER,
    repoName: GITHUB_REPO_NAME,
    branch: GITHUB_BRANCH,
  })

  // 환경 변수 확인
  if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    console.error("💥 GitHub 환경 변수 누락")
    return {
      success: false,
      error: "GitHub 환경 변수가 설정되지 않았습니다",
      debugInfo: getGitHubDebugInfo(),
    }
  }

  try {
    // GitHub 연결 테스트
    const connectionTest = await testGitHubConnection()
    if (!connectionTest.success) {
      return {
        success: false,
        error: connectionTest.error,
        debugInfo: {
          ...getGitHubDebugInfo(),
          connectionTest,
        },
      }
    }

    console.log("✅ GitHub 연결 확인 완료")

    // 쓰기 권한 확인
    if (!connectionTest.hasWriteAccess) {
      return {
        success: false,
        error: "저장소에 대한 쓰기 권한이 없습니다. 토큰 권한을 확인해주세요.",
        debugInfo: {
          ...getGitHubDebugInfo(),
          connectionTest,
        },
      }
    }

    // 기존 파일 확인
    console.log("🔍 기존 파일 확인...")
    const fileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "SKM-Partners-Website",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    )

    let existingFileSha = null
    if (fileResponse.ok) {
      const fileData = await fileResponse.json()
      existingFileSha = fileData.sha
      console.log("📁 기존 파일 발견, SHA:", existingFileSha)
    } else if (fileResponse.status === 404) {
      console.log("📁 새 파일 생성")
    } else {
      console.warn("⚠️ 파일 확인 중 예상치 못한 응답:", fileResponse.status)
    }

    // 파일 커밋
    console.log("💾 파일 커밋 중...")
    const base64Content = content.toString("base64")

    const commitData = {
      message: commitMessage,
      content: base64Content,
      branch: GITHUB_BRANCH,
      ...(existingFileSha && { sha: existingFileSha }),
    }

    const commitResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "SKM-Partners-Website",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify(commitData),
      },
    )

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text()
      console.error("💥 파일 커밋 실패:", commitResponse.status, errorText)

      let errorMessage = ""
      switch (commitResponse.status) {
        case 401:
          errorMessage = "GitHub 토큰 인증에 실패했습니다"
          break
        case 403:
          errorMessage = "저장소에 대한 쓰기 권한이 없습니다"
          break
        case 404:
          errorMessage = "저장소 또는 브랜치를 찾을 수 없습니다"
          break
        case 422:
          errorMessage = "커밋 데이터에 오류가 있습니다"
          break
        default:
          errorMessage = `GitHub API 오류 (${commitResponse.status})`
      }

      return {
        success: false,
        error: errorMessage,
        debugInfo: {
          ...getGitHubDebugInfo(),
          httpStatus: commitResponse.status,
          errorDetails: errorText,
          connectionTest,
        },
      }
    }

    const commitResult = await commitResponse.json()
    console.log("✅ GitHub 커밋 성공:", commitResult.commit.sha)

    return {
      success: true,
      sha: commitResult.commit.sha,
      url: commitResult.content.download_url,
      htmlUrl: commitResult.content.html_url,
    }
  } catch (error) {
    console.error("💥 GitHub 커밋 중 예외 발생:", error)
    return {
      success: false,
      error: `GitHub API 호출 중 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      debugInfo: {
        ...getGitHubDebugInfo(),
        exception: error instanceof Error ? error.message : "알 수 없는 오류",
      },
    }
  }
}
