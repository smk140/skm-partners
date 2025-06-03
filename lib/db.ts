// 임시로 데이터베이스 연결 없이 타입만 정의
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

// 임시 SQL 함수 (실제 데이터베이스 연결 없이)
export const sql = async (query: TemplateStringsArray, ...values: any[]) => {
  console.log("SQL Query:", query.join(""), values)
  return []
}

// 템플릿 리터럴 함수
export function createSqlFunction() {
  return function sql(strings: TemplateStringsArray, ...values: any[]) {
    const query = strings.reduce((result, string, i) => {
      return result + string + (values[i] || "")
    }, "")
    console.log("SQL Template Query:", query)
    return Promise.resolve([])
  }
}

// 기본 export
export const sqlTemplate = createSqlFunction()
