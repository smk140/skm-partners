// GitHub 파일 기반 데이터 관리
const GITHUB_API_BASE = "https://api.github.com"
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "smk140"
const REPO_NAME = process.env.GITHUB_REPO_NAME || "skm-partners"
const BRANCH = process.env.GITHUB_BRANCH || "main"

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

// GitHub API 헬퍼 함수
async function githubRequest(path: string, options: RequestInit = {}) {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error("GITHUB_TOKEN이 설정되지 않았습니다")
  }

  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API 오류: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// 파일 읽기
async function readGitHubFile(filePath: string) {
  try {
    const data = await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`)
    const content = Buffer.from(data.content, "base64").toString("utf-8")
    return { content: JSON.parse(content), sha: data.sha }
  } catch (error) {
    console.log(`파일 ${filePath}가 존재하지 않음, 기본값 사용`)
    return null
  }
}

// 파일 쓰기
async function writeGitHubFile(filePath: string, content: any, sha?: string) {
  const base64Content = Buffer.from(JSON.stringify(content, null, 2)).toString("base64")

  const body: any = {
    message: `Update ${filePath}`,
    content: base64Content,
    branch: BRANCH,
  }

  if (sha) {
    body.sha = sha
  }

  return await githubRequest(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

export async function getCompanyData(): Promise<CompanyData> {
  try {
    console.log("🔍 GitHub에서 회사 정보 조회 중...")

    const result = await readGitHubFile("data/company.json")

    if (!result) {
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

    console.log("✅ 회사 정보 조회 성공:", result.content.name)
    return result.content
  } catch (error) {
    console.error("💥 회사 정보 조회 실패:", error)
    throw new Error(`회사 정보 조회 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`)
  }
}

export async function updateCompanyData(
  data: Partial<CompanyData>,
): Promise<{ success: boolean; data?: CompanyData; error?: string }> {
  try {
    console.log("💾 GitHub에 회사 정보 업데이트 시작:", data)

    // 기존 데이터 읽기
    const existing = await readGitHubFile("data/company.json")

    const now = new Date()
    const updatedData = {
      ...(existing?.content || {}),
      ...data,
      updatedAt: now.toISOString(),
      createdAt: existing?.content?.createdAt || now.toISOString(),
    }

    // GitHub에 저장
    await writeGitHubFile("data/company.json", updatedData, existing?.sha)

    console.log("✅ 회사 정보 업데이트 성공:", updatedData.name)

    return {
      success: true,
      data: updatedData,
    }
  } catch (error) {
    console.error("💥 회사 정보 업데이트 실패:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

export async function getInquiriesData(): Promise<InquiryData[]> {
  try {
    console.log("🔍 GitHub에서 문의 목록 조회 중...")

    const result = await readGitHubFile("data/inquiries.json")

    if (!result) {
      console.log("📝 문의 목록이 없음")
      return []
    }

    const inquiries = Array.isArray(result.content) ? result.content : []
    console.log(`✅ 문의 ${inquiries.length}건 조회 성공`)
    return inquiries
  } catch (error) {
    console.error("💥 문의 조회 실패:", error)
    return []
  }
}

export async function getPropertiesData(): Promise<PropertyData[]> {
  try {
    console.log("🔍 GitHub에서 부동산 목록 조회 중...")

    const result = await readGitHubFile("data/properties.json")

    if (!result) {
      console.log("📝 부동산 목록이 없음")
      return []
    }

    const properties = Array.isArray(result.content) ? result.content : []
    console.log(`✅ 부동산 ${properties.length}건 조회 성공`)
    return properties
  } catch (error) {
    console.error("💥 부동산 조회 실패:", error)
    return []
  }
}

// 문의 추가 함수
export async function addInquiry(
  inquiry: Omit<InquiryData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await readGitHubFile("data/inquiries.json")
    const inquiries = existing?.content || []

    const newInquiry = {
      ...inquiry,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    inquiries.unshift(newInquiry)

    await writeGitHubFile("data/inquiries.json", inquiries, existing?.sha)

    return { success: true }
  } catch (error) {
    console.error("💥 문의 추가 실패:", error)
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

// 부동산 추가 함수
export async function addProperty(
  property: Omit<PropertyData, "id" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await readGitHubFile("data/properties.json")
    const properties = existing?.content || []

    const newProperty = {
      ...property,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    properties.unshift(newProperty)

    await writeGitHubFile("data/properties.json", properties, existing?.sha)

    return { success: true }
  } catch (error) {
    console.error("💥 부동산 추가 실패:", error)
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}
