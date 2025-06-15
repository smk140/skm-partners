import type { neon } from "@neondatabase/serverless"

export interface CompanyInfo {
  id?: number
  name: string
  slogan: string
  address: string
  phone: string
  email: string
  website: string
  description: string
  established_year: string
  employee_count: string
  service_area: string
  logo_url: string
  business_hours: {
    weekday: string
    weekend: string
    holiday: string
    emergency: string
  }
  social_media: {
    facebook: string
    instagram: string
    linkedin: string
    youtube: string
    blog: string
  }
  map_info: {
    latitude: string
    longitude: string
    zoom_level: string
    map_embed_url: string
  }
  main_services: string[]
  certifications: string[]
  site_images: {
    hero_main: string
    hero_about: string
    hero_services: string
    hero_contact: string
    company_building: string
    team_photo: string
    office_interior: string
    service_showcase: string
  }
}

export interface Executive {
  id: number
  name: string
  position: string
  bio: string
  order_index: number
  image_url?: string
}

export default class Company {
  private sql: ReturnType<typeof neon>

  constructor(sql: ReturnType<typeof neon>) {
    this.sql = sql
  }

  async getCompanyInfo(): Promise<{ companyInfo: CompanyInfo; executives: Executive[] } | null> {
    try {
      // 회사 정보 조회
      const companyResult = await this.sql`
        SELECT * FROM company_info ORDER BY id DESC LIMIT 1
      `

      // 임원 정보 조회
      const executivesResult = await this.sql`
        SELECT * FROM executives ORDER BY order_index ASC
      `

      if (companyResult.length === 0) {
        return null
      }

      const companyData = companyResult[0]

      // JSON 필드들을 파싱
      const companyInfo: CompanyInfo = {
        ...companyData,
        business_hours:
          typeof companyData.business_hours === "string"
            ? JSON.parse(companyData.business_hours)
            : companyData.business_hours || {},
        social_media:
          typeof companyData.social_media === "string"
            ? JSON.parse(companyData.social_media)
            : companyData.social_media || {},
        map_info:
          typeof companyData.map_info === "string" ? JSON.parse(companyData.map_info) : companyData.map_info || {},
        main_services:
          typeof companyData.main_services === "string"
            ? JSON.parse(companyData.main_services)
            : companyData.main_services || [],
        certifications:
          typeof companyData.certifications === "string"
            ? JSON.parse(companyData.certifications)
            : companyData.certifications || [],
        site_images:
          typeof companyData.site_images === "string"
            ? JSON.parse(companyData.site_images)
            : companyData.site_images || {},
      }

      return {
        companyInfo,
        executives: executivesResult as Executive[],
      }
    } catch (error) {
      console.error("Error fetching company info:", error)
      return null
    }
  }

  async upsertCompanyInfo(data: Partial<CompanyInfo>): Promise<CompanyInfo> {
    try {
      const result = await this.sql`
        INSERT INTO company_info (
          name, slogan, address, phone, email, website, description,
          established_year, employee_count, service_area, logo_url,
          business_hours, social_media, map_info, main_services, 
          certifications, site_images, updated_at
        ) VALUES (
          ${data.name}, ${data.slogan}, ${data.address}, ${data.phone}, 
          ${data.email}, ${data.website}, ${data.description},
          ${data.established_year}, ${data.employee_count}, ${data.service_area}, 
          ${data.logo_url}, ${JSON.stringify(data.business_hours)},
          ${JSON.stringify(data.social_media)}, ${JSON.stringify(data.map_info)},
          ${JSON.stringify(data.main_services)}, ${JSON.stringify(data.certifications)},
          ${JSON.stringify(data.site_images)}, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slogan = EXCLUDED.slogan,
          address = EXCLUDED.address,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          website = EXCLUDED.website,
          description = EXCLUDED.description,
          established_year = EXCLUDED.established_year,
          employee_count = EXCLUDED.employee_count,
          service_area = EXCLUDED.service_area,
          logo_url = EXCLUDED.logo_url,
          business_hours = EXCLUDED.business_hours,
          social_media = EXCLUDED.social_media,
          map_info = EXCLUDED.map_info,
          main_services = EXCLUDED.main_services,
          certifications = EXCLUDED.certifications,
          site_images = EXCLUDED.site_images,
          updated_at = NOW()
        RETURNING *
      `

      return result[0] as CompanyInfo
    } catch (error) {
      console.error("Error upserting company info:", error)
      throw error
    }
  }

  async upsertExecutive(data: Partial<Executive>): Promise<Executive> {
    try {
      const result = await this.sql`
        INSERT INTO executives (name, position, bio, order_index, image_url)
        VALUES (${data.name}, ${data.position}, ${data.bio}, ${data.order_index}, ${data.image_url})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          position = EXCLUDED.position,
          bio = EXCLUDED.bio,
          order_index = EXCLUDED.order_index,
          image_url = EXCLUDED.image_url
        RETURNING *
      `

      return result[0] as Executive
    } catch (error) {
      console.error("Error upserting executive:", error)
      throw error
    }
  }

  async deleteExecutive(id: number): Promise<boolean> {
    try {
      await this.sql`DELETE FROM executives WHERE id = ${id}`
      return true
    } catch (error) {
      console.error("Error deleting executive:", error)
      return false
    }
  }
}
