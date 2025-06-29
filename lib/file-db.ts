interface CompanyData {
  logo: string
  heroImage: string
  aboutImage: string
  servicesHeroImage: string
  realEstateHeroImage: string
  contactHeroImage: string
  buildingManagementImage: string
  cleaningImage: string
  fireInspectionImage: string
  elevatorImage: string
  teamImage: string
  officeImage: string
  showcaseImage: string
}

interface RealEstateProperty {
  id: string
  title: string
  location: string
  price: string
  area: string
  type: string
  description: string
  imageUrl: string
  features: string[]
  contact: string
  createdAt: string
}

// 메모리 기반 데이터 저장소
let companyData: CompanyData = {
  logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
  aboutImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
  servicesHeroImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=400&fit=crop",
  realEstateHeroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop",
  contactHeroImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=400&fit=crop",
  buildingManagementImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
  cleaningImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
  fireInspectionImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
  elevatorImage: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=400&h=300&fit=crop",
  teamImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  officeImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop",
  showcaseImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
}

let realEstateProperties: RealEstateProperty[] = [
  {
    id: "1",
    title: "강남 프리미엄 오피스텔",
    location: "서울 강남구",
    price: "월 200만원",
    area: "45평",
    type: "오피스텔",
    description: "강남역 도보 5분 거리의 프리미엄 오피스텔입니다.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    features: ["주차가능", "엘리베이터", "보안시설"],
    contact: "02-1234-5678",
    createdAt: new Date().toISOString(),
  },
]

const inquiries: any[] = []
const logs: any[] = []

export async function getCompanyData(): Promise<CompanyData> {
  console.log("📊 getCompanyData 호출됨, 현재 데이터:", companyData)
  return { ...companyData }
}

export async function updateCompanyData(data: Partial<CompanyData>): Promise<void> {
  console.log("📝 updateCompanyData 호출됨")
  console.log("📝 기존 데이터:", companyData)
  console.log("📝 업데이트할 데이터:", data)

  companyData = { ...companyData, ...data }

  console.log("📝 업데이트 후 데이터:", companyData)
}

export async function getRealEstateProperties(): Promise<RealEstateProperty[]> {
  return [...realEstateProperties]
}

export async function addRealEstateProperty(property: Omit<RealEstateProperty, "id" | "createdAt">): Promise<void> {
  const newProperty: RealEstateProperty = {
    ...property,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  realEstateProperties.push(newProperty)
}

export async function updateRealEstateProperty(id: string, property: Partial<RealEstateProperty>): Promise<void> {
  const index = realEstateProperties.findIndex((p) => p.id === id)
  if (index !== -1) {
    realEstateProperties[index] = { ...realEstateProperties[index], ...property }
  }
}

export async function deleteRealEstateProperty(id: string): Promise<void> {
  realEstateProperties = realEstateProperties.filter((p) => p.id !== id)
}

export async function addInquiry(inquiry: any): Promise<void> {
  inquiries.push({
    ...inquiry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  })
}

export async function getInquiries(): Promise<any[]> {
  return [...inquiries]
}

export async function addLog(log: any): Promise<void> {
  logs.push({
    ...log,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  })
}

export async function getLogs(): Promise<any[]> {
  return [...logs]
}

// GitHub 관련 함수들 (더미 구현)
export async function testGitHubConnection(): Promise<{ success: boolean; message: string }> {
  return { success: true, message: "GitHub connection not used in this version" }
}

// 호환성을 위한 추가 함수들
export async function getCompanyInfo(): Promise<CompanyData> {
  return getCompanyData()
}

export async function updateCompanyInfo(
  data: Partial<CompanyData>,
): Promise<{ success: boolean; data?: CompanyData; error?: string }> {
  try {
    await updateCompanyData(data)
    const updatedData = await getCompanyData()
    return { success: true, data: updatedData }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getInquiriesData(): Promise<any[]> {
  return getInquiries()
}

export async function getPropertiesData(): Promise<RealEstateProperty[]> {
  return getRealEstateProperties()
}

export async function addProperty(
  property: Omit<RealEstateProperty, "id" | "createdAt">,
): Promise<{ success: boolean; error?: string }> {
  try {
    await addRealEstateProperty(property)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateProperty(
  id: string,
  property: Partial<RealEstateProperty>,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateRealEstateProperty(id, property)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteRealEstateProperty(id)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
