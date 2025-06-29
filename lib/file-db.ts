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

// 메모리 기반 데이터 저장소
let companyData: CompanyData = {
  name: "SKM 파트너스",
  description: "전문적인 부동산 컨설팅 서비스를 제공합니다.",
  address: "서울특별시 강남구",
  phone: "02-1234-5678",
  email: "info@skm-partners.com",
  website: "https://skm-partners.com",
  logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop",
  heroImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop",
  aboutImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop",
  servicesHeroUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop",
  realEstateHeroUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=400&fit=crop",
  contactHeroUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=400&fit=crop",
  buildingManagementUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  cleaningServiceUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
  fireInspectionUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
  elevatorManagementUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
  teamPhotoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
  officeInteriorUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop",
  serviceShowcaseUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=500&fit=crop",
}

const inquiriesData: InquiryData[] = []

const propertiesData: PropertyData[] = [
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
  {
    id: 3,
    title: "판교 IT 오피스텔",
    description: "판교 테크노밸리 인근의 신축 오피스텔입니다.",
    price: 2000000,
    location: "경기도 성남시 분당구 판교역로",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    createdAt: new Date().toISOString(),
  },
]

// 회사 정보 관리
export async function getCompanyData(): Promise<CompanyData> {
  return companyData
}

export async function updateCompanyData(
  data: Partial<CompanyData>,
): Promise<{ success: boolean; data?: CompanyData; error?: string }> {
  try {
    companyData = { ...companyData, ...data }
    return { success: true, data: companyData }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

// 문의 관리
export async function getInquiriesData(): Promise<InquiryData[]> {
  return inquiriesData
}

export async function addInquiry(
  inquiry: Omit<InquiryData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const newInquiry: InquiryData = {
      ...inquiry,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    inquiriesData.push(newInquiry)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

// 부동산 관리
export async function getPropertiesData(): Promise<PropertyData[]> {
  return propertiesData
}

export async function addProperty(
  property: Omit<PropertyData, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  try {
    const newProperty: PropertyData = {
      ...property,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
    propertiesData.push(newProperty)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

export async function updateProperty(
  id: string,
  updates: Partial<PropertyData>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const index = propertiesData.findIndex((p) => p.id.toString() === id)
    if (index === -1) {
      return { success: false, error: "부동산을 찾을 수 없습니다." }
    }
    propertiesData[index] = { ...propertiesData[index], ...updates }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

export async function deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const index = propertiesData.findIndex((p) => p.id.toString() === id)
    if (index === -1) {
      return { success: false, error: "부동산을 찾을 수 없습니다." }
    }
    propertiesData.splice(index, 1)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "알 수 없는 오류" }
  }
}

/**
 * (호환용) GitHub 디버그 라우트에서 예상하는 함수.
 * 현재 GitHub 업로드 기능을 사용하지 않으므로 항상 false 를 반환합니다.
 */
export async function testGitHubConnection() {
  return {
    success: false,
    message: "GitHub 연동이 비활성화되어 있습니다.",
  }
}
