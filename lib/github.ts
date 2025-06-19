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
 * @param filePath GitHub 저장소 내 파일 경로 (예: 'public/uploads/image.jpg')
 * @param content 파일 내용 (Buffer 또는 string)
 * @param commitMessage 커밋 메시지
 */
export async function commitFileToGitHub(
  filePath: string,
  content: Buffer | string, // Buffer 또는 string을 받을 수 있도록 타입 변경
  commitMessage: string,
): Promise<boolean> {
  if (!isGitHubConfigured) {
    console.log("GitHub 환경 변수가 설정되지 않았습니다. 파일 커밋을 건너뜁니다.")
    return false
  }

  try {
    // 1. 현재 파일 정보 가져오기 (SHA 값 필요)
    let sha: string | null = null

    try {
      const fileResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      )

      if (fileResponse.status === 200) {
        const fileData = await fileResponse.json()
        sha = fileData.sha
        console.log(`[GitHub] 기존 파일 SHA 발견: ${sha}`)
      } else if (fileResponse.status === 404) {
        console.log(`[GitHub] 파일이 존재하지 않습니다. 새로 생성합니다: ${filePath}`)
      } else {
        const errorData = await fileResponse.json()
        console.error(`[GitHub] 파일 정보 가져오기 실패 (상태: ${fileResponse.status}):`, errorData)
      }
    } catch (error) {
      console.error(`[GitHub] 파일 정보 가져오기 중 오류 발생:`, error)
    }

    // content를 Base64로 인코딩
    const encodedContent = Buffer.isBuffer(content)
      ? content.toString("base64")
      : Buffer.from(content, "utf8").toString("base64")

    // 2. 파일 커밋
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encodedContent, // Base64 인코딩된 내용
          branch: GITHUB_BRANCH,
          sha: sha || undefined, // 파일이 없으면 SHA 없이 생성
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("GitHub 커밋 실패:", errorData)
      return false
    }

    console.log(`파일 ${filePath}이(가) GitHub에 성공적으로 커밋되었습니다.`)
    return true
  } catch (error) {
    console.error("GitHub 커밋 중 오류 발생:", error)
    return false
  }
}

/**
 * 여러 파일을 한 번에 커밋합니다.
 */
export async function commitMultipleFilesToGitHub(
  files: { path: string; content: string | Buffer }[], // content 타입 변경
  commitMessage: string,
): Promise<boolean> {
  if (!isGitHubConfigured || files.length === 0) {
    console.log("GitHub 환경 변수가 설정되지 않았거나 커밋할 파일이 없습니다.")
    return false
  }

  // 각 파일을 개별적으로 커밋
  const results = await Promise.all(files.map((file) => commitFileToGitHub(file.path, file.content, commitMessage)))

  // 모든 파일이 성공적으로 커밋되었는지 확인
  return results.every((result) => result === true)
}
