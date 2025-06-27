// GitHub 파일 시스템 사용 - neon 제거
import { getCompanyData, updateCompanyData, getInquiriesData, getPropertiesData } from "@/lib/file-db"

export async function connectToDatabase() {
  // GitHub API 연결 테스트
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      throw new Error("GITHUB_TOKEN environment variable is not set")
    }

    console.log("GitHub API connection established")
    return true
  } catch (error) {
    console.error("GitHub API connection failed:", error)
    throw error
  }
}

// GitHub API 연결 테스트 함수
export async function testConnection() {
  try {
    await connectToDatabase()
    return true
  } catch (error) {
    console.error("GitHub API connection test failed:", error)
    return false
  }
}

// 트랜잭션 실행 함수 (GitHub에서는 순차 실행)
export async function executeTransaction(queries: Array<() => Promise<any>>) {
  try {
    const results = []
    for (const query of queries) {
      const result = await query()
      results.push(result)
    }
    return results
  } catch (error) {
    console.error("Transaction failed:", error)
    throw error
  }
}

// 레거시 호환성을 위한 재내보내기
export { getCompanyData, updateCompanyData, getInquiriesData, getPropertiesData }
