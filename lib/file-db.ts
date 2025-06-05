import fs from "fs"
import path from "path"

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
      console.log(`[FileDB] 📁 데이터 디렉토리 생성: ${DATA_DIR}`)
    }
  } catch (error) {
    console.error(`[FileDB] 💥 디렉토리 생성 실패 ${DATA_DIR}:`, error)
  }
}

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

// 파일 초기화
function initializeFile(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      const jsonData = JSON.stringify(defaultData, null, 2)
      fs.writeFileSync(filePath, jsonData, "utf8")
      console.log(`[FileDB] 📄 파일 초기화: ${filePath}`)
    }
  } catch (error) {
    console.error(`[FileDB] 💥 파일 초기화 실패 ${filePath}:`, error)
  }
}

// 초기화 함수
function initializeFiles() {
  ensureDataDirectory()
  initializeFile(COMPANY_FILE, DEFAULT_COMPANY_DATA)
  initializeFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
  initializeFile(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
}

// 초기화 실행
initializeFiles()

// 회사 정보 관련 함수
export function getCompanyData() {
  console.log(`[FileDB] 📖 회사 데이터 읽기: ${COMPANY_FILE}`)
  try {
    if (!fs.existsSync(COMPANY_FILE)) {
      console.log(`[FileDB] ⚠️ 파일 없음, 기본값 사용: ${COMPANY_FILE}`)
      initializeFile(COMPANY_FILE, DEFAULT_COMPANY_DATA)
      return JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
    }

    const content = fs.readFileSync(COMPANY_FILE, "utf8")
    if (!content.trim()) {
      console.log(`[FileDB] ⚠️ 빈 파일, 기본값 사용: ${COMPANY_FILE}`)
      return JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
    }

    const data = JSON.parse(content)
    console.log(`[FileDB] ✅ 회사 데이터 읽기 성공`)
    return data
  } catch (error) {
    console.error(`[FileDB] 💥 회사 데이터 읽기 실패:`, error)
    return JSON.parse(JSON.stringify(DEFAULT_COMPANY_DATA))
  }
}

export function saveCompanyData(data: any) {
  console.log(`[FileDB] 💾 회사 데이터 저장: ${COMPANY_FILE}`)
  try {
    if (!data) {
      console.error(`[FileDB] ❌ 잘못된 데이터`)
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

// 부동산 매물 관련 함수
export function getPropertiesData() {
  console.log(`[FileDB] 📖 매물 데이터 읽기: ${PROPERTIES_FILE}`)
  try {
    if (!fs.existsSync(PROPERTIES_FILE)) {
      console.log(`[FileDB] ⚠️ 매물 파일 없음, 기본값 사용`)
      initializeFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
      return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
    }

    const fileContent = fs.readFileSync(PROPERTIES_FILE, "utf8")
    if (!fileContent.trim()) {
      console.log(`[FileDB] ⚠️ 빈 매물 파일, 기본값 사용`)
      return JSON.parse(JSON.stringify(DEFAULT_PROPERTIES_DATA))
    }

    const data = JSON.parse(fileContent)
    if (!Array.isArray(data.properties)) {
      console.log(`[FileDB] ⚠️ 매물 배열이 아님, 수정`)
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
  console.log(`[FileDB] 💾 저장할 매물 수: ${dataToSave?.properties?.length || 0}`)

  if (!dataToSave || !Array.isArray(dataToSave.properties)) {
    console.error("[FileDB] ❌ 잘못된 매물 데이터 형식")
    return false
  }

  try {
    const dataWithTimestamp = {
      ...dataToSave,
      last_updated: new Date().toISOString(),
    }

    const jsonData = JSON.stringify(dataWithTimestamp, null, 2)

    // 백업 생성
    const backupPath = `${PROPERTIES_FILE}.backup`
    if (fs.existsSync(PROPERTIES_FILE)) {
      fs.copyFileSync(PROPERTIES_FILE, backupPath)
      console.log(`[FileDB] 📋 백업 생성: ${backupPath}`)
    }

    // 파일 쓰기
    fs.writeFileSync(PROPERTIES_FILE, jsonData, "utf8")
    console.log(`[FileDB] ✅ 매물 데이터 저장 성공. 매물 수: ${dataWithTimestamp.properties.length}`)

    // 검증
    const verification = fs.readFileSync(PROPERTIES_FILE, "utf8")
    const verifiedData = JSON.parse(verification)
    if (verifiedData.properties.length !== dataWithTimestamp.properties.length) {
      console.error(`[FileDB] 💥 저장 검증 실패!`)
      return false
    }

    console.log(`[FileDB] ✅ 저장 검증 완료`)
    return true
  } catch (error) {
    console.error(`[FileDB] 💥 매물 데이터 저장 실패:`, error)

    // 백업에서 복원 시도
    const backupPath = `${PROPERTIES_FILE}.backup`
    if (fs.existsSync(backupPath)) {
      try {
        fs.copyFileSync(backupPath, PROPERTIES_FILE)
        console.log(`[FileDB] 🔄 백업에서 복원 완료`)
      } catch (restoreError) {
        console.error(`[FileDB] 💥 백업 복원 실패:`, restoreError)
      }
    }
    return false
  }
}

// 문의 관련 함수
export function getInquiriesData() {
  console.log(`[FileDB] 📖 문의 데이터 읽기: ${INQUIRIES_FILE}`)
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      initializeFile(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
      return JSON.parse(JSON.stringify(DEFAULT_INQUIRIES_DATA))
    }

    const content = fs.readFileSync(INQUIRIES_FILE, "utf8")
    if (!content.trim()) {
      return JSON.parse(JSON.stringify(DEFAULT_INQUIRIES_DATA))
    }

    return JSON.parse(content)
  } catch (error) {
    console.error(`[FileDB] 💥 문의 데이터 읽기 실패:`, error)
    return JSON.parse(JSON.stringify(DEFAULT_INQUIRIES_DATA))
  }
}

export function saveInquiriesData(data: any) {
  console.log(`[FileDB] 💾 문의 데이터 저장: ${INQUIRIES_FILE}`)
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
  if (!items || items.length === 0) {
    console.log(`[FileDB] 🆔 첫 번째 ID 생성: 1`)
    return 1
  }
  const maxId = Math.max(0, ...items.map((item) => Number(item.id) || 0))
  const newId = maxId + 1
  console.log(`[FileDB] 🆔 새 ID 생성: ${newId}`)
  return newId
}
