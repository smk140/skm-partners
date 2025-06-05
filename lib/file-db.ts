import fs from "fs"
import path from "path"
// import { commitFileToGitHub } from "./github" // GitHub 연동 일시 비활성화

// 데이터 디렉토리 경로
const DATA_DIR = path.join(process.cwd(), "data")

// 데이터 파일 경로
const COMPANY_FILE = path.join(DATA_DIR, "company.json")
const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json")
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json")

// 디렉토리 생성
function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
      console.log(`[FileDB] Data directory created: ${DATA_DIR}`)
    }
  } catch (error) {
    console.error(`[FileDB] Error creating data directory ${DATA_DIR}:`, error)
  }
}

// 확장된 기본 데이터 구조
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
      hero_image: "",
      about_hero: "",
      services_hero: "",
      contact_hero: "",
      team_photo: "",
    },
  },
  executives: [],
  successCases: [],
}

const DEFAULT_PROPERTIES_DATA = {
  properties: [],
  last_updated: new Date().toISOString(),
}

const DEFAULT_INQUIRIES_DATA = {
  inquiries: [],
  last_updated: new Date().toISOString(),
}

// 파일 존재 확인 및 생성
function ensureFileExists(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      const jsonData = JSON.stringify(defaultData, null, 2)
      fs.writeFileSync(filePath, jsonData, "utf8")
      console.log(`[FileDB] Initialized file: ${filePath}`)
    }
  } catch (error) {
    console.error(`[FileDB] Error initializing file ${filePath}:`, error)
  }
}

// 파일 초기화 함수 (존재하지 않을 경우)
function initializeFile(filePath: string, defaultData: any) {
  ensureFileExists(filePath, defaultData)
}

// 초기화 함수
function initializeFiles() {
  ensureDataDirectory()
  initializeFile(COMPANY_FILE, DEFAULT_COMPANY_DATA)
  initializeFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
  initializeFile(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
}

// 파일 읽기 함수
function readJsonFile(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`📄 File not found, creating default: ${filePath}`)
      ensureFileExists(filePath, defaultData)
      return JSON.parse(JSON.stringify(defaultData)) // 깊은 복사 반환
    }

    const fileContent = fs.readFileSync(filePath, "utf8")

    if (!fileContent.trim()) {
      console.log(`📄 Empty file, using default: ${filePath}`)
      return JSON.parse(JSON.stringify(defaultData)) // 깊은 복사 반환
    }

    const parsed = JSON.parse(fileContent)
    console.log(`✅ Successfully read file: ${filePath}`)
    return parsed
  } catch (error) {
    console.error(`💥 파일 읽기 실패 (${filePath}):`, error)
    console.log(`🔄 Using default data for: ${filePath}`)
    return JSON.parse(JSON.stringify(defaultData)) // 깊은 복사 반환
  }
}

// 파일 쓰기 함수
function writeJsonFile(filePath: string, data: any, commitMessage: string) {
  try {
    if (!data) {
      console.error(`❌ Invalid data for ${filePath}. Aborting write.`)
      return false
    }

    const jsonData = JSON.stringify(data, null, 2)

    // 파일 크기 체크 (5MB 제한)
    if (jsonData.length > 5 * 1024 * 1024) {
      console.error(`❌ File too large for ${filePath}: ${jsonData.length} bytes. Max 5MB. Aborting write.`)
      return false
    }

    fs.writeFileSync(filePath, jsonData, "utf8")
    console.log(`✅ Successfully wrote file: ${filePath}`)

    // GitHub 연동 일시 비활성화
    // const relativePath = path.relative(process.cwd(), filePath)
    // commitFileToGitHub(relativePath, jsonData, commitMessage).catch((error) =>
    //   console.error("💥 GitHub 커밋 실패:", error),
    // )

    return true
  } catch (error) {
    console.error(`💥 파일 쓰기 실패 (${filePath}):`, error)
    return false
  }
}

// 초기화 실행
initializeFiles()

// 회사 정보 관련 함수
export function getCompanyData() {
  // Implement similar to getPropertiesData
  console.log(`[FileDB] Reading company data from ${COMPANY_FILE}`)
  try {
    const content = fs.readFileSync(COMPANY_FILE, "utf8")
    return JSON.parse(content)
  } catch (e) {
    console.error(`[FileDB] Error reading ${COMPANY_FILE}`, e)
    return DEFAULT_COMPANY_DATA
  }
}

