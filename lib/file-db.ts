import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

/* ────────────────
   🔖 Type Helpers
   ──────────────── */
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

/* ────────────────────────────────
   1) 회사 정보 조회  getCompanyData
   ──────────────────────────────── */
export async function getCompanyData(): Promise<CompanyData> {
  try {
    const rows = await sql`
      SELECT *
      FROM company_info
      ORDER BY updated_at DESC
      LIMIT 1
    `

    if (rows.length === 0) {
      /* 기본값 반환 (앱 첫 실행 시) */
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

    const c = rows[0]
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      address: c.address,
      phone: c.phone,
      email: c.email,
      website: c.website,
      logoUrl: c.logo_url ?? "",
      heroImageUrl: c.hero_image_url ?? "",
      aboutImageUrl: c.about_image_url ?? "",
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }
  } catch (err) {
    console.error("💥 [getCompanyData] 실패:", err)
    throw err
  }
}

/* ───────────────────────────────────────
   2) 회사 정보 업데이트  updateCompanyData
   ─────────────────────────────────────── */
export async function updateCompanyData(
  data: Partial<CompanyData>,
): Promise<{ success: boolean; data?: CompanyData; error?: string }> {
  const now = new Date()

  try {
    const existing = await sql`
      SELECT id FROM company_info
      ORDER BY updated_at DESC
      LIMIT 1
    `

    let row
    if (existing.length === 0) {
      row = (
        await sql`
          INSERT INTO company_info (
            name, description, address, phone, email, website,
            logo_url, hero_image_url, about_image_url,
            created_at, updated_at
          ) VALUES (
            ${data.name ?? "SKM 파트너스"},
            ${data.description ?? ""},
            ${data.address ?? ""},
            ${data.phone ?? ""},
            ${data.email ?? ""},
            ${data.website ?? ""},
            ${data.logoUrl ?? ""},
            ${data.heroImageUrl ?? ""},
            ${data.aboutImageUrl ?? ""},
            ${now},
            ${now}
          )
          RETURNING *
        `
      )[0]
    } else {
      row = (
        await sql`
          UPDATE company_info SET
            name            = COALESCE(${data.name},            name),
            description     = COALESCE(${data.description},     description),
            address         = COALESCE(${data.address},         address),
            phone           = COALESCE(${data.phone},           phone),
            email           = COALESCE(${data.email},           email),
            website         = COALESCE(${data.website},         website),
            logo_url        = COALESCE(${data.logoUrl},         logo_url),
            hero_image_url  = COALESCE(${data.heroImageUrl},    hero_image_url),
            about_image_url = COALESCE(${data.aboutImageUrl},   about_image_url),
            updated_at      = ${now}
          WHERE id = ${existing[0].id}
          RETURNING *
        `
      )[0]
    }

    return {
      success: true,
      data: {
        id: row.id,
        name: row.name,
        description: row.description,
        address: row.address,
        phone: row.phone,
        email: row.email,
        website: row.website,
        logoUrl: row.logo_url ?? "",
        heroImageUrl: row.hero_image_url ?? "",
        aboutImageUrl: row.about_image_url ?? "",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    }
  } catch (err) {
    console.error("💥 [updateCompanyData] 실패:", err)
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
  }
}

/* ────────────────────────────────
   3) 문의 목록  getInquiriesData
   ──────────────────────────────── */
export async function getInquiriesData(): Promise<InquiryData[]> {
  try {
    const rows = await sql`
      SELECT id, name, email, phone, message, created_at
      FROM inquiries
      ORDER BY created_at DESC
    `

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      message: r.message,
      createdAt: r.created_at,
    }))
  } catch (err) {
    console.error("💥 [getInquiriesData] 실패:", err)
    return []
  }
}

/* ─────────────────────────────────
   4) 부동산 목록  getPropertiesData
   ───────────────────────────────── */
export async function getPropertiesData(): Promise<PropertyData[]> {
  try {
    const rows = await sql`
      SELECT id, title, description, price, location, image_url,
             created_at, updated_at
      FROM properties
      ORDER BY updated_at DESC NULLS LAST
    `

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      price: Number(r.price),
      location: r.location,
      imageUrl: r.image_url ?? "",
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }))
  } catch (err) {
    console.error("💥 [getPropertiesData] 실패:", err)
    return []
  }
}
