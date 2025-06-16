import fs from "fs"
import path from "path"

// 데이터 디렉토리 경로
const DATA_DIR = path.join(process.cwd(), "data")

// 데이터 파일 경로
const COMPANY_FILE = path.join(DATA_DIR, "company.json")
const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json")
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json")
const IMAGES_FILE = path.join(DATA_DIR, "images.json") // 이미지 저장용 파일 추가

// 기본 데이터 구조
const DEFAULT_PROPERTIES_DATA = {
  properties: [],
  last_updated: new Date().toISOString(),
  version: "1.0",
}

const DEFAULT_COMPANY_DATA = {
  info: {
    name: "SKM파트너스",
    slogan: "공실률 ZERO를 위한 스마트 건물 관리 솔루션",
    address: "서울특별시 강남구 테헤란로 123, 4층",
    phone: "02-123-4567",
    email: "bykim@skm.kr",
    website: "https://skm.kr",
    description:
      "SKM파트너스는 건물 관리와 부동산 임대 대행 전문 기업으로, 고객의 자산 가치를 높이는 최고의 파트너입니다.",
    established_year: "2020",
    employee_count: "15명",
    service_area: "서울, 경기, 인천",
    logo_url: "",
    business_hours: {
      weekday: "평일 09:00 - 18:00",
      weekend: "토요일 09:00 - 15:00",
      holiday: "일요일 및 공휴일 휴무",
      emergency: "긴급상황 시 24시간 대응",
    },
    social_media: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      blog: "",
    },
    map_info: {
      latitude: "37.4969958",
      longitude: "127.0282918",
      zoom_level: "16",
      map_embed_url: "",
    },
    main_services: ["건물 종합 관리", "청소 서비스", "소방 점검", "엘리베이터 관리", "공실 임대 대행", "부동산 컨설팅"],
    certifications: ["건물관리업 등록", "청소업 신고", "소방시설관리업 등록"],
    site_images: {
      hero_main: "", // 메인 페이지 히어로 이미지
      hero_about: "", // 회사소개 페이지 히어로 이미지
      hero_services: "", // 서비스 페이지 히어로 이미지
      hero_contact: "", // 연락처 페이지 히어로 이미지
      company_building: "", // 회사 건물 외관
      team_photo: "", // 팀 단체 사진
      office_interior: "", // 사무실 내부
      service_showcase: "", // 서비스 쇼케이스 이미지
    },
  },
  executives: [],
  successCases: [],
}

const DEFAULT_INQUIRIES_DATA = {
  inquiries: [],
  last_updated: new Date().toISOString(),
}

// 이미지 저장용 기본 데이터
const DEFAULT_IMAGES_DATA = {
  images: {},
  last_updated: new Date().toISOString(),
}

// 디렉토리 생성
function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
      console.log(`[FileDB] 📁 데이터 디렉토리 생성: ${DATA_DIR}`)
    }
  } catch (error) {
    console.error(`[FileDB] 💥 디렉토리 생성 실패:`, error)
  }
}

// 파일 초기화
function initializeFile(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      const jsonData = JSON.stringify(defaultData, null, 2)
      fs.writeFileSync(filePath, jsonData, "utf8")
      console.log(`[FileDB] 📄 파일 초기화: ${path.basename(filePath)}`)
    }
  } catch (error) {
    console.error(`[FileDB] 💥 파일 초기화 실패 ${path.basename(filePath)}:`, error)
  }
}

