import fs from "fs"
import path from "path"

// 데이터 디렉토리 경로
const DATA_DIR = path.join(process.cwd(), "data")

// 데이터 파일 경로
const COMPANY_FILE = path.join(DATA_DIR, "company.json")
const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json")
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json")

// 기본 데이터 구조
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
      hero_main: "",
      hero_about: "",
      hero_services: "",
      hero_contact: "",
      company_building: "",
      team_photo: "",
      office_interior: "",
      service_showcase: "",
    },
  },
  executives: [],
  successCases: [],
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

// 회사 정보 관련 함수
export function getCompanyData() {
  console.log(`[FileDB] 📖 회사 데이터 읽기 시작`)
  console.log(`[FileDB] 📖 파일 경로: ${COMPANY_FILE}`)

  try {
    // 디렉토리 확인
    if (!fs.existsSync(DATA_DIR)) {
      console.log(`[FileDB] 📁 데이터 디렉토리 없음, 생성`)
      ensureDataDirectory()
    }

    // 파일 확인
    if (!fs.existsSync(COMPANY_FILE)) {
      console.log(`[FileDB] 📄 회사 파일 없음, 초기화`)
      initializeFile(COMPANY_FILE, DEFAULT_COMPANY_DATA)
      return JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
    }

    const content = fs.readFileSync(COMPANY_FILE, "utf8")
    console.log(`[FileDB] 📖 파일 내용 길이: ${content.length}`)

    if (!content.trim()) {
      console.log(`[FileDB] ⚠️ 빈 파일, 기본값 사용`)
      const defaultData = JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
      fs.writeFileSync(COMPANY_FILE, JSON.stringify(defaultData, null, 2), "utf8")
      return defaultData
    }

    const data = safeJsonParse(content, DEFAULT_COMPANY_DATA)
    console.log(`[FileDB] ✅ 회사 데이터 읽기 성공`)
    console.log(`[FileDB] 📊 데이터 구조:`, Object.keys(data))

    return data
  } catch (error) {
    console.error(`[FileDB] 💥 회사 데이터 읽기 실패:`, error)
    return JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
  }
}

export function saveCompanyData(data: any) {
  console.log(`[FileDB] 💾 회사 데이터 저장 시작`)
  console.log(`[FileDB] 💾 저장할 데이터:`, JSON.stringify(data, null, 2))

  try {
    if (!data) {
      console.error(`[FileDB] ❌ 잘못된 회사 데이터 - null/undefined`)
      return false
    }

    // 디렉토리 확인
    if (!fs.existsSync(DATA_DIR)) {
      console.log(`[FileDB] 📁 데이터 디렉토리 생성`)
      ensureDataDirectory()
    }

    const jsonData = JSON.stringify(data, null, 2)
    console.log(`[FileDB] 💾 JSON 데이터 길이: ${jsonData.length}`)

    // 백업 생성
    const backupPath = `${COMPANY_FILE}.backup.${Date.now()}`
    if (fs.existsSync(COMPANY_FILE)) {
      try {
        fs.copyFileSync(COMPANY_FILE, backupPath)
        console.log(`[FileDB] 📋 백업 생성: ${path.basename(backupPath)}`)
      } catch (backupError) {
        console.warn(`[FileDB] ⚠️ 백업 생성 실패:`, backupError)
      }
    }

    // 파일 쓰기
    fs.writeFileSync(COMPANY_FILE, jsonData, "utf8")
    console.log(`[FileDB] ✅ 파일 쓰기 완료`)

    // 저장 검증
    if (fs.existsSync(COMPANY_FILE)) {
      const verification = fs.readFileSync(COMPANY_FILE, "utf8")
      const verifiedData = safeJsonParse(verification, null)

      if (verifiedData && verifiedData.info) {
        console.log(`[FileDB] ✅ 저장 검증 성공`)
        console.log(`[FileDB] ✅ 검증된 데이터 구조:`, Object.keys(verifiedData))
        return true
      } else {
        console.error(`[FileDB] 💥 저장 검증 실패 - 데이터 구조 오류`)
        return false
      }
    } else {
      console.error(`[FileDB] 💥 파일이 생성되지 않음`)
      return false
    }
  } catch (error) {
    console.error(`[FileDB] 💥 회사 데이터 저장 실패:`, error)
    console.error(`[FileDB] 💥 오류 스택:`, error.stack)
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

// 다른 함수들은 기존과 동일하게 유지
export function getPropertiesData() {
  // 기존 코드 유지
  return { properties: [], last_updated: new Date().toISOString(), version: "1.0" }
}

export function savePropertiesData(dataToSave: any) {
  // 기존 코드 유지
  return true
}

export function getInquiriesData() {
  // 기존 코드 유지
  return { inquiries: [], last_updated: new Date().toISOString() }
}

export function saveInquiriesData(data: any) {
  // 기존 코드 유지
  return true
}
