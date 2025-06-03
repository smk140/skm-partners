import fs from "fs"
import path from "path"
import { commitFileToGitHub } from "./github"

// 로그 디렉토리 경로
const LOGS_DIR = path.join(process.cwd(), "logs")
const SECURITY_LOGS_FILE = path.join(LOGS_DIR, "security.json")
const ACCESS_LOGS_FILE = path.join(LOGS_DIR, "access.json")
const ADMIN_LOGS_FILE = path.join(LOGS_DIR, "admin.json")

// 로그 디렉토리 생성
function ensureLogsDirectory() {
  try {
    if (!fs.existsSync(LOGS_DIR)) {
      fs.mkdirSync(LOGS_DIR, { recursive: true })
      console.log("Logs directory created:", LOGS_DIR)
    }
  } catch (error) {
    console.error("로그 디렉토리 생성 실패:", error)
  }
}

// 로그 파일 초기화
function initializeLogFiles() {
  ensureLogsDirectory()

  const defaultLogs = { logs: [] }

  if (!fs.existsSync(SECURITY_LOGS_FILE)) {
    fs.writeFileSync(SECURITY_LOGS_FILE, JSON.stringify(defaultLogs, null, 2))
  }
  if (!fs.existsSync(ACCESS_LOGS_FILE)) {
    fs.writeFileSync(ACCESS_LOGS_FILE, JSON.stringify(defaultLogs, null, 2))
  }
  if (!fs.existsSync(ADMIN_LOGS_FILE)) {
    fs.writeFileSync(ADMIN_LOGS_FILE, JSON.stringify(defaultLogs, null, 2))
  }
}

// 로그 읽기
function readLogs(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) {
      return { logs: [] }
    }
    const data = fs.readFileSync(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`로그 읽기 실패 (${filePath}):`, error)
    return { logs: [] }
  }
}

// 로그 쓰기
function writeLogs(filePath: string, logs: any) {
  try {
    const data = JSON.stringify(logs, null, 2)
    fs.writeFileSync(filePath, data, "utf8")

    // GitHub에 커밋 (비동기)
    const relativePath = path.relative(process.cwd(), filePath)
    commitFileToGitHub(relativePath, data, "보안 로그 업데이트").catch(console.error)

    return true
  } catch (error) {
    console.error(`로그 쓰기 실패 (${filePath}):`, error)
    return false
  }
}

// 로그 추가 함수
function addLog(filePath: string, logEntry: any) {
  const logs = readLogs(filePath)
  logs.logs.unshift({
    ...logEntry,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  })

  // 최대 1000개 로그만 유지
  if (logs.logs.length > 1000) {
    logs.logs = logs.logs.slice(0, 1000)
  }

  return writeLogs(filePath, logs)
}

// 초기화
initializeLogFiles()

// 보안 로그 (로그인 실패, IP 차단 등)
export function logSecurityEvent(event: {
  type: "login_failure" | "login_success" | "ip_blocked" | "ip_unblocked" | "unauthorized_access"
  ip_address: string
  user_agent?: string
  username?: string
  details?: string
  admin?: string
}) {
  return addLog(SECURITY_LOGS_FILE, event)
}

// 접속 로그 (페이지 접속, API 호출 등)
export function logAccessEvent(event: {
  type: "page_access" | "api_call" | "admin_access"
  ip_address: string
  user_agent?: string
  path: string
  method?: string
  status?: number
  details?: string
}) {
  return addLog(ACCESS_LOGS_FILE, event)
}

// 관리자 활동 로그 (데이터 수정, 설정 변경 등)
export function logAdminActivity(event: {
  type: "company_update" | "property_update" | "inquiry_update" | "settings_change" | "user_management"
  admin: string
  ip_address: string
  details: string
  before_data?: any
  after_data?: any
}) {
  return addLog(ADMIN_LOGS_FILE, event)
}

// 로그 조회 함수들
export function getSecurityLogs(limit = 100) {
  const logs = readLogs(SECURITY_LOGS_FILE)
  return logs.logs.slice(0, limit)
}

export function getAccessLogs(limit = 100) {
  const logs = readLogs(ACCESS_LOGS_FILE)
  return logs.logs.slice(0, limit)
}

export function getAdminLogs(limit = 100) {
  const logs = readLogs(ADMIN_LOGS_FILE)
  return logs.logs.slice(0, limit)
}

// 통계 함수들
export function getSecurityStats() {
  const logs = readLogs(SECURITY_LOGS_FILE)
  const today = new Date().toDateString()

  const todayLogs = logs.logs.filter((log: any) => new Date(log.timestamp).toDateString() === today)

  return {
    total_events: logs.logs.length,
    today_events: todayLogs.length,
    login_failures: logs.logs.filter((log: any) => log.type === "login_failure").length,
    blocked_ips: logs.logs.filter((log: any) => log.type === "ip_blocked").length,
    unauthorized_access: logs.logs.filter((log: any) => log.type === "unauthorized_access").length,
  }
}
