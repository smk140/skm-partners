interface GitHubCommitResponse {
  sha: string
  url: string
}

export async function commitFileToGitHub(
  filePath: string,
  fileBuffer: Buffer,
  commitMessage: string,
): Promise<GitHubCommitResponse> {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_REPO_OWNER
  const repo = process.env.GITHUB_REPO_NAME
  const branch = process.env.GITHUB_BRANCH || "main"

  if (!token || !owner || !repo) {
    throw new Error("GitHub 환경 변수가 설정되지 않았습니다.")
  }

  console.log("🚀 GitHub API 호출 시작:", {
    owner,
    repo,
    branch,
    filePath,
    bufferSize: fileBuffer.length,
  })

  try {
    // Base64로 인코딩
    const content = fileBuffer.toString("base64")
    console.log("🔄 Base64 인코딩 완료, 길이:", content.length)

    // GitHub API 호출
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`
    console.log("🌐 GitHub API URL:", url)

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "SKM-Partners-Website",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: content,
        branch: branch,
      }),
    })

    console.log("📡 GitHub API 응답 상태:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ GitHub API 오류 응답:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })

      // 상태 코드별 구체적 오류 메시지
      let errorMessage = "GitHub API 호출 실패"
      switch (response.status) {
        case 401:
          errorMessage = "GitHub 토큰이 유효하지 않습니다. GITHUB_TOKEN을 확인해주세요."
          break
        case 403:
          errorMessage = "GitHub 저장소 접근 권한이 없습니다. 토큰에 repo 스코프가 있는지 확인해주세요."
          break
        case 404:
          errorMessage = "GitHub 저장소를 찾을 수 없습니다. GITHUB_REPO_OWNER와 GITHUB_REPO_NAME을 확인해주세요."
          break
        case 422:
          errorMessage = "GitHub API 요청 데이터가 잘못되었습니다."
          break
        default:
          errorMessage = `GitHub API 오류 (${response.status}): ${response.statusText}`
      }

      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log("✅ GitHub 커밋 성공:", {
      sha: result.content?.sha,
      url: result.content?.html_url,
    })

    return {
      sha: result.content?.sha || "",
      url: result.content?.html_url || "",
    }
  } catch (error: any) {
    console.error("💥 GitHub 커밋 중 오류:", error)
    throw error
  }
}
