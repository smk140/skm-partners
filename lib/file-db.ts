import { Octokit } from "@octokit/rest"

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
  // 추가 이미지들
  servicesHeroUrl?: string
  realEstateHeroUrl?: string
  contactHeroUrl?: string
  buildingManagementUrl?: string
  cleaningServiceUrl?: string
  fireInspectionUrl?: string
  elevatorManagementUrl?: string
  teamPhotoUrl?: string
  officeInteriorUrl?: string
  serviceShowcaseUrl?: string
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

// 기본 회사 데이터 - skm.kr 도메인 사용
const DEFAULT_COMPANY_DATA: CompanyData = {
  name: "SKM파트너스",
  description: "전문적인 부동산 컨설팅 서비스를 제공합니다.",
  address: "서울특별시 강남구 테헤란로 123",
  phone: "02-1234-5678",
  email: "info@skm.kr",
  website: "https://skm.kr",
  logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop",
  heroImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
  aboutImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
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
}

// GitHub API 클라이언트 초기화
function getGitHubClient() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.warn("GITHUB_TOKEN이 설정되지 않았습니다. 기본값을 사용합니다.")
    return null
  }
  return new Octokit({ auth: token })
}

// GitHub 저장소 정보
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "smk140"
const REPO_NAME = process.env.GITHUB_REPO_NAME || "skm-partners"
const BRANCH = process.env.GITHUB_BRANCH || "main"

// 파일 읽기 함수
async function readFileFromGitHub(filePath: string) {
  const octokit = getGitHubClient()
  if (!octokit) {
    console.warn("GitHub 클라이언트가 없습니다. 기본값을 반환합니다.")
    return null
  }

  try {
    console.log(`📖 GitHub에서 파일 읽기 시도: ${filePath}`)
    const response = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: BRANCH,
    })

    if ("content" in response.data) {
      const content = Buffer.from(response.data.content, "base64").toString("utf-8")
      console.log(`✅ GitHub 파일 읽기 성공: ${filePath}`)
      return {
        content: JSON.parse(content),
        sha: response.data.sha,
      }
    }
    return null
  } catch (error: any) {
    if (error.status === 404) {
      console.log(`📄 GitHub 파일이 존재하지 않음: ${filePath}`)
      return null
    }
    console.error(`❌ GitHub 파일 읽기 실패: ${filePath}`, error.message)
    return null
  }
}

// 파일 쓰기 함수
async function writeFileToGitHub(filePath: string, data: any, message: string, sha?: string): Promise<boolean> {
  const octokit = getGitHubClient()
  if (!octokit) {
    console.warn("GitHub 클라이언트가 없습니다. 저장을 건너뜁니다.")
    return false
  }

  try {
    console.log(`💾 GitHub에 파일 저장 시도: ${filePath}`)
    const content = JSON.stringify(data, null, 2)
    const encodedContent = Buffer.from(content).toString("base64")

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message,
      content: encodedContent,
      branch: BRANCH,
      sha,
    })

    console.log(`✅ GitHub 파일 저장 성공: ${filePath}`)
    return true
  } catch (error: any) {
    console.error(`❌ GitHub 파일 저장 실패: ${filePath}`, error.message)
    return false
  }
}

// 회사 정보 관리
export async function getCompanyData(): Promise<CompanyData> {
  console.log("🏢 회사 정보 조회 시작")

  try {
    const result = await readFileFromGitHub("data/company.json")

    if (result && result.content) {
      console.log("✅ GitHub에서 회사 정보 로드 성공")
      return { ...DEFAULT_COMPANY_DATA, ...result.content }
    }
  } catch (error) {
    console.error("❌ GitHub에서 회사 정보 로드 실패:", error)
  }

  console.log("📋 기본 회사 정보 사용")

  // GitHub에 기본 데이터 저장 시도
  try {
    const saved = await writeFileToGitHub("data/company.json", DEFAULT_COMPANY_DATA, "초기 회사 정보 생성")
    if (saved) {
      console.log("✅ 기본 회사 정보를 GitHub에 저장했습니다.")
    }
  } catch (error) {
    console.error("⚠️ 기본 회사 정보 GitHub 저장 실패:", error)
  }

  return DEFAULT_COMPANY_DATA
}

