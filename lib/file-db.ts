import fs from "fs"
import path from "path"
import { promises as fsPromise } from "fs"

const DATA_DIR = path.join(process.cwd(), "data")
const COMPANY_FILE = path.join(DATA_DIR, "company.json")
const PROPERTIES_FILE = path.join(DATA_DIR, "properties.json")
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json")

interface CompanyData {
  name: string
  address: string
  phone: string
  email: string
  description: string
  slogan: string
  site_images?: {
    hero_main?: string
    company_building?: string
    team_photo?: string
    service_showcase?: string
  }
  main_services?: string[]
}

const DEFAULT_COMPANY_DATA: CompanyData = {
  name: "SKM파트너스",
  address: "",
  phone: "",
  email: "",
  description: "청소, 소방, 엘리베이터 관리까지 - 건물 가치를 높이는 SKM파트너스의 원스톱 서비스",
  slogan: "공실률 ZERO를 위한 스마트 건물 관리 솔루션",
  site_images: {},
  main_services: ["건물 종합 관리", "청소 서비스", "소방 안전 관리", "엘리베이터 관리"],
}

const DEFAULT_PROPERTIES_DATA = { properties: [], last_updated: new Date().toISOString(), version: "1.0" }
const DEFAULT_INQUIRIES_DATA = { inquiries: [], last_updated: new Date().toISOString() }

// 데이터 디렉토리가 없으면 생성
async function ensureDataDir() {
  try {
    await fsPromise.access(DATA_DIR)
  } catch {
    await fsPromise.mkdir(DATA_DIR, { recursive: true })
    console.log("📁 데이터 디렉토리 생성:", DATA_DIR)
  }
}

async function initializeFile(filePath: string, defaultData: any) {
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

async function initialize() {
  await ensureDataDir()
  await initializeFile(COMPANY_FILE, DEFAULT_COMPANY_DATA)
  await initializeFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
  await initializeFile(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
}

initialize()

function safeJsonParse(content: string, defaultValue: any) {
  try {
    const parsed = JSON.parse(content)
    return parsed
  } catch (error) {
    console.error("[FileDB] 💥 JSON 파싱 실패:", error)
    return defaultValue
  }
}

/**
 * JSON 파일에서 데이터를 읽습니다.
 */
export async function readFileDB<T>(filename: string): Promise<T | null> {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)

    try {
      const data = await fsPromise.readFile(filePath, "utf-8")
      return JSON.parse(data) as T
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        console.log(`📄 파일이 존재하지 않음: ${filename}`)
        return null
      }
      throw error
    }
  } catch (error) {
    console.error(`💥 파일 읽기 실패 (${filename}):`, error)
    throw error
  }
}

/**
 * JSON 파일에 데이터를 씁니다.
 */
export async function writeFileDB<T>(filename: string, data: T): Promise<void> {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)

    const jsonData = JSON.stringify(data, null, 2)
    await fsPromise.writeFile(filePath, jsonData, "utf-8")

    console.log(`✅ 파일 저장 성공: ${filename}`)
  } catch (error) {
    console.error(`💥 파일 저장 실패 (${filename}):`, error)
    throw error
  }
}

/**
 * 파일을 삭제합니다.
 */
export async function deleteFileDB(filename: string): Promise<boolean> {
  try {
    await ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)

    await fsPromise.unlink(filePath)
    console.log(`🗑️ 파일 삭제 성공: ${filename}`)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.log(`📄 삭제할 파일이 존재하지 않음: ${filename}`)
      return false
    }
    console.error(`💥 파일 삭제 실패 (${filename}):`, error)
    throw error
  }
}

/**
 * 데이터 디렉토리의 모든 파일 목록을 가져옵니다.
 */
export async function listFileDB(): Promise<string[]> {
  try {
    await ensureDataDir()
    const files = await fsPromise.readdir(DATA_DIR)
    return files.filter((file) => file.endsWith(".json"))
  } catch (error) {
    console.error("💥 파일 목록 조회 실패:", error)
    throw error
  }
}

export async function readCompanyData(): Promise<CompanyData> {
  try {
    await ensureDataDir()
    console.log("📖 회사 데이터 파일 읽기 시도:", COMPANY_FILE)

    const data = await fsPromise.readFile(COMPANY_FILE, "utf-8")
    const parsedData = JSON.parse(data)
    console.log("✅ 회사 데이터 읽기 성공")

    return { ...DEFAULT_COMPANY_DATA, ...parsedData }
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log("📄 회사 데이터 파일이 없음, 기본값 반환")
      return DEFAULT_COMPANY_DATA
    }
    console.error("💥 회사 데이터 읽기 실패:", error)
    return DEFAULT_COMPANY_DATA
  }
}

export async function writeCompanyData(data: CompanyData): Promise<void> {
  try {
    await ensureDataDir()
    console.log("💾 회사 데이터 저장 시도:", COMPANY_FILE)

    const jsonData = JSON.stringify(data, null, 2)
    await fsPromise.writeFile(COMPANY_FILE, jsonData, "utf-8")
    console.log("✅ 회사 데이터 저장 성공")
  } catch (error: any) {
    console.error("💥 회사 데이터 저장 실패:", error)
    throw error
  }
}

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
  console.log(`[FileDB] 💾 저장할 데이터 구조:`, Object.keys(data))

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

      if (verifiedData && verifiedData.name) {
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

export function getPropertiesData() {
  try {
    if (!fs.existsSync(PROPERTIES_FILE)) {
      const defaultData = { properties: [], last_updated: new Date().toISOString(), version: "1.0" }
      fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(defaultData, null, 2), "utf8")
      return defaultData
    }

    const content = fs.readFileSync(PROPERTIES_FILE, "utf8")
    return safeJsonParse(content, { properties: [], last_updated: new Date().toISOString(), version: "1.0" })
  } catch (error) {
    console.error("[FileDB] 부동산 데이터 읽기 실패:", error)
    return { properties: [], last_updated: new Date().toISOString(), version: "1.0" }
  }
}

export function savePropertiesData(dataToSave: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      ensureDataDirectory()
    }

    const jsonData = JSON.stringify(dataToSave, null, 2)
    fs.writeFileSync(PROPERTIES_FILE, jsonData, "utf8")
    console.log("[FileDB] 부동산 데이터 저장 성공")
    return true
  } catch (error) {
    console.error("[FileDB] 부동산 데이터 저장 실패:", error)
    return false
  }
}

export function getInquiriesData() {
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      const defaultData = { inquiries: [], last_updated: new Date().toISOString() }
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(defaultData, null, 2), "utf8")
      return defaultData
    }

    const content = fs.readFileSync(INQUIRIES_FILE, "utf8")
    return safeJsonParse(content, { inquiries: [], last_updated: new Date().toISOString() })
  } catch (error) {
    console.error("[FileDB] 문의 데이터 읽기 실패:", error)
    return { inquiries: [], last_updated: new Date().toISOString() }
  }
}

export function saveInquiriesData(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      ensureDataDirectory()
    }

    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(INQUIRIES_FILE, jsonData, "utf8")
    console.log("[FileDB] 문의 데이터 저장 성공")
    return true
  } catch (error) {
    console.error("[FileDB] 문의 데이터 저장 실패:", error)
    return false
  }
}

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
