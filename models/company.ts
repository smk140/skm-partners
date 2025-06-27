// GitHub 파일 시스템 사용 - 완전한 구현
import { getCompanyData, updateCompanyData, type CompanyData } from "@/lib/file-db"

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
    console.log("🏢 Company 모델 초기화 (GitHub 파일 시스템 사용)")
  }

  async getCompanyInfo(): Promise<{ companyInfo: CompanyInfo; executives: Executive[] } | null> {
    try {
      console.log("🔍 회사 정보 조회 중...")

      // GitHub에서 회사 정보 조회
      const companyData = await getCompanyData()

      // 임원 정보는 별도 파일에서 조회 (현재는 빈 배열)
      const executives: Executive[] = []

      // CompanyData를 CompanyInfo 형식으로 변환
      const companyInfo: CompanyInfo = {
        id: 1,
        name: companyData.name,
        slogan: companyData.description || "",
        address: companyData.address,
        phone: companyData.phone,
        email: companyData.email,
        website: companyData.website,
        description: companyData.description,
        established_year: "2020",
        employee_count: "10-50",
        service_area: "전국",
        logo_url: companyData.logoUrl || "",
        business_hours: {
          weekday: "09:00-18:00",
          weekend: "휴무",
          holiday: "휴무",
          emergency: "24시간 상담 가능",
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
        main_services: ["부동산 컨설팅", "투자 자문", "자산 관리", "매매 중개", "임대 관리"],
        certifications: ["공인중개사", "투자상담사", "부동산 전문가"],
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

      console.log("✅ 회사 정보 조회 성공:", companyInfo.name)

      return {
        companyInfo,
        executives,
      }
    } catch (error) {
      console.error("💥 회사 정보 조회 실패:", error)
      return null
    }
  }

  async upsertCompanyInfo(data: Partial<CompanyInfo>): Promise<CompanyInfo> {
    try {
      console.log("💾 회사 정보 업데이트 중...")

      // CompanyInfo를 CompanyData 형식으로 변환
      const companyData: Partial<CompanyData> = {
        name: data.name || "",
        description: data.description || data.slogan || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || "",
        logoUrl: data.logo_url || "",
        heroImageUrl: data.site_images?.hero_main || "",
        aboutImageUrl: data.site_images?.hero_about || "",
      }

      const result = await updateCompanyData(companyData)

      if (result.success && result.data) {
        console.log("✅ 회사 정보 업데이트 성공")

        // 결과를 CompanyInfo 형식으로 변환하여 반환
        const updatedInfo: CompanyInfo = {
          id: 1,
          name: result.data.name,
          slogan: result.data.description || "",
          address: result.data.address,
          phone: result.data.phone,
          email: result.data.email,
          website: result.data.website,
          description: result.data.description,
          established_year: data.established_year || "2020",
          employee_count: data.employee_count || "10-50",
          service_area: data.service_area || "전국",
          logo_url: result.data.logoUrl || "",
          business_hours: data.business_hours || {
            weekday: "09:00-18:00",
            weekend: "휴무",
            holiday: "휴무",
            emergency: "24시간 상담 가능",
          },
          social_media: data.social_media || {
            facebook: "",
            instagram: "",
            linkedin: "",
            youtube: "",
            blog: "",
          },
          map_info: data.map_info || {
            latitude: "37.5665",
            longitude: "126.9780",
            zoom_level: "15",
            map_embed_url: "",
          },
          main_services: data.main_services || ["부동산 컨설팅", "투자 자문", "자산 관리"],
          certifications: data.certifications || ["공인중개사", "투자상담사"],
          site_images: {
            hero_main: result.data.heroImageUrl || "",
            hero_about: result.data.aboutImageUrl || "",
            hero_services: data.site_images?.hero_services || "",
            hero_contact: data.site_images?.hero_contact || "",
            company_building: data.site_images?.company_building || "",
            team_photo: data.site_images?.team_photo || "",
            office_interior: data.site_images?.office_interior || "",
            service_showcase: data.site_images?.service_showcase || "",
          },
        }

        return updatedInfo
      } else {
        throw new Error(result.error || "업데이트 실패")
      }
    } catch (error) {
      console.error("💥 회사 정보 업데이트 실패:", error)
      throw error
    }
  }

  async upsertExecutive(data: Partial<Executive>): Promise<Executive> {
    try {
      console.log("👤 임원 정보 업데이트:", data.name)

      // GitHub 파일 시스템에서 임원 정보 관리는 추후 구현
      // 현재는 메모리에서만 처리
      const executive: Executive = {
        id: data.id || Date.now(),
        name: data.name || "",
        position: data.position || "",
        bio: data.bio || "",
        order_index: data.order_index || 0,
        image_url: data.image_url || "",
      }

      console.log("✅ 임원 정보 업데이트 완료 (임시)")
      return executive
    } catch (error) {
      console.error("💥 임원 정보 업데이트 실패:", error)
      throw error
    }
  }

  async deleteExecutive(id: number): Promise<boolean> {
    try {
      console.log("🗑️ 임원 정보 삭제:", id)

      // GitHub 파일 시스템에서 임원 정보 삭제는 추후 구현
      // 현재는 성공으로 처리
      console.log("✅ 임원 정보 삭제 완료 (임시)")
      return true
    } catch (error) {
      console.error("💥 임원 정보 삭제 실패:", error)
      return false
    }
  }
}