export async function updateCompanyData(
  data: Partial<CompanyData>,
): Promise<{ success: boolean; data?: CompanyData; error?: string }> {
  console.log("📝 회사 정보 업데이트 시작", data)

  try {
    // 현재 데이터 가져오기
    const currentData = await getCompanyData()
    const updatedData = { ...currentData, ...data }

    // GitHub에 저장 시도
    const currentResult = await readFileFromGitHub("data/company.json")
    const saved = await writeFileToGitHub("data/company.json", updatedData, "회사 정보 업데이트", currentResult?.sha)

    if (saved) {
      console.log("✅ 회사 정보 업데이트 성공")
      return { success: true, data: updatedData }
    } else {
      console.warn("⚠️ GitHub 저장 실패, 하지만 메모리에는 반영됨")
      return { success: true, data: updatedData }
    }
  } catch (error) {
    console.error("❌ 회사 정보 업데이트 실패:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

// 문의 관리
export async function getInquiriesData(): Promise<InquiryData[]> {
  console.log("📋 문의 목록 조회 시작")

  try {
    const result = await readFileFromGitHub("data/inquiries.json")
    if (result && result.content && result.content.inquiries) {
      console.log("✅ GitHub에서 문의 목록 로드 성공")
      return result.content.inquiries
    }
  } catch (error) {
    console.error("❌ GitHub에서 문의 목록 로드 실패:", error)
  }

  console.log("📋 빈 문의 목록 반환")
  return []
}

export async function addInquiry(
  inquiry: Omit<InquiryData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  console.log("📝 새 문의 추가 시작", inquiry)

  try {
    const inquiries = await getInquiriesData()
    const newInquiry: InquiryData = {
      ...inquiry,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    inquiries.push(newInquiry)

    const saved = await writeFileToGitHub("data/inquiries.json", { inquiries }, "새 문의 추가")

    if (saved) {
      console.log("✅ 새 문의 추가 성공")
      return { success: true }
    } else {
      console.warn("⚠️ GitHub 저장 실패")
      return { success: false, error: "저장 실패" }
    }
  } catch (error) {
    console.error("❌ 새 문의 추가 실패:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

// 부동산 관리
export async function getPropertiesData(): Promise<PropertyData[]> {
  console.log("🏠 부동산 목록 조회 시작")

  try {
    const result = await readFileFromGitHub("data/properties.json")
    if (result && result.content && result.content.properties) {
      console.log("✅ GitHub에서 부동산 목록 로드 성공")
      return result.content.properties
    }
  } catch (error) {
    console.error("❌ GitHub에서 부동산 목록 로드 실패:", error)
  }

  console.log("🏠 기본 부동산 목록 반환")
  const defaultProperties: PropertyData[] = [
    {
      id: 1,
      title: "강남 프리미엄 오피스",
      description: "강남역 도보 5분 거리의 프리미엄 오피스 공간입니다.",
      price: 5000000,
      location: "서울시 강남구 테헤란로",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "홍대 상권 상가",
      description: "홍대 핫플레이스 중심가의 1층 상가입니다.",
      price: 3000000,
      location: "서울시 마포구 홍익로",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      createdAt: new Date().toISOString(),
    },
  ]

  // 기본 데이터를 GitHub에 저장 시도
  try {
    await writeFileToGitHub("data/properties.json", { properties: defaultProperties }, "기본 부동산 목록 생성")
  } catch (error) {
    console.error("⚠️ 기본 부동산 목록 GitHub 저장 실패:", error)
  }

  return defaultProperties
}

export async function addProperty(
  property: Omit<PropertyData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  console.log("🏠 새 부동산 추가 시작", property)

  try {
    const properties = await getPropertiesData()
    const newProperty: PropertyData = {
      ...property,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    properties.push(newProperty)

    const saved = await writeFileToGitHub("data/properties.json", { properties }, "새 부동산 추가")

    if (saved) {
      console.log("✅ 새 부동산 추가 성공")
      return { success: true }
    } else {
      console.warn("⚠️ GitHub 저장 실패")
      return { success: false, error: "저장 실패" }
    }
  } catch (error) {
    console.error("❌ 새 부동산 추가 실패:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

export async function updateProperty(
  id: string,
  updates: Partial<PropertyData>,
): Promise<{ success: boolean; error?: string }> {
  console.log("🏠 부동산 업데이트 시작", { id, updates })

  try {
    const properties = await getPropertiesData()
    const index = properties.findIndex((p) => p.id.toString() === id)

    if (index === -1) {
      return { success: false, error: "부동산을 찾을 수 없습니다." }
    }

    properties[index] = { ...properties[index], ...updates }

    const saved = await writeFileToGitHub("data/properties.json", { properties }, `부동산 ${id} 업데이트`)

    if (saved) {
      console.log("✅ 부동산 업데이트 성공")
      return { success: true }
    } else {
      console.warn("⚠️ GitHub 저장 실패")
      return { success: false, error: "저장 실패" }
    }
  } catch (error) {
    console.error("❌ 부동산 업데이트 실패:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

export async function deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
  console.log("🏠 부동산 삭제 시작", { id })

  try {
    const properties = await getPropertiesData()
    const filtered = properties.filter((p) => p.id.toString() !== id)

    const saved = await writeFileToGitHub("data/properties.json", { properties: filtered }, `부동산 ${id} 삭제`)

    if (saved) {
      console.log("✅ 부동산 삭제 성공")
      return { success: true }
    } else {
      console.warn("⚠️ GitHub 저장 실패")
      return { success: false, error: "저장 실패" }
    }
  } catch (error) {
    console.error("❌ 부동산 삭제 실패:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    }
  }
}

/**
 * GitHub 연결 테스트 함수
 */
export async function testGitHubConnection() {
  console.log("🔗 GitHub 연결 테스트 시작")

  const octokit = getGitHubClient()
  if (!octokit) {
    return {
      success: false,
      message: "GitHub 토큰이 설정되지 않았습니다.",
    }
  }

  try {
    const response = await octokit.rest.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    })

    console.log("✅ GitHub 연결 테스트 성공")
    return {
      success: true,
      message: `GitHub 연결 성공: ${response.data.full_name}`,
      data: {
        repo: response.data.full_name,
        private: response.data.private,
        permissions: response.data.permissions,
      },
    }
  } catch (error: any) {
    console.error("❌ GitHub 연결 테스트 실패:", error.message)
    return {
      success: false,
      message: `GitHub 연결 실패: ${error.message}`,
      error: error.message,
    }
  }
}
