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

/**
 * GitHub API를 통해 파일을 커밋합니다.
 */
export async function commitFileToGitHub(
  filePath: string,
  content: Buffer | string,
  commitMessage: string,
): Promise<boolean> {
  console.log("🔥 commitFileToGitHub 시작")
  console.log("- filePath:", filePath)
  console.log("- commitMessage:", commitMessage)
  console.log("- content type:", Buffer.isBuffer(content) ? "Buffer" : "string")
  console.log("- content size:", Buffer.isBuffer(content) ? content.length : content.length)

  if (!isGitHubConfigured) {
    console.error("💥 GitHub 환경 변수가 설정되지 않았습니다")
    console.log("- GITHUB_TOKEN:", GITHUB_TOKEN ? "존재함" : "❌ 없음")
    console.log("- GITHUB_REPO_OWNER:", GITHUB_REPO_OWNER || "❌ 없음")
    console.log("- GITHUB_REPO_NAME:", GITHUB_REPO_NAME || "❌ 없음")
    return false
  }

  try {
    // 1. 현재 파일 정보 가져오기 (SHA 값 필요)
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
      } else if (fileResponse.status === 401) {
        console.error("🔑 GitHub 토큰 인증 실패 - GITHUB_TOKEN을 확인해주세요")
        return false
      } else if (fileResponse.status === 403) {
        console.error("🚫 GitHub 권한 부족 - 토큰에 repo 스코프가 있는지 확인해주세요")
        return false
      } else {
        const errorText = await fileResponse.text()
        console.error(`⚠️ 파일 확인 중 예상치 못한 응답 (${fileResponse.status}):`, errorText)
      }
    } catch (error) {
      console.error("⚠️ 파일 정보 가져오기 중 오류:", error.message)
    }

    // 2. content를 Base64로 인코딩
    const encodedContent = Buffer.isBuffer(content)
      ? content.toString("base64")
      : Buffer.from(content, "utf8").toString("base64")

    console.log("🔄 Base64 인코딩 완료, 길이:", encodedContent.length)

    // 3. 파일 커밋
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
      const errorData = await response.json()
      console.error("💥 GitHub 커밋 실패 상세:")
      console.error("- 상태 코드:", response.status)
      console.error("- 오류 데이터:", JSON.stringify(errorData, null, 2))

      // 토큰 권한 문제인지 확인
      if (response.status === 401) {
        console.error("🔑 토큰 인증 실패 - GITHUB_TOKEN을 확인해주세요")
        console.error("🔑 토큰 형식: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
      } else if (response.status === 403) {
        console.error("🚫 권한 부족 - 토큰에 repo 스코프가 있는지 확인해주세요")
        console.error("🚫 필요한 권한: repo (Full control of private repositories)")
      } else if (response.status === 404) {
        console.error("🔍 저장소를 찾을 수 없음 - GITHUB_REPO_OWNER와 GITHUB_REPO_NAME을 확인해주세요")
        console.error(`🔍 확인할 저장소: https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`)
      } else if (response.status === 422) {
        console.error("📝 요청 데이터 오류 - 파일 경로나 내용에 문제가 있을 수 있습니다")
      }

      return false
    }

    const responseData = await response.json()
    console.log("✅ GitHub 커밋 성공!")
    console.log("- 커밋 SHA:", responseData.commit?.sha)
    console.log("- 파일 URL:", responseData.content?.html_url)

    return true
  } catch (error) {
    console.error("💥 GitHub 커밋 중 예외 발생:", error)
    console.error("💥 오류 스택:", error.stack)
    return false
  }
}

/**
 * 여러 파일을 한 번에 커밋합니다.
 */
export async function commitMultipleFilesToGitHub(
  files: { path: string; content: string | Buffer }[],
  commitMessage: string,
): Promise<boolean> {
  if (!isGitHubConfigured || files.length === 0) {
    console.log("GitHub 환경 변수가 설정되지 않았거나 커밋할 파일이 없습니다.")
    return false
  }

  console.log(`🔥 ${files.length}개 파일 일괄 커밋 시작`)

  // 각 파일을 개별적으로 커밋
  const results = await Promise.all(files.map((file) => commitFileToGitHub(file.path, file.content, commitMessage)))

  // 모든 파일이 성공적으로 커밋되었는지 확인
  const allSuccess = results.every((result) => result === true)
  console.log(`🔥 일괄 커밋 결과: ${allSuccess ? "성공" : "실패"}`)

  return allSuccess
}
