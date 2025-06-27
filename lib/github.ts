/**
 * GitHub API를 사용하여 파일을 커밋하는 유틸리티
 */

// 환경 변수 확인
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER
const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main"

// 필수 환경 변수 확인
const isGitHubConfigured = GITHUB_TOKEN && GITHUB_REPO_OWNER && GITHUB_REPO_NAME

interface GitHubCommitResult {
  success: boolean
  error?: string
  debugInfo?: any
  sha?: string
  url?: string
}

/**
 * GitHub API를 통해 파일을 커밋합니다.
 */
export async function commitFileToGitHub(
  filePath: string,
  content: Buffer | string,
  commitMessage: string,
): Promise<GitHubCommitResult> {
  console.log("🔥 commitFileToGitHub 시작")
  console.log("- filePath:", filePath)
  console.log("- commitMessage:", commitMessage)
  console.log("- content type:", Buffer.isBuffer(content) ? "Buffer" : "string")
  console.log("- content size:", Buffer.isBuffer(content) ? content.length : content.length)

  if (!isGitHubConfigured) {
    const error = "GitHub 환경 변수가 설정되지 않았습니다"
    console.error("💥", error)
    console.log("- GITHUB_TOKEN:", GITHUB_TOKEN ? "존재함" : "❌ 없음")
    console.log("- GITHUB_REPO_OWNER:", GITHUB_REPO_OWNER || "❌ 없음")
    console.log("- GITHUB_REPO_NAME:", GITHUB_REPO_NAME || "❌ 없음")
    return {
      success: false,
      error,
      debugInfo: {
        hasToken: !!GITHUB_TOKEN,
        hasOwner: !!GITHUB_REPO_OWNER,
        hasRepoName: !!GITHUB_REPO_NAME,
      },
    }
  }

  try {
    // 1. GitHub 토큰 테스트
    console.log("🔑 GitHub 토큰 테스트 중...")
    const authTestUrl = "https://api.github.com/user"
    const authResponse = await fetch(authTestUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SKM-Partners-Website",
      },
    })

    console.log("🔑 토큰 테스트 응답 상태:", authResponse.status)

    if (authResponse.status === 401) {
      return {
        success: false,
        error: "GitHub 토큰이 유효하지 않습니다. GITHUB_TOKEN을 확인해주세요.",
        debugInfo: { tokenTest: "FAILED", status: 401 },
      }
    }

    if (authResponse.status === 403) {
      return {
        success: false,
        error: "GitHub 토큰 권한이 부족합니다. repo 스코프가 있는지 확인해주세요.",
        debugInfo: { tokenTest: "FORBIDDEN", status: 403 },
      }
    }

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      return {
        success: false,
        error: `GitHub 토큰 테스트 실패 (${authResponse.status})`,
        debugInfo: { tokenTest: "ERROR", status: authResponse.status, response: errorText },
      }
    }

    const userData = await authResponse.json()
    console.log("✅ GitHub 토큰 유효함. 사용자:", userData.login)

    // 2. 저장소 접근 권한 테스트
    console.log("🏠 저장소 접근 권한 테스트 중...")
    const repoTestUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`
    const repoResponse = await fetch(repoTestUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SKM-Partners-Website",
      },
    })

    console.log("🏠 저장소 테스트 응답 상태:", repoResponse.status)

    if (repoResponse.status === 404) {
      return {
        success: false,
        error: `저장소를 찾을 수 없습니다: ${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`,
        debugInfo: { repoTest: "NOT_FOUND", status: 404 },
      }
    }

    if (!repoResponse.ok) {
      const errorText = await repoResponse.text()
      return {
        success: false,
        error: `저장소 접근 실패 (${repoResponse.status})`,
        debugInfo: { repoTest: "ERROR", status: repoResponse.status, response: errorText },
      }
    }

    const repoData = await repoResponse.json()
    console.log("✅ 저장소 접근 가능:", repoData.full_name)

    // 3. 현재 파일 정보 가져오기 (SHA 값 필요)
    let sha: string | null = null
    const fileCheckUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}?ref=${GITHUB_BRANCH}`

    console.log("🔍 기존 파일 확인 URL:", fileCheckUrl)

    try {
      const fileResponse = await fetch(fileCheckUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "SKM-Partners-Website",
        },
      })

      console.log("🔍 파일 확인 응답 상태:", fileResponse.status)

      if (fileResponse.status === 200) {
        const fileData = await fileResponse.json()
        sha = fileData.sha
        console.log(`✅ 기존 파일 SHA 발견: ${sha}`)
      } else if (fileResponse.status === 404) {
        console.log(`📝 파일이 존재하지 않습니다. 새로 생성합니다: ${filePath}`)
      } else {
        const errorText = await fileResponse.text()
        console.error(`⚠️ 파일 확인 중 예상치 못한 응답 (${fileResponse.status}):`, errorText)
      }
    } catch (error) {
      console.error("⚠️ 파일 정보 가져오기 중 오류:", error instanceof Error ? error.message : "알 수 없는 오류")
    }

    // 4. content를 Base64로 인코딩
    const encodedContent = Buffer.isBuffer(content)
      ? content.toString("base64")
      : Buffer.from(content, "utf8").toString("base64")

    console.log("🔄 Base64 인코딩 완료, 길이:", encodedContent.length)

    // 5. 파일 커밋
    const commitUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`
    console.log("📤 커밋 URL:", commitUrl)

    const requestBody = {
      message: commitMessage,
      content: encodedContent,
      branch: GITHUB_BRANCH,
      ...(sha && { sha }), // SHA가 있을 때만 포함
    }

    console.log("📤 커밋 요청 본문:", {
      ...requestBody,
      content: `[Base64 데이터 ${encodedContent.length}자]`,
    })

    const response = await fetch(commitUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "SKM-Partners-Website",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("📤 커밋 응답 상태:", response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("💥 GitHub 커밋 실패 상세:")
      console.error("- 상태 코드:", response.status)
      console.error("- 오류 데이터:", JSON.stringify(errorData, null, 2))

      let errorMessage = "GitHub 커밋 실패"

      // 상태 코드별 구체적 오류 메시지
      switch (response.status) {
        case 401:
          errorMessage = "토큰 인증 실패 - GITHUB_TOKEN을 확인해주세요"
          break
        case 403:
          errorMessage = "권한 부족 - 토큰에 repo 스코프가 있는지 확인해주세요"
          break
        case 404:
          errorMessage = `저장소를 찾을 수 없음: ${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`
          break
        case 422:
          errorMessage = "요청 데이터 오류 - 파일 경로나 내용에 문제가 있을 수 있습니다"
          break
        default:
          errorMessage = `GitHub API 오류 (${response.status}): ${response.statusText}`
      }

      return {
        success: false,
        error: errorMessage,
        debugInfo: {
          status: response.status,
          statusText: response.statusText,
          errorData,
          requestBody: {
            ...requestBody,
            content: `[Base64 데이터 ${encodedContent.length}자]`,
          },
        },
      }
    }

    const responseData = await response.json()
    console.log("✅ GitHub 커밋 성공!")
    console.log("- 커밋 SHA:", responseData.commit?.sha)
    console.log("- 파일 URL:", responseData.content?.html_url)

    return {
      success: true,
      sha: responseData.commit?.sha,
      url: responseData.content?.html_url,
    }
  } catch (error) {
    console.error("💥 GitHub 커밋 중 예외 발생:", error)
    console.error("💥 오류 스택:", error instanceof Error ? error.stack : "스택 정보 없음")
    return {
      success: false,
      error: `GitHub 커밋 중 예외 발생: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      debugInfo: {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : "스택 정보 없음",
      },
    }
  }
}

/**
 * GitHub 환경 변수 디버깅 정보를 반환합니다.
 */
export function getGitHubDebugInfo() {
  return {
    hasToken: !!GITHUB_TOKEN,
    hasOwner: !!GITHUB_REPO_OWNER,
    hasRepoName: !!GITHUB_REPO_NAME,
    branch: GITHUB_BRANCH,
    tokenPrefix: GITHUB_TOKEN ? GITHUB_TOKEN.substring(0, 10) + "..." : "없음",
    owner: GITHUB_REPO_OWNER || "없음",
    repoName: GITHUB_REPO_NAME || "없음",
    repoUrl:
      GITHUB_REPO_OWNER && GITHUB_REPO_NAME ? `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}` : "없음",
  }
}
