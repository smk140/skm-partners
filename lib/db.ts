// GitHub 파일 시스템 사용 - 모든 데이터베이스 관련 코드 완전 제거
import {
  getCompanyData,
  updateCompanyData,
  getInquiriesData,
  getPropertiesData,
  addInquiry,
  addProperty,
  testGitHubConnection,
} from "./file-db"

// 레거시 인터페이스 유지 (호환성을 위해)
export interface Inquiry {
  id: number
  name: string
  phone: string
  email?: string
  company?: string
  service: string
  message?: string
  status: string
  created_at: string
}

export interface Property {
  id: number
  title: string
  location: string
  type: string
  size?: string
  price?: string
  description?: string
  images?: string[]
  status: string
  created_at: string
}

export interface CompanyInfo {
  id: number
  name: string
  address: string
  phone: string
  email: string
  description?: string
}

export interface Executive {
  id: number
  name: string
  position: string
  bio?: string
  image_url?: string
  order_index: number
}

export interface SuccessCase {
  id: number
  title: string
  location: string
  before_status: string
  after_status: string
  period: string
  details?: string
  image_url?: string
}

// GitHub 파일 시스템 함수들 재내보내기
export { getCompanyData, updateCompanyData, getInquiriesData, getPropertiesData, addInquiry, addProperty }

// 레거시 호환성을 위한 더미 SQL 함수들
export const sql = async (query: TemplateStringsArray, ...values: any[]) => {
  console.log("⚠️ 레거시 SQL 호출 (GitHub 파일 시스템으로 대체됨):", query.join(""), values)
  return []
}

export function createSqlFunction() {
  return function sql(strings: TemplateStringsArray, ...values: any[]) {
    const query = strings.reduce((result, string, i) => {
      return result + string + (values[i] || "")
    }, "")
    console.log("⚠️ 레거시 SQL 템플릿 호출 (GitHub 파일 시스템으로 대체됨):", query)
    return Promise.resolve([])
  }
}

export const sqlTemplate = createSqlFunction()

// 데이터베이스 연결 함수들 (GitHub으로 대체)
export async function connectToDatabase() {
  return await testGitHubConnection()
}

export async function testConnection() {
  const result = await testGitHubConnection()
  return result.success
}

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
