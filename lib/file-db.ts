// GitHub 파일 시스템을 사용한 데이터 관리
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

// GitHub API 클라이언트 초기화
function getGitHubClient() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error("GITHUB_TOKEN이 설정되지 않았습니다.")
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
  try {
    const res = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      ref: BRANCH,
    })
    if ("content" in res.data) {
      return {
        content: JSON.parse(Buffer.from(res.data.content, "base64").toString("utf8")),
        sha: res.data.sha,
      }
    }
    return null
  } catch (err: any) {
    // 파일이 없으면 404 → null, 그 외 에러는 그대로 throw
    if (err.status === 404) return null
    throw err
  }
}

// 파일 쓰기 함수
async function writeFileToGitHub(filePath: string, data: any, message: string, sha?: string): Promise<void> {
  const octokit = getGitHubClient()
  const encoded = Buffer.from(JSON.stringify(data, null, 2)).toString("base64")
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: filePath,
    message,
    content: encoded,
    branch: BRANCH,
    sha,
  })
}

// 회사 정보 관리
export async function getCompanyData(): Promise<CompanyData> {
  const result = await readFileFromGitHub("data/company.json")
  if (result) return result.content as CompanyData

  // 없으면 기본값 생성 후 즉시 저장
  const defaultData: CompanyData = {
    name: "SKM 파트너스",
    description: "전문적인 부동산·비즈니스 컨설팅 서비스를 제공합니다.",
    address: "서울특별시 강남구",
    phone: "02-1234-5678",
    email: "info@skm-partners.com",
    website: "https://skm-partners.com",
    logoUrl: "",
    heroImageUrl: "",
    aboutImageUrl: "",
  }
  await writeFileToGitHub("data/company.json", defaultData, "Create default company.json")
  return defaultData
}

export async function updateCompanyData(
  data: Partial<CompanyData>,
): Promise<{ success: boolean; data?: CompanyData; error?: string }> {
  try {
    const currentData = await getCompanyData()
    const updatedData = { ...currentData, ...data }

    await writeFileToGitHub("data/company.json", updatedData, "회사 정보 업데이트")

    return { success: true, data: updatedData }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

// 문의 관리
export async function getInquiriesData(): Promise<InquiryData[]> {
  const data = await readFileFromGitHub("data/inquiries.json")
  return data?.inquiries || []
}

export async function addInquiry(
  inquiry: Omit<InquiryData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const inquiries = await getInquiriesData()
    const newInquiry: InquiryData = {
      ...inquiry,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    inquiries.push(newInquiry)

    await writeFileToGitHub("data/inquiries.json", { inquiries }, "새 문의 추가")
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

// 부동산 관리
export async function getPropertiesData(): Promise<PropertyData[]> {
  const data = await readFileFromGitHub("data/properties.json")
  return data?.properties || []
}

export async function addProperty(
  property: Omit<PropertyData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const properties = await getPropertiesData()
    const newProperty: PropertyData = {
      ...property,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    properties.push(newProperty)

    await writeFileToGitHub("data/properties.json", { properties }, "새 부동산 추가")
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

// GitHub 연결 테스트
export async function testGitHubConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const octokit = getGitHubClient()
    await octokit.rest.repos.get({
      owner: REPO_OWNER,
      repo: REPO_NAME,
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "GitHub 연결 실패" }
  }
}
