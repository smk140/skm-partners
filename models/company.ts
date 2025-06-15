export interface CompanyData {
  id?: number
  name: string
  address: string
  phone: string
  email: string
  description?: string
  logo_url?: string
  created_at?: string
  updated_at?: string
}

export interface Executive {
  id?: number
  company_id?: number
  name: string
  position: string
  bio?: string
  image_url?: string
  order_index: number
  created_at?: string
}

export interface SuccessCase {
  id?: number
  company_id?: number
  title: string
  location: string
  before_status: string
  after_status: string
  period: string
  details?: string
  image_url?: string
  created_at?: string
}

class Company {
  private sql: any

  constructor(sql: any) {
    this.sql = sql
  }

  // 회사 정보 조회
  async getCompanyInfo(): Promise<CompanyData | null> {
    try {
      const result = await this.sql`
        SELECT * FROM company_info 
        ORDER BY id DESC 
        LIMIT 1
      `
      return result[0] || null
    } catch (error) {
      console.error("Error fetching company info:", error)
      throw error
    }
  }

  // 회사 정보 업데이트 또는 생성
  async upsertCompanyInfo(data: Omit<CompanyData, "id" | "created_at" | "updated_at">): Promise<CompanyData> {
    try {
      const existing = await this.getCompanyInfo()

      if (existing) {
        // 업데이트
        const result = await this.sql`
          UPDATE company_info 
          SET 
            name = ${data.name},
            address = ${data.address},
            phone = ${data.phone},
            email = ${data.email},
            description = ${data.description || ""},
            logo_url = ${data.logo_url || ""},
            updated_at = NOW()
          WHERE id = ${existing.id}
          RETURNING *
        `
        return result[0]
      } else {
        // 생성
        const result = await this.sql`
          INSERT INTO company_info (name, address, phone, email, description, logo_url)
          VALUES (${data.name}, ${data.address}, ${data.phone}, ${data.email}, ${data.description || ""}, ${data.logo_url || ""})
          RETURNING *
        `
        return result[0]
      }
    } catch (error) {
      console.error("Error upserting company info:", error)
      throw error
    }
  }

  // 임원진 조회
  async getExecutives(): Promise<Executive[]> {
    try {
      const result = await this.sql`
        SELECT * FROM executives 
        ORDER BY order_index ASC, id ASC
      `
      return result
    } catch (error) {
      console.error("Error fetching executives:", error)
      throw error
    }
  }

  // 임원진 추가
  async addExecutive(data: Omit<Executive, "id" | "created_at">): Promise<Executive> {
    try {
      const result = await this.sql`
        INSERT INTO executives (name, position, bio, image_url, order_index)
        VALUES (${data.name}, ${data.position}, ${data.bio || ""}, ${data.image_url || ""}, ${data.order_index})
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error adding executive:", error)
      throw error
    }
  }

  // 임원진 업데이트
  async updateExecutive(id: number, data: Partial<Executive>): Promise<Executive> {
    try {
      const result = await this.sql`
        UPDATE executives 
        SET 
          name = COALESCE(${data.name}, name),
          position = COALESCE(${data.position}, position),
          bio = COALESCE(${data.bio}, bio),
          image_url = COALESCE(${data.image_url}, image_url),
          order_index = COALESCE(${data.order_index}, order_index)
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error updating executive:", error)
      throw error
    }
  }

  // 임원진 삭제
  async deleteExecutive(id: number): Promise<boolean> {
    try {
      await this.sql`DELETE FROM executives WHERE id = ${id}`
      return true
    } catch (error) {
      console.error("Error deleting executive:", error)
      throw error
    }
  }

  // 성공사례 조회
  async getSuccessCases(): Promise<SuccessCase[]> {
    try {
      const result = await this.sql`
        SELECT * FROM success_cases 
        ORDER BY created_at DESC
      `
      return result
    } catch (error) {
      console.error("Error fetching success cases:", error)
      throw error
    }
  }

  // 성공사례 추가
  async addSuccessCase(data: Omit<SuccessCase, "id" | "created_at">): Promise<SuccessCase> {
    try {
      const result = await this.sql`
        INSERT INTO success_cases (title, location, before_status, after_status, period, details, image_url)
        VALUES (${data.title}, ${data.location}, ${data.before_status}, ${data.after_status}, ${data.period}, ${data.details || ""}, ${data.image_url || ""})
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error adding success case:", error)
      throw error
    }
  }

  // 성공사례 업데이트
  async updateSuccessCase(id: number, data: Partial<SuccessCase>): Promise<SuccessCase> {
    try {
      const result = await this.sql`
        UPDATE success_cases 
        SET 
          title = COALESCE(${data.title}, title),
          location = COALESCE(${data.location}, location),
          before_status = COALESCE(${data.before_status}, before_status),
          after_status = COALESCE(${data.after_status}, after_status),
          period = COALESCE(${data.period}, period),
          details = COALESCE(${data.details}, details),
          image_url = COALESCE(${data.image_url}, image_url)
        WHERE id = ${id}
        RETURNING *
      `
      return result[0]
    } catch (error) {
      console.error("Error updating success case:", error)
      throw error
    }
  }

  // 성공사례 삭제
  async deleteSuccessCase(id: number): Promise<boolean> {
    try {
      await this.sql`DELETE FROM success_cases WHERE id = ${id}`
      return true
    } catch (error) {
      console.error("Error deleting success case:", error)
      throw error
    }
  }
}

export default Company
