import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface CompanyData {
  id?: number
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  logoUrl: string
  heroImageUrl: string
  aboutImageUrl: string
  createdAt?: Date
  updatedAt?: Date
}

export interface InquiryData {
  id?: number
  name: string
  email: string
  phone: string
  message: string
  createdAt?: Date
}

export interface PropertyData {
  id?: number
  title: string
  description: string
  price: number
  location: string
  imageUrl: string
  createdAt?: Date
  updatedAt?: Date
}

export async function getCompanyData(): Promise<CompanyData> {
  try {
    console.log("🔍 데이터베이스에서 회사 정보 조회 중...")

    const result = await sql`
      SELECT * FROM company_info 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    if (result.length === 0) {
      console.log("📝 회사 정보가 없어서 기본값 반환")
      return {
        name: "SKM 파트너스",
        description: "전문적인 비즈니스 솔루션을 제공하는 파트너십 기업입니다.",
        address: "서울특별시 강남구",
        phone: "02-1234-5678",
        email: "info@skm-partners.com",
        website: "https://skm-partners.com",
        logoUrl: "",
        heroImageUrl: "",
        aboutImageUrl: "",
      }
    }

    const company = result[0]
    console.log("✅ 회사 정보 조회 성공:", company.name)

    return {
      id: company.id,
      name: company.name,
      description: company.description,
      address: company.address,
      phone: company.phone,
      email: company.email,
      website: company.website,
      logoUrl: company.logo_url || "",
      heroImageUrl: company.hero_image_url || "",
      aboutImageUrl: company.about_image_url || "",
      createdAt: company.created_at,
      updatedAt: company.updated_at,
    }
  } catch (error) {
    console.error("💥 회사 정보 조회 실패:", error)
    throw new Error(`회사 정보 조회 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

export async function updateCompanyData(
  data: Partial<CompanyData>,
): Promise<{ success: boolean; data?: CompanyData; error?: string }> {
  try {
    console.log("💾 회사 정보 업데이트 시작:", data)

    // 기존 데이터 확인
    const existing = await sql`
      SELECT id FROM company_info 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    const now = new Date()

    let result
    if (existing.length === 0) {
      // 새로 생성
      console.log("📝 새 회사 정보 생성")
      result = await sql`
        INSERT INTO company_info (
          name, description, address, phone, email, website,
          logo_url, hero_image_url, about_image_url,
          created_at, updated_at
        ) VALUES (
          ${data.name || "SKM 파트너스"},
          ${data.description || ""},
          ${data.address || ""},
          ${data.phone || ""},
          ${data.email || ""},
          ${data.website || ""},
          ${data.logoUrl || ""},
          ${data.heroImageUrl || ""},
          ${data.aboutImageUrl || ""},
          ${now},
          ${now}
        )
        RETURNING *
      `
    } else {
      // 업데이트
      console.log("🔄 기존 회사 정보 업데이트")
      result = await sql`
        UPDATE company_info SET
          name = ${data.name || "SKM 파트너스"},
          description = ${data.description || ""},
          address = ${data.address || ""},
          phone = ${data.phone || ""},
          email = ${data.email || ""},
          website = ${data.website || ""},
          logo_url = ${data.logoUrl || ""},
          hero_image_url = ${data.heroImageUrl || ""},
          about_image_url = ${data.aboutImageUrl || ""},
          updated_at = ${now}
        WHERE id = ${existing[0].id}
        RETURNING *
      `
    }

    if (result.length === 0) {
      throw new Error("데이터베이스 업데이트 실패")
    }

    const updated = result[0]
    console.log("✅ 회사 정보 업데이트 성공:", updated.name)

    return {
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        address: updated.address,
        phone: updated.phone,
        email: updated.email,
        website: updated.website,
        logoUrl: updated.logo_url || "",
        heroImageUrl: updated.hero_image_url || "",
        aboutImageUrl: updated.about_image_url || "",
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
    }
  } catch (error) {
    console.error("💥 회사 정보 업데이트 실패:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

// 문의 목록 조회
export async function getInquiriesData(): Promise<InquiryData[]> {
  try {
    console.log("🔍 문의 목록 조회 중...")

    const rows = await sql`
      SELECT id, name, email, phone, message, created_at
      FROM inquiries
      ORDER BY created_at DESC
    `

    const inquiries = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      createdAt: row.created_at,
    }))

    console.log(`✅ 문의 ${inquiries.length}건 조회 성공`)
    return inquiries
  } catch (error) {
    console.error("💥 문의 조회 실패:", error)
    return []
  }
}

// 부동산 목록 조회
export async function getPropertiesData(): Promise<PropertyData[]> {
  try {
    console.log("🔍 부동산 목록 조회 중...")

    const rows = await sql`
      SELECT id, title, description, price, location, image_url, created_at, updated_at
      FROM properties
      ORDER BY updated_at DESC NULLS LAST
    `

    const properties = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: Number(row.price),
      location: row.location,
      imageUrl: row.image_url || "",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))

    console.log(`✅ 부동산 ${properties.length}건 조회 성공`)
    return properties
  } catch (error) {
    console.error("💥 부동산 조회 실패:", error)
    return []
  }
}
