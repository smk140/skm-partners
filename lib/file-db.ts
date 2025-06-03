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
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
} catch (error) {
  console.error("데이터 디렉토리 생성 실패:", error)
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
  properties: [],
}

const DEFAULT_INQUIRIES_DATA = {
  inquiries: [],
}

// 파일 존재 확인 및 생성
function ensureFileExists(filePath: string, defaultData: any) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf8")
    }
  } catch (error) {
    console.error(`파일 생성 실패 (${filePath}):`, error)
  }
}

// 초기 파일 생성
ensureFileExists(COMPANY_FILE, DEFAULT_COMPANY_DATA)
ensureFileExists(PROPERTIES_FILE, DEFAULT_PROPERTIES_DATA)
ensureFileExists(INQUIRIES_FILE, DEFAULT_INQUIRIES_DATA)

// 회사 정보 관련 함수
export function getCompanyData() {
  try {
    const data = fs.readFileSync(COMPANY_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("회사 정보 읽기 실패:", error)
    return DEFAULT_COMPANY_DATA
  }
}

export function saveCompanyData(data: any) {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(COMPANY_FILE, jsonData, "utf8")

    // GitHub에 커밋
    commitFileToGitHub("data/company.json", jsonData, "회사 정보 업데이트").catch((error) =>
      console.error("GitHub 커밋 실패:", error),
    )

    return true
  } catch (error) {
    console.error("회사 정보 저장 실패:", error)
    return false
  }
}

// 부동산 매물 관련 함수
export function getPropertiesData() {
  try {
    const data = fs.readFileSync(PROPERTIES_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("부동산 매물 정보 읽기 실패:", error)
    return DEFAULT_PROPERTIES_DATA
  }
}

export function savePropertiesData(data: any) {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(PROPERTIES_FILE, jsonData, "utf8")

    // GitHub에 커밋
    commitFileToGitHub("data/properties.json", jsonData, "부동산 매물 정보 업데이트").catch((error) =>
      console.error("GitHub 커밋 실패:", error),
    )

    return true
  } catch (error) {
    console.error("부동산 매물 정보 저장 실패:", error)
    return false
  }
}

// 문의 관련 함수
export function getInquiriesData() {
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("문의 정보 읽기 실패:", error)
    return DEFAULT_INQUIRIES_DATA
  }
}

export function saveInquiriesData(data: any) {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    fs.writeFileSync(INQUIRIES_FILE, jsonData, "utf8")

    // GitHub에 커밋
    commitFileToGitHub("data/inquiries.json", jsonData, "문의 정보 업데이트").catch((error) =>
      console.error("GitHub 커밋 실패:", error),
    )

    return true
  } catch (error) {
    console.error("문의 정보 저장 실패:", error)
    return false
  }
}

// ID 생성 함수
export function generateId(items: any[]) {
  if (items.length === 0) return 1
  return Math.max(...items.map((item) => item.id)) + 1
}
