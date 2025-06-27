// GitHub 파일 시스템 사용 - neon 완전 제거
import {
  getCompanyData,
  updateCompanyData,
  getInquiriesData,
  getPropertiesData,
  testGitHubConnection,
} from "@/lib/file-db"

export async function connectToDatabase() {
  try {
    console.log("🔗 GitHub API 연결 확인 중...")

    const result = await testGitHubConnection()

    if (result.success) {
      console.log("✅ GitHub API 연결 성공")
      return true
    } else {
      throw new Error(result.error || "GitHub 연결 실패")
    }
  } catch (error) {
    console.error("💥 GitHub API 연결 실패:", error)
    throw error
  }
}

export async function testConnection() {
  try {
    const result = await testGitHubConnection()
    return result.success
  } catch (error) {
    console.error("GitHub API 연결 테스트 실패:", error)
    return false
  }
}

export async function executeTransaction(queries: Array<() => Promise<any>>) {
  try {
    console.log("🔄 트랜잭션 실행 중... (GitHub 순차 처리)")
    const results = []
    for (const query of queries) {
      const result = await query()
      results.push(result)
    }
    console.log("✅ 트랜잭션 완료")
    return results
  } catch (error) {
    console.error("💥 트랜잭션 실패:", error)
    throw error
  }
}

// 레거시 호환성을 위한 재내보내기
export { getCompanyData, updateCompanyData, getInquiriesData, getPropertiesData }
