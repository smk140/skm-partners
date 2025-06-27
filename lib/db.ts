// GitHub 파일 시스템 사용 - 모든 데이터베이스 관련 코드 제거
import { getCompanyData, updateCompanyData, getInquiriesData, getPropertiesData } from "./file-db"

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
export { getCompanyData, updateCompanyData, getInquiriesData, getPropertiesData }

// 레거시 호환성을 위한 더미 SQL 함수
export const sql = async (query: TemplateStringsArray, ...values: any[]) => {
  console.log("레거시 SQL 호출 (GitHub 파일 시스템으로 대체됨):", query.join(""), values)
  return []
}

// 템플릿 리터럴 함수
export function createSqlFunction() {
  return function sql(strings: TemplateStringsArray, ...values: any[]) {
    const query = strings.reduce((result, string, i) => {
      return result + string + (values[i] || "")
    }, "")
    console.log("레거시 SQL 템플릿 호출 (GitHub 파일 시스템으로 대체됨):", query)
    return Promise.resolve([])
  }
}

// 기본 export
export const sqlTemplate = createSqlFunction()
