// GitHub 파일 시스템 사용 - neon 타입 완전 제거
import { getCompanyData, updateCompanyData } from "@/lib/file-db"

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
  constructor() {
    // GitHub 파일 시스템 사용
  }

  async getCompanyInfo(): Promise<{ companyInfo: CompanyInfo; executives: Executive[] } | null> {
    try {
      // GitHub에서 회사 정보 조회
      const companyData = await getCompanyData()

      // 임원 정보는 별도 파일에서 조회 (현재는 빈 배열)
      const executives: Executive[] = []

      const companyInfo: CompanyInfo = {
        ...companyData,
        slogan: companyData.description || "",
        established_year: "2020",
        employee_count: "10-50",
        service_area: "전국",
        logo_url: companyData.logoUrl || "",
        business_hours: {
          weekday: "09:00-18:00",
          weekend: "휴무",
          holiday: "휴무",
          emergency: "24시간",
        },
        social_media: {
          facebook: "",
          instagram: "",
          linkedin: "",
          youtube: "",
          blog: "",
        },
        map_info: {
          latitude: "37.5665",
          longitude: "126.9780",
          zoom_level: "15",
          map_embed_url: "",
        },
        main_services: ["부동산 컨설팅", "투자 자문", "자산 관리"],
        certifications: ["공인중개사", "투자상담사"],
        site_images: {
          hero_main: companyData.heroImageUrl || "",
          hero_about: companyData.aboutImageUrl || "",
          hero_services: "",
          hero_contact: "",
          company_building: "",
          team_photo: "",
          office_interior: "",
          service_showcase: "",
        },
      }

      return {
        companyInfo,
        executives,
      }
    } catch (error) {
      console.error("Error fetching company info:", error)
      return null
    }
  }

  async upsertCompanyInfo(data: Partial<CompanyInfo>): Promise<CompanyInfo> {
    try {
      const result = await updateCompanyData({
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
        logoUrl: data.logo_url || "",
        heroImageUrl: data.site_images?.hero_main || "",
        aboutImageUrl: data.site_images?.hero_about || "",
      })

      if (result.success && result.data) {
        return {
          ...data,
          ...result.data,
        } as CompanyInfo
      } else {
        throw new Error(result.error || "업데이트 실패")
      }
    } catch (error) {
      console.error("Error upserting company info:", error)
      throw error
    }
  }

  async upsertExecutive(data: Partial<Executive>): Promise<Executive> {
    try {
      // GitHub 파일 시스템에서 임원 정보 관리는 추후 구현
      console.log("임원 정보 업데이트:", data)
      return data as Executive
    } catch (error) {
      console.error("Error upserting executive:", error)
      throw error
    }
  }

  async deleteExecutive(id: number): Promise<boolean> {
    try {
      // GitHub 파일 시스템에서 임원 정보 삭제는 추후 구현
      console.log("임원 정보 삭제:", id)
      return true
    } catch (error) {
      console.error("Error deleting executive:", error)
      return false
    }
  }
}
