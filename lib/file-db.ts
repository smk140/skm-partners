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
      console.log("Data directory created:", DATA_DIR)
    }
  } catch (error) {
    console.error("데이터 디렉토리 생성 실패:", error)
  }
}

// 기본 데이터 구조
const DEFAULT_COMPANY_DATA = {
  info: {
    name: "SKM파트너스",
    address: "서울특별시 강남구 테헤란로 123, 4층",
    phone: "02-123-4567",
    email: "bykim@skm.kr",
    description:
      "SKM파트너스는 건물 관리와 부동산 임대 대행 전문 기업으로, 고객의 자산 가치를 높이는 최고의 파트너입니다.",
  },
  executives: [
    {
      id: 1,
      name: "김대표",
      position: "대표이사",
      bio: "건물 관리 업계에서 20년 이상의 경험을 가진 전문가로, SKM파트너스를 설립하여 업계를 선도하고 있습니다.",
      image_url: null,
      order_index: 1,
    },
  ],
  successCases: [
    {
      id: 1,
      title: "강남 오피스 빌딩",
      location: "서울 강남구",
      before_status: "공실률 35%",
      after_status: "공실률 5%",
      period: "4개월",
      details: "강남 오피스 빌딩의 공실률을 35%에서 5%로 4개월 만에 개선한 성공 사례입니다.",
      image_url: null,
    },
  ],
}

const DEFAULT_PROPERTIES_DATA = {
  properties: [
    {
      id: 1,
      title: "강남 프리미엄 오피스",
      location: "서울 강남구 테헤란로",
      type: "오피스",
      size: "100평",
      price: "월 500만원",
      status: "활성",
      description: "강남 중심가에 위치한 프리미엄 오피스 공간입니다.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
}

const DEFAULT_INQUIRIES_DATA = {
  inquiries: [
    {
      id: 1,
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1234-5678",
      service: "건물관리",
      message: "건물 관리 서비스에 대해 문의드립니다.",
      status: "pending",
      created_at: new Date().toISOString(),
    },
  ],
}

// 파일 존재 확인 및 생성
function ensureFileExists(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      const jsonData = JSON.stringify(defaultData, null, 2)
      fs.writeFileSync(filePath, jsonData, "utf8")
      console.log(`Default file created: ${filePath}`)
    }
  } catch (error) {
    console.error(`파일 생성 실패 (${filePath}):`, error)
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
      console.log(`File not found, creating default: ${filePath}`)
      ensureFileExists(filePath, defaultData)
      return defaultData
    }

    const data = fs.readFileSync(filePath, "utf8")
    const parsed = JSON.parse(data)
    console.log(`Successfully read file: ${filePath}`)
    return parsed
  } catch (error) {
    console.error(`파일 읽기 실패 (${filePath}):`, error)
    return defaultData
  }
}

// 파일 쓰기 함수
function writeJsonFile(filePath: string, data: any, commitMessage: string) {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(filePath, jsonData, "utf8")
    console.log(`Successfully wrote file: ${filePath}`)

    // GitHub에 커밋 (비동기로 실행, 실패해도 메인 기능에 영향 없음)
    const relativePath = path.relative(process.cwd(), filePath)
    commitFileToGitHub(relativePath, jsonData, commitMessage).catch((error) =>
      console.error("GitHub 커밋 실패:", error),
    )

    return true
  } catch (error) {
    console.error(`파일 쓰기 실패 (${filePath}):`, error)
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
  return readJsonFile(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
}

export function savePropertiesData(data: any) {
  return writeJsonFile(PROPERTIES_FILE, data, "부동산 매물 정보 업데이트")
}

// 문의 관련 함수
export function getInquiriesData() {
  return readJsonFile(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)
}

export function saveInquiriesData(data: any) {
  return writeJsonFile(INQUIRIES_FILE, data, "문의 정보 업데이트")
}

// ID 생성 함수
export function generateId(items: any[]) {
  if (!items || items.length === 0) return 1
  return Math.max(...items.map((item) => item.id || 0)) + 1
}
