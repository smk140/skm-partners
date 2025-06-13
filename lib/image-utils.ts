// 이미지 경로 생성 유틸리티
export function getImagePath(filename: string): string {
  return `/images/${filename}`
}

// 이미지 존재 여부 확인 (클라이언트 사이드)
export function checkImageExists(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

// 페이지별 이미지 매핑
export const PAGE_IMAGES = {
  // Hero 섹션 이미지들
  about_hero: getImagePath("1.jpg"),
  main_hero: getImagePath("2.jpg"),
  services_hero: getImagePath("3.jpg"),
  real_estate_hero: getImagePath("4.jpg"),
  contact_hero: getImagePath("5.jpg"),

  // 기타 섹션 이미지들
  about_team: getImagePath("6.jpg"),

  // 서비스 상세 이미지들
  building_management: getImagePath("7.jpg"),
  cleaning_service: getImagePath("8.jpg"),
  fire_inspection: getImagePath("9.jpg"),
  elevator_management: getImagePath("10.jpg"),
} as const

// 서비스별 이미지 매핑
export const SERVICE_IMAGES: Record<string, string> = {
  "building-management": PAGE_IMAGES.building_management,
  cleaning: PAGE_IMAGES.cleaning_service,
  "fire-safety": PAGE_IMAGES.fire_inspection,
  elevator: PAGE_IMAGES.elevator_management,
}
