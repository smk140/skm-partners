import fs from "fs"
import path from "path"
import { commitFileToGitHub } from "./github"

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
      console.log("📁 Data directory created:", DATA_DIR)
    }
  } catch (error) {
    console.error("💥 데이터 디렉토리 생성 실패:", error)
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

    // 운영 시간
    business_hours: {
      weekday: "평일 09:00 - 18:00",
      weekend: "토요일 09:00 - 15:00",
      holiday: "일요일 및 공휴일 휴무",
      emergency: "긴급상황 시 24시간 대응",
    },

    // 소셜 미디어
    social_media: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      blog: "",
    },

    // 구글 맵 정보
    map_info: {
      latitude: "37.4969958",
      longitude: "127.0282918",
      zoom_level: "16",
      map_embed_url: "",
    },

    // 주요 서비스
    main_services: ["건물 종합 관리", "청소 서비스", "소방 점검", "엘리베이터 관리", "공실 임대 대행", "부동산 컨설팅"],

    // 인증 및 자격
    certifications: ["건물관리업 등록", "청소업 신고", "소방시설관리업 등록"],

    // 사이트 이미지
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
      console.log(`📄 Default file created: ${filePath}`)
    }
  } catch (error) {
    console.error(`💥 파일 생성 실패 (${filePath}):`, error)
  }
}

// 초기화 함수
function initializeFiles() {
  ensureDataDirectory()
  ensureFileExists(COMPANY_FILE, DEFAULT_COMPANY_DATA)
  ensureFileExists(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
  ensureFileExists(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
}

// 파일 읽기 함수
function readJsonFile(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`📄 File not found, creating default: ${filePath}`)
      ensureFileExists(filePath, defaultData)
      return defaultData
    }

    const data = fs.readFileSync(filePath, "utf8")

    if (!data.trim()) {
      console.log(`📄 Empty file, using default: ${filePath}`)
      return defaultData
    }

    const parsed = JSON.parse(data)
    console.log(`✅ Successfully read file: ${filePath}`)
    console.log(`📊 Data size: ${JSON.stringify(parsed).length} characters`)

    return parsed
  } catch (error) {
    console.error(`💥 파일 읽기 실패 (${filePath}):`, error)
    console.log(`🔄 Using default data for: ${filePath}`)
    return defaultData
  }
}

// 파일 쓰기 함수
function writeJsonFile(filePath: string, data: any, commitMessage: string) {
  try {
    // 데이터 검증
    if (!data) {
      console.error(`❌ Invalid data for ${filePath}`)
      return false
    }

    const jsonData = JSON.stringify(data, null, 2)

    // 파일 크기 체크 (10MB 제한)
    if (jsonData.length > 10 * 1024 * 1024) {
      console.error(`❌ File too large: ${jsonData.length} bytes`)
      return false
    }

    // 백업 생성
    if (fs.existsSync(filePath)) {
      const backupPath = `${filePath}.backup`
      fs.copyFileSync(filePath, backupPath)
      console.log(`💾 Backup created: ${backupPath}`)
    }

    fs.writeFileSync(filePath, jsonData, "utf8")
    console.log(`✅ Successfully wrote file: ${filePath}`)
    console.log(`📊 File size: ${jsonData.length} characters`)

    // 파일 검증
    const verification = fs.readFileSync(filePath, "utf8")
    if (verification !== jsonData) {
      console.error(`❌ File verification failed: ${filePath}`)
      return false
    }

    // GitHub에 커밋 (비동기로 실행, 실패해도 메인 기능에 영향 없음)
    const relativePath = path.relative(process.cwd(), filePath)
    commitFileToGitHub(relativePath, jsonData, commitMessage).catch((error) =>
      console.error("💥 GitHub 커밋 실패:", error),
    )

    return true
  } catch (error) {
    console.error(`💥 파일 쓰기 실패 (${filePath}):`, error)

    // 백업에서 복구 시도
    const backupPath = `${filePath}.backup`
    if (fs.existsSync(backupPath)) {
      try {
        fs.copyFileSync(backupPath, filePath)
        console.log(`🔄 Restored from backup: ${filePath}`)
      } catch (restoreError) {
        console.error(`💥 Backup restore failed: ${restoreError}`)
      }
    }

    return false
  }
}

// 초기화 실행
initializeFiles()

// 회사 정보 관련 함수
export function getCompanyData() {
  return readJsonFile(COMPANY_FILE, DEFAULT_COMPANY_DATA)
}

export function saveCompanyData(data: any) {
  return writeJsonFile(COMPANY_FILE, data, "회사 정보 업데이트")
}

// 부동산 매물 관련 함수
export function getPropertiesData() {
  const data = readJsonFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
  console.log(`📊 Properties loaded: ${data.properties?.length || 0} items`)
  return data
}

export function savePropertiesData(data: any) {
  data.last_updated = new Date().toISOString()
  console.log(`💾 Saving properties: ${data.properties?.length || 0} items`)
  return writeJsonFile(PROPERTIES_FILE, data, "부동산 매물 정보 업데이트")
}

// 문의 관련 함수
export function getInquiriesData() {
  const data = readJsonFile(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
  console.log(`📊 Inquiries loaded: ${data.inquiries?.length || 0} items`)
  return data
}

export function saveInquiriesData(data: any) {
  data.last_updated = new Date().toISOString()
  console.log(`💾 Saving inquiries: ${data.inquiries?.length || 0} items`)
  return writeJsonFile(INQUIRIES_FILE, data, "문의 정보 업데이트")
}

// ID 생성 함수
export function generateId(items: any[]) {
  if (!items || items.length === 0) return 1
  const maxId = Math.max(...items.map((item) => item.id || 0))
  const newId = maxId + 1
  console.log(`🆔 Generated new ID: ${newId}`)
  return newId
}