// 초기화 실행
function initialize() {
  ensureDataDirectory()
  initializeFile(COMPANY_FILE, DEFAULT_COMPANY_DATA)
  initializeFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
  initializeFile(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
  initializeFile(IMAGES_FILE, DEFAULT_IMAGES_DATA) // 이미지 파일 초기화 추가
}

// 초기화 실행
initialize()

// 안전한 JSON 파싱
function safeJsonParse(content: string, defaultValue: any) {
  try {
    const parsed = JSON.parse(content)
    return parsed
  } catch (error) {
    console.error("[FileDB] 💥 JSON 파싱 실패:", error)
    return defaultValue
  }
}

// 이미지 관련 함수들 추가
export function saveImageData(imageId: string, base64Data: string, metadata: any = {}) {
  console.log(`[FileDB] 💾 이미지 저장 시작: ${imageId}`)
  console.log(`[FileDB] 💾 Base64 데이터 길이: ${base64Data.length}`)
  console.log(`[FileDB] 💾 메타데이터:`, metadata)

  try {
    // 데이터 디렉토리 확인
    if (!fs.existsSync(DATA_DIR)) {
      console.log(`[FileDB] 📁 데이터 디렉토리 생성: ${DATA_DIR}`)
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    let imagesData = DEFAULT_IMAGES_DATA

    if (fs.existsSync(IMAGES_FILE)) {
      const content = fs.readFileSync(IMAGES_FILE, "utf8")
      if (content.trim()) {
        imagesData = safeJsonParse(content, DEFAULT_IMAGES_DATA)
      }
    }

    // 이미지 데이터 저장
    imagesData.images[imageId] = {
      data: base64Data,
      metadata: {
        ...metadata,
        created_at: new Date().toISOString(),
        size: base64Data.length,
      },
    }
    imagesData.last_updated = new Date().toISOString()

    const jsonData = JSON.stringify(imagesData, null, 2)

    console.log(`[FileDB] 💾 JSON 데이터 크기: ${jsonData.length}`)
    console.log(`[FileDB] 💾 이미지 파일 경로: ${IMAGES_FILE}`)

    fs.writeFileSync(IMAGES_FILE, jsonData, "utf8")

    // 저장 검증
    if (fs.existsSync(IMAGES_FILE)) {
      const verifyContent = fs.readFileSync(IMAGES_FILE, "utf8")
      const verifyData = safeJsonParse(verifyContent, {})

      if (verifyData.images && verifyData.images[imageId]) {
        console.log(`[FileDB] ✅ 이미지 저장 및 검증 성공: ${imageId}`)
        return true
      } else {
        console.error(`[FileDB] 💥 저장 검증 실패: 이미지가 저장되지 않음`)
        return false
      }
    } else {
      console.error(`[FileDB] 💥 이미지 파일이 생성되지 않음`)
      return false
    }
  } catch (error) {
    console.error(`[FileDB] 💥 이미지 저장 실패:`, error)
    console.error(`[FileDB] 💥 오류 스택:`, error.stack)
    return false
  }
}

export function getImageData(imageId: string) {
  console.log(`[FileDB] 📖 이미지 읽기: ${imageId}`)
  try {
    if (!fs.existsSync(IMAGES_FILE)) {
      console.log(`[FileDB] ⚠️ 이미지 파일 없음`)
      return null
    }

    const content = fs.readFileSync(IMAGES_FILE, "utf8")
    if (!content.trim()) {
      console.log(`[FileDB] ⚠️ 빈 이미지 파일`)
      return null
    }

    const imagesData = safeJsonParse(content, DEFAULT_IMAGES_DATA)
    const imageInfo = imagesData.images[imageId]

    if (!imageInfo) {
      console.log(`[FileDB] ⚠️ 이미지 없음: ${imageId}`)
      return null
    }

    console.log(`[FileDB] ✅ 이미지 읽기 성공: ${imageId}`)
    return imageInfo
  } catch (error) {
    console.error(`[FileDB] 💥 이미지 읽기 실패:`, error)
    return null
  }
}

export function deleteImageData(imageId: string) {
  console.log(`[FileDB] 🗑️ 이미지 삭제: ${imageId}`)
  try {
    if (!fs.existsSync(IMAGES_FILE)) {
      return true
    }

    const content = fs.readFileSync(IMAGES_FILE, "utf8")
    if (!content.trim()) {
      return true
    }

    const imagesData = safeJsonParse(content, DEFAULT_IMAGES_DATA)

    if (imagesData.images[imageId]) {
      delete imagesData.images[imageId]
      imagesData.last_updated = new Date().toISOString()

      const jsonData = JSON.stringify(imagesData, null, 2)
      fs.writeFileSync(IMAGES_FILE, jsonData, "utf8")

      console.log(`[FileDB] ✅ 이미지 삭제 성공: ${imageId}`)
    }

    return true
  } catch (error) {
    console.error(`[FileDB] 💥 이미지 삭제 실패:`, error)
    return false
  }
}

// 부동산 매물 관련 함수
export function getPropertiesData() {
  console.log(`[FileDB] 📖 매물 데이터 읽기 시작`)
  try {
    // 파일 존재 확인
    if (!fs.existsSync(PROPERTIES_FILE)) {
      console.log(`[FileDB] ⚠️ 매물 파일 없음, 초기화`)
      initializeFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
      return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
    }

    // 파일 읽기
    const fileContent = fs.readFileSync(PROPERTIES_FILE, "utf8")

    // 빈 파일 체크
    if (!fileContent.trim()) {
      console.log(`[FileDB] ⚠️ 빈 매물 파일, 기본값 사용`)
      const defaultData = JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
      // 빈 파일을 기본값으로 덮어쓰기
      fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(defaultData, null, 2), "utf8")
      return defaultData
    }

    // JSON 파싱
    const data = safeJsonParse(fileContent, DEFAULT_PROPERTIES_DATA)

    // 데이터 구조 검증
    if (!data || typeof data !== "object") {
      console.log(`[FileDB] ⚠️ 잘못된 데이터 구조, 기본값 사용`)
      return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
    }

    // properties 배열 검증
    if (!Array.isArray(data.properties)) {
      console.log(`[FileDB] ⚠️ properties가 배열이 아님, 수정`)
      data.properties = []
    }

    console.log(`[FileDB] ✅ 매물 데이터 읽기 성공. 매물 수: ${data.properties.length}`)
    return data
  } catch (error) {
    console.error(`[FileDB] 💥 매물 데이터 읽기 실패:`, error)
    return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
  }
}

export function savePropertiesData(dataToSave: any) {
  console.log(`[FileDB] 💾 매물 데이터 저장 시작`)

  // 데이터 검증
  if (!dataToSave || typeof dataToSave !== "object") {
    console.error("[FileDB] ❌ 잘못된 데이터 타입")
    return false
  }

  if (!Array.isArray(dataToSave.properties)) {
    console.error("[FileDB] ❌ properties가 배열이 아님")
    return false
  }

  console.log(`[FileDB] 💾 저장할 매물 수: ${dataToSave.properties.length}`)

  try {
    // 타임스탬프 추가
    const dataWithTimestamp = {
      ...dataToSave,
      last_updated: new Date().toISOString(),
      version: "1.0",
    }

    const jsonData = JSON.stringify(dataWithTimestamp, null, 2)

    // 백업 생성
    const backupPath = `${PROPERTIES_FILE}.backup.${Date.now()}`
    if (fs.existsSync(PROPERTIES_FILE)) {
      try {
        fs.copyFileSync(PROPERTIES_FILE, backupPath)
        console.log(`[FileDB] 📋 백업 생성: ${path.basename(backupPath)}`)
      } catch (backupError) {
        console.warn(`[FileDB] ⚠️ 백업 생성 실패:`, backupError)
      }
    }

    // 파일 쓰기
    fs.writeFileSync(PROPERTIES_FILE, jsonData, "utf8")
    console.log(`[FileDB] ✅ 매물 데이터 저장 완료`)

    // 저장 검증
    const verification = fs.readFileSync(PROPERTIES_FILE, "utf8")
    const verifiedData = safeJsonParse(verification, null)

    if (!verifiedData || !Array.isArray(verifiedData.properties)) {
      console.error(`[FileDB] 💥 저장 검증 실패 - 데이터 구조 오류`)
      return false
    }

    if (verifiedData.properties.length !== dataWithTimestamp.properties.length) {
      console.error(`[FileDB] 💥 저장 검증 실패 - 매물 수 불일치`)
      console.error(`[FileDB] 예상: ${dataWithTimestamp.properties.length}, 실제: ${verifiedData.properties.length}`)
      return false
    }

    console.log(`[FileDB] ✅ 저장 검증 완료 - 매물 수: ${verifiedData.properties.length}`)

    // 오래된 백업 파일 정리 (최근 5개만 유지)
    try {
      const backupFiles = fs
        .readdirSync(DATA_DIR)
        .filter((file) => file.startsWith("properties.json.backup."))
        .sort()
        .reverse()

      if (backupFiles.length > 5) {
        const filesToDelete = backupFiles.slice(5)
        filesToDelete.forEach((file) => {
          try {
            fs.unlinkSync(path.join(DATA_DIR, file))
          } catch (deleteError) {
            console.warn(`[FileDB] ⚠️ 백업 파일 삭제 실패: ${file}`)
          }
        })
      }
    } catch (cleanupError) {
      console.warn(`[FileDB] ⚠️ 백업 파일 정리 실패:`, cleanupError)
    }

    return true
  } catch (error) {
    console.error(`[FileDB] 💥 매물 데이터 저장 실패:`, error)

    // 백업에서 복원 시도
    try {
      const backupFiles = fs
        .readdirSync(DATA_DIR)
        .filter((file) => file.startsWith("properties.json.backup."))
        .sort()
        .reverse()

      if (backupFiles.length > 0) {
        const latestBackup = path.join(DATA_DIR, backupFiles[0])
        fs.copyFileSync(latestBackup, PROPERTIES_FILE)
        console.log(`[FileDB] 🔄 백업에서 복원 완료: ${backupFiles[0]}`)
      }
    } catch (restoreError) {
      console.error(`[FileDB] 💥 백업 복원 실패:`, restoreError)
    }

    return false
  }
}

// 회사 정보 관련 함수
export function getCompanyData() {
  console.log(`[FileDB] 📖 회사 데이터 읽기`)
  try {
    if (!fs.existsSync(COMPANY_FILE)) {
      initializeFile(COMPANY_FILE, DEFAULT_COMPANY_DATA)
      return JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
    }

    const content = fs.readFileSync(COMPANY_FILE, "utf8")
    if (!content.trim()) {
      return JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
    }

    const data = safeJsonParse(content, DEFAULT_COMPANY_DATA)
    console.log(`[FileDB] ✅ 회사 데이터 읽기 성공`)
    return data
  } catch (error) {
    console.error(`[FileDB] 💥 회사 데이터 읽기 실패:`, error)
    return JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
  }
}

export function saveCompanyData(data: any) {
  console.log(`[FileDB] 💾 회사 데이터 저장`)
  try {
    if (!data) {
      console.error(`[FileDB] ❌ 잘못된 회사 데이터`)
      return false
    }

    const jsonData = JSON.stringify(data, null, 2)

    // 백업 생성
    const backupPath = `${COMPANY_FILE}.backup`
    if (fs.existsSync(COMPANY_FILE)) {
      fs.copyFileSync(COMPANY_FILE, backupPath)
    }

    fs.writeFileSync(COMPANY_FILE, jsonData, "utf8")
    console.log(`[FileDB] ✅ 회사 데이터 저장 성공`)
    return true
  } catch (error) {
    console.error(`[FileDB] 💥 회사 데이터 저장 실패:`, error)
    return false
  }
}

// 문의 관련 함수
export function getInquiriesData() {
  console.log(`[FileDB] 📖 문의 데이터 읽기`)
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      initializeFile(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
      return JSON.parse(JSON.stringify(DEFAULT_INQUIRIES_DATA))
    }

    const content = fs.readFileSync(INQUIRIES_FILE, "utf8")
    if (!content.trim()) {
      return JSON.parse(JSON.stringify(DEFAULT_INQUIRIES_DATA))
    }

    return safeJsonParse(content, DEFAULT_INQUIRIES_DATA)
  } catch (error) {
    console.error(`[FileDB] 💥 문의 데이터 읽기 실패:`, error)
    return JSON.parse(JSON.stringify(DEFAULT_INQUIRIES_DATA))
  }
}

export function saveInquiriesData(data: any) {
  console.log(`[FileDB] 💾 문의 데이터 저장`)
  try {
    if (!data) {
      console.error(`[FileDB] ❌ 잘못된 문의 데이터`)
      return false
    }

    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(INQUIRIES_FILE, jsonData, "utf8")
    console.log(`[FileDB] ✅ 문의 데이터 저장 성공`)
    return true
  } catch (error) {
    console.error(`[FileDB] 💥 문의 데이터 저장 실패:`, error)
    return false
  }
}

// ID 생성 함수
export function generateId(items: any[]) {
  if (!Array.isArray(items) || items.length === 0) {
    console.log(`[FileDB] 🆔 첫 번째 ID 생성: 1`)
    return 1
  }

  const ids = items.map((item) => {
    const id = Number(item.id)
    return isNaN(id) ? 0 : id
  })

  const maxId = Math.max(0, ...ids)
  const newId = maxId + 1
  console.log(`[FileDB] 🆔 새 ID 생성: ${newId} (기존 최대 ID: ${maxId})`)
  return newId
}