export function saveCompanyData(data: any) {
  // Implement similar to savePropertiesData
  console.log(`[FileDB] Saving company data to ${COMPANY_FILE}`)
  try {
    fs.writeFileSync(COMPANY_FILE, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (e) {
    console.error(`[FileDB] Error saving ${COMPANY_FILE}`, e)
    return false
  }
}

// 부동산 매물 관련 함수
export function getPropertiesData() {
  console.log(`[FileDB] Attempting to read: ${PROPERTIES_FILE}`)
  try {
    if (!fs.existsSync(PROPERTIES_FILE)) {
      console.warn(`[FileDB] File not found: ${PROPERTIES_FILE}. Returning default data.`)
      initializeFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA) // Attempt to create if missing
      return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
    }

    const fileContent = fs.readFileSync(PROPERTIES_FILE, "utf8")
    if (!fileContent.trim()) {
      console.warn(`[FileDB] File is empty: ${PROPERTIES_FILE}. Returning default data.`)
      return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
    }

    const data = JSON.parse(fileContent)
    if (!Array.isArray(data.properties)) {
      console.warn(`[FileDB] 'properties' key is not an array in ${PROPERTIES_FILE}. Resetting.`)
      data.properties = []
    }
    console.log(`[FileDB] Successfully read ${PROPERTIES_FILE}. Properties count: ${data.properties.length}`)
    return data
  } catch (error) {
    console.error(`[FileDB] Error reading ${PROPERTIES_FILE}:`, error, "Returning default data.")
    return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
  }
}

export function savePropertiesData(dataToSave: any) {
  console.log(`[FileDB] Attempting to save to: ${PROPERTIES_FILE}`)
  if (!dataToSave || !Array.isArray(dataToSave.properties)) {
    console.error(
      "[FileDB] Invalid data provided to savePropertiesData. 'properties' must be an array. Aborting save.",
      dataToSave,
    )
    return false
  }

  const dataWithTimestamp = {
    ...dataToSave,
    properties: dataToSave.properties, // Ensure properties array is directly used
    last_updated: new Date().toISOString(),
  }

  try {
    const jsonData = JSON.stringify(dataWithTimestamp, null, 2)
    console.log(`[FileDB] Data to be written (first 500 chars): ${jsonData.substring(0, 500)}...`)

    // Create a backup
    const backupPath = `${PROPERTIES_FILE}.backup`
    if (fs.existsSync(PROPERTIES_FILE)) {
      fs.copyFileSync(PROPERTIES_FILE, backupPath)
      console.log(`[FileDB] Backup created: ${backupPath}`)
    }

    fs.writeFileSync(PROPERTIES_FILE, jsonData, "utf8")
    console.log(
      `[FileDB] Successfully wrote to ${PROPERTIES_FILE}. Properties count: ${dataWithTimestamp.properties.length}`,
    )

    // Verify write
    const writtenData = fs.readFileSync(PROPERTIES_FILE, "utf8")
    if (writtenData !== jsonData) {
      console.error(`[FileDB] CRITICAL: File write verification FAILED for ${PROPERTIES_FILE}. Data may be corrupted.`)
      // Attempt to restore from backup
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, PROPERTIES_FILE)
        console.error(`[FileDB] CRITICAL: Restored ${PROPERTIES_FILE} from backup due to write verification failure.`)
      }
      return false
    }
    console.log(`[FileDB] File write verified for ${PROPERTIES_FILE}.`)
    return true
  } catch (error) {
    console.error(`[FileDB] Error writing to ${PROPERTIES_FILE}:`, error)
    // Attempt to restore from backup on error
    const backupPath = `${PROPERTIES_FILE}.backup`
    if (fs.existsSync(backupPath)) {
      try {
        fs.copyFileSync(backupPath, PROPERTIES_FILE)
        console.warn(`[FileDB] Restored ${PROPERTIES_FILE} from backup due to write error.`)
      } catch (restoreError) {
        console.error(
          `[FileDB] CRITICAL: Failed to restore ${PROPERTIES_FILE} from backup after write error:`,
          restoreError,
        )
      }
    }
    return false
  }
}

// 문의 관련 함수
export function getInquiriesData() {
  console.log(`[FileDB] Reading inquiries data from ${INQUIRIES_FILE}`)
  try {
    const content = fs.readFileSync(INQUIRIES_FILE, "utf8")
    return JSON.parse(content)
  } catch (e) {
    console.error(`[FileDB] Error reading ${INQUIRIES_FILE}`, e)
    return DEFAULT_INQUIRIES_DATA
  }
}

export function saveInquiriesData(data: any) {
  console.log(`[FileDB] Saving inquiries data to ${INQUIRIES_FILE}`)
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (e) {
    console.error(`[FileDB] Error saving ${INQUIRIES_FILE}`, e)
    return false
  }
}

// ID 생성 함수
export function generateId(items: any[]) {
  if (!items || items.length === 0) {
    return 1
  }
  const maxId = Math.max(0, ...items.map((item) => Number(item.id) || 0))
  return maxId + 1
}
