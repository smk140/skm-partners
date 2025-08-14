import { Octokit } from "@octokit/rest"

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export interface CompanyData {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  logoUrl?: string
  heroImageUrl?: string
  aboutImageUrl?: string
  /* Page-specific hero images */
  servicesHeroUrl?: string
  realEstateHeroUrl?: string
  contactHeroUrl?: string
  /* Service-specific images */
  buildingManagementUrl?: string
  cleaningServiceUrl?: string
  fireInspectionUrl?: string
  elevatorManagementUrl?: string
  /* About page images */
  teamPhotoUrl?: string
  officeInteriorUrl?: string
  serviceShowcaseUrl?: string
  /* Contact page images */
  companyBuildingUrl?: string
}

export interface InquiryData {
  id: number
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

export interface PropertyData {
  id: number
  title: string
  description: string
  price: number
  location: string
  imageUrl?: string
  createdAt: string
}

/* ------------------------------------------------------------------ */
/* Defaults                                                           */
/* ------------------------------------------------------------------ */
const DEFAULT_COMPANY_DATA: CompanyData = {
  name: "SKM파트너스",
  description: "전문적인 부동산 컨설팅 서비스를 제공합니다.",
  address: "서울특별시 강남구 테헤란로 123",
  phone: "02-1234-5678",
  email: "info@skm.kr",
  website: "https://skm.kr",
  logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop",
  heroImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
  aboutImageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
  servicesHeroUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=400&fit=crop",
  realEstateHeroUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop",
  contactHeroUrl: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=400&fit=crop",
  buildingManagementUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
  cleaningServiceUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
  fireInspectionUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
  elevatorManagementUrl: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
  teamPhotoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  officeInteriorUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop",
  serviceShowcaseUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
  companyBuildingUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
}

/* ------------------------------------------------------------------ */
/* GitHub helpers                                                     */
/* ------------------------------------------------------------------ */
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = process.env.GITHUB_REPO_OWNER
const REPO_NAME = process.env.GITHUB_REPO_NAME
const BRANCH = process.env.GITHUB_BRANCH || "main"

function getOctokit() {
  if (!GITHUB_TOKEN) {
    console.error("❌ GITHUB_TOKEN is missing")
    return null
  }
  return new Octokit({ auth: GITHUB_TOKEN })
}

async function readJson<T>(octokit: Octokit, filePath: string): Promise<{ json: T; sha: string } | null> {
  try {
    console.log(`📖 Reading file: ${filePath}`)
    const params: any = {
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      path: filePath,
    }
    if (BRANCH) params.ref = BRANCH

    const res = await octokit.repos.getContent(params)

    if (!("content" in res.data)) {
      console.log(`⚠️  File ${filePath} is not a file (might be directory)`)
      return null
    }

    const decoded = Buffer.from(res.data.content, "base64").toString("utf8")
    const json = JSON.parse(decoded) as T
    console.log(`✅ Successfully read file: ${filePath}`)
    return { json, sha: res.data.sha }
  } catch (error: any) {
    if (error.status === 404) {
      console.log(`📄 File ${filePath} does not exist (404)`)
      return null
    }
    console.error(`❌ Error reading file ${filePath}:`, error.message)
    throw error
  }
}

async function writeJson(octokit: Octokit, filePath: string, data: unknown, msg: string, sha?: string) {
  try {
    console.log(`📝 Writing file: ${filePath}`)
    const content = JSON.stringify(data, null, 2)
    const base64Content = Buffer.from(content).toString("base64")

    const params: any = {
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      path: filePath,
      message: msg,
      content: base64Content,
    }
    if (BRANCH) params.branch = BRANCH
    if (sha) params.sha = sha

    await octokit.repos.createOrUpdateFileContents(params)
    console.log(`✅ Successfully wrote file: ${filePath}`)
  } catch (error: any) {
    console.error(`❌ Error writing file ${filePath}:`, error.message)
    throw error
  }
}

/* ------------------------------------------------------------------ */
/* Company helpers                                                    */
/* ------------------------------------------------------------------ */
const COMPANY_PATH = "data/company.json"

export async function getCompanyData(): Promise<CompanyData> {
  console.log("🏢 Getting company data...")

  const octokit = getOctokit()
  if (!octokit) {
    console.log("⚠️  No GitHub credentials, returning default data")
    return DEFAULT_COMPANY_DATA
  }

  if (!REPO_OWNER || !REPO_NAME) {
    console.error("❌ REPO_OWNER or REPO_NAME is missing")
    return DEFAULT_COMPANY_DATA
  }

  try {
    // Try to read existing file
    const file = await readJson<CompanyData>(octokit, COMPANY_PATH)

    if (file) {
      console.log("✅ Found existing company data")
      return { ...DEFAULT_COMPANY_DATA, ...file.json }
    }

    // File doesn't exist, create it
    console.log("📝 Creating default company data file...")
    await writeJson(octokit, COMPANY_PATH, DEFAULT_COMPANY_DATA, "Create default company.json")
    console.log("✅ Default company data file created")
    return DEFAULT_COMPANY_DATA
  } catch (error: any) {
    console.error("❌ Failed to get company data:", error.message)
    console.log("🔄 Returning default data as fallback")
    return DEFAULT_COMPANY_DATA
  }
}

export async function updateCompanyData(delta: Partial<CompanyData>) {
  console.log("🔄 Updating company data...")

  const octokit = getOctokit()
  if (!octokit || !REPO_OWNER || !REPO_NAME) {
    return { success: false, error: "GitHub credentials missing" }
  }

  try {
    // Get current data
    const file = await readJson<CompanyData>(octokit, COMPANY_PATH)
    const current = file?.json ?? DEFAULT_COMPANY_DATA
    const updated = { ...current, ...delta }

    // Save updated data
    await writeJson(octokit, COMPANY_PATH, updated, "Update company.json", file?.sha)
    console.log("✅ Company data updated successfully")
    return { success: true, data: updated }
  } catch (error: any) {
    console.error("❌ Failed to update company data:", error.message)
    return { success: false, error: error.message }
  }
}

/* ------------------------------------------------------------------ */
/* Inquiries helpers                                                  */
/* ------------------------------------------------------------------ */
const INQUIRY_PATH = "data/inquiries.json"

export async function getInquiriesData(): Promise<InquiryData[]> {
  const octokit = getOctokit()
  if (!octokit || !REPO_OWNER || !REPO_NAME) return []

  try {
    const file = await readJson<{ inquiries: InquiryData[] }>(octokit, INQUIRY_PATH)
    if (file) return file.json.inquiries

    // File doesn't exist, create empty file
    console.log("📝 Creating empty inquiries file...")
    await writeJson(octokit, INQUIRY_PATH, { inquiries: [] }, "Create empty inquiries.json")
    return []
  } catch (error) {
    console.error("Failed to get inquiries:", error)
    return []
  }
}

export async function addInquiry(
  inquiry: Omit<InquiryData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  const octokit = getOctokit()
  if (!octokit || !REPO_OWNER || !REPO_NAME) {
    return { success: false, error: "GitHub credentials missing" }
  }

  try {
    const list = await getInquiriesData()
    const newInquiry: InquiryData = {
      ...inquiry,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    list.push(newInquiry)

    const file = await readJson<{ inquiries: InquiryData[] }>(octokit, INQUIRY_PATH)
    await writeJson(octokit, INQUIRY_PATH, { inquiries: list }, "Add inquiry", file?.sha)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/* ------------------------------------------------------------------ */
/* Properties helpers                                                 */
/* ------------------------------------------------------------------ */
const PROPERTY_PATH = "data/properties.json"

const DEFAULT_PROPERTIES: PropertyData[] = [
  {
    id: 1,
    title: "강남 프리미엄 오피스",
    description: "강남역 도보 5분 거리의 프리미엄 오피스 공간입니다.",
    price: 5_000_000,
    location: "서울시 강남구 테헤란로",
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "홍대 상권 상가",
    description: "홍대 핫플레이스 중심가의 1층 상가입니다.",
    price: 3_000_000,
    location: "서울시 마포구 홍익로",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
]

export async function getPropertiesData(): Promise<PropertyData[]> {
  const octokit = getOctokit()
  if (!octokit || !REPO_OWNER || !REPO_NAME) return DEFAULT_PROPERTIES

  try {
    const file = await readJson<{ properties: PropertyData[] }>(octokit, PROPERTY_PATH)
    if (file) return file.json.properties

    // Create default properties file
    await writeJson(octokit, PROPERTY_PATH, { properties: DEFAULT_PROPERTIES }, "Create default properties")
    return DEFAULT_PROPERTIES
  } catch (error) {
    console.error("Failed to get properties:", error)
    return DEFAULT_PROPERTIES
  }
}

export async function addProperty(
  prop: Omit<PropertyData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  const octokit = getOctokit()
  if (!octokit || !REPO_OWNER || !REPO_NAME) {
    return { success: false, error: "GitHub credentials missing" }
  }

  try {
    const list = await getPropertiesData()
    const newProp: PropertyData = {
      ...prop,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    list.push(newProp)

    const file = await readJson<{ properties: PropertyData[] }>(octokit, PROPERTY_PATH)
    await writeJson(octokit, PROPERTY_PATH, { properties: list }, "Add property", file?.sha)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProperty(
  id: string,
  updates: Partial<PropertyData>,
): Promise<{ success: boolean; error?: string }> {
  const octokit = getOctokit()
  if (!octokit || !REPO_OWNER || !REPO_NAME) {
    return { success: false, error: "GitHub credentials missing" }
  }

  try {
    const list = await getPropertiesData()
    const idx = list.findIndex((p) => p.id.toString() === id)
    if (idx === -1) return { success: false, error: "Property not found" }

    list[idx] = { ...list[idx], ...updates }
    const file = await readJson<{ properties: PropertyData[] }>(octokit, PROPERTY_PATH)
    await writeJson(octokit, PROPERTY_PATH, { properties: list }, "Update property", file?.sha)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
  const octokit = getOctokit()
  if (!octokit || !REPO_OWNER || !REPO_NAME) {
    return { success: false, error: "GitHub credentials missing" }
  }

  try {
    const list = (await getPropertiesData()).filter((p) => p.id.toString() !== id)
    const file = await readJson<{ properties: PropertyData[] }>(octokit, PROPERTY_PATH)
    await writeJson(octokit, PROPERTY_PATH, { properties: list }, "Delete property", file?.sha)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/* ------------------------------------------------------------------ */
/* GitHub connection test                                             */
/* ------------------------------------------------------------------ */
export async function testGitHubConnection() {
  console.log("🔍 Testing GitHub connection...")

  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
    const missing = []
    if (!GITHUB_TOKEN) missing.push("GITHUB_TOKEN")
    if (!REPO_OWNER) missing.push("GITHUB_REPO_OWNER")
    if (!REPO_NAME) missing.push("GITHUB_REPO_NAME")
    return {
      success: false,
      message: `Missing environment variables: ${missing.join(", ")}`,
    }
  }

  const octokit = getOctokit()
  if (!octokit) {
    return { success: false, message: "Could not initialize Octokit" }
  }

  try {
    const res = await octokit.repos.get({ owner: REPO_OWNER, repo: REPO_NAME })
    console.log("✅ GitHub connection successful")
    return {
      success: true,
      message: `Connected to ${res.data.full_name}`,
      details: {
        private: res.data.private,
        permissions: res.data.permissions,
        default_branch: res.data.default_branch,
      },
    }
  } catch (error: any) {
    console.error("❌ GitHub connection failed:", error.message)
    return {
      success: false,
      message: `GitHub API Error: ${error.message}`,
      details: { status: error.status, response: error.response?.data },
    }
  }
}
