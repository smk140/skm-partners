import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sendBlockedIPAccessAttempt } from "@/lib/discord"

// 허용된 IP 목록 (환경변수에서 가져오기)
function getAllowedIPs(): Set<string> {
  const allowedIPs = process.env.ALLOWED_ADMIN_IPS
  if (!allowedIPs) {
    console.log("⚠️ ALLOWED_ADMIN_IPS not configured - all IPs will be monitored")
    return new Set<string>()
  }

  const ips = allowedIPs
    .split(",")
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0)
  console.log(`✅ Loaded ${ips.length} allowed admin IPs from environment`)
  return new Set(ips)
}

const ALLOWED_IPS = getAllowedIPs()

// 차단된 IP 목록을 저장할 Set (차단 사유 포함)
const blockedIPs = new Map<string, { reason: string; blockedAt: Date }>()

// 개인정보 동의한 세션을 저장할 Set
const consentedSessions = new Set<string>([])

// IP별 로그인 실패 추적
const loginFailures = new Map<string, { count: number; lastAttempt: number }>()
const LOGIN_FAILURE_WINDOW_MS = 300000 // 5분
const MAX_LOGIN_FAILURES = 3

// 메모리 정리 (30초마다 실행)
setInterval(() => {
  const now = Date.now()

  // 로그인 실패 기록 정리 (5분 이전 기록 삭제)
  for (const [ip, failure] of loginFailures.entries()) {
    if (now - failure.lastAttempt > LOGIN_FAILURE_WINDOW_MS) {
      loginFailures.delete(ip)
    }
  }

  console.log(`🧹 Memory cleanup: Login failure records cleaned`)
}, 30000)

// IP 차단 목록을 업데이트하는 함수
export function updateBlockedIPs(ip: string, action: "block" | "unblock", reason?: string) {
  if (action === "block") {
    blockedIPs.set(ip, {
      reason: reason || "관리자에 의한 수동 차단",
      blockedAt: new Date(),
    })
    // 차단 시 모든 기록 완전 삭제
    loginFailures.delete(ip)
    console.log(`🚫 IP ${ip} has been blocked. Reason: ${reason}`)
  } else {
    blockedIPs.delete(ip)
    // 허용 시에도 모든 기록 완전 삭제
    loginFailures.delete(ip)
    console.log(`✅ IP ${ip} has been unblocked and ALL records cleared`)
  }
}

// 로그인 실패 추적 함수 (허용된 IP도 포함)
export function trackLoginFailure(ip: string, username: string): { blocked: boolean; attempts: number } {
  // 이미 차단된 IP는 추가 처리하지 않음
  if (blockedIPs.has(ip)) {
    console.log(`🚫 IP ${ip} is already blocked, skipping login failure tracking`)
    return { blocked: true, attempts: 3 }
  }

  const now = Date.now()
  const failure = loginFailures.get(ip) || { count: 0, lastAttempt: 0 }

  // 5분 이전 기록이면 초기화
  if (now - failure.lastAttempt > LOGIN_FAILURE_WINDOW_MS) {
    failure.count = 0
  }

  failure.count++
  failure.lastAttempt = now
  loginFailures.set(ip, failure)

  console.log(`🚨 Login failure for IP ${ip}: ${failure.count}/${MAX_LOGIN_FAILURES}`)

  // 3번 실패하면 자동 차단 (허용된 IP든 아니든 상관없이)
  if (failure.count >= MAX_LOGIN_FAILURES) {
    const reason = `관리자 로그인 ${failure.count}번 연속 실패 - 자동 차단`
    blockedIPs.set(ip, {
      reason,
      blockedAt: new Date(),
    })
    loginFailures.delete(ip) // 차단되면 기록 삭제

    console.log(`🚨 AUTO-BLOCKED IP ${ip} for ${failure.count} login failures`)

    // Discord 알림 발송
    import("@/lib/discord").then(({ sendLoginFailureAutoBlockNotification }) => {
      sendLoginFailureAutoBlockNotification({
        ip_address: ip,
        username,
        failureCount: failure.count,
      })
    })

    return { blocked: true, attempts: failure.count }
  }

  return { blocked: false, attempts: failure.count }
}

// 로그인 성공 시 실패 기록 초기화
export function clearLoginFailures(ip: string) {
  loginFailures.delete(ip)
  console.log(`✅ Login failures cleared for IP ${ip}`)
}

// 개인정보 동의 세션 관리
export function updateConsentSession(sessionId: string, action: "add" | "remove") {
  if (action === "add") {
    consentedSessions.add(sessionId)
    console.log(`✅ Session ${sessionId} added to consented sessions`)
    console.log(`📊 Total consented sessions: ${consentedSessions.size}`)
  } else {
    consentedSessions.delete(sessionId)
    console.log(`❌ Session ${sessionId} removed from consented sessions`)
  }
}

// 동의된 세션 목록 확인 (디버깅용)
export function getConsentedSessions(): string[] {
  return Array.from(consentedSessions)
}

// 차단된 IP 목록을 가져오는 함수
export function getBlockedIPs(): Array<{ ip: string; reason: string; blockedAt: Date }> {
  return Array.from(blockedIPs.entries()).map(([ip, data]) => ({
    ip,
    reason: data.reason,
    blockedAt: data.blockedAt,
  }))
}

// 차단된 IP 정보를 가져오는 함수
export function getBlockedIPInfo(ip: string): { reason: string; blockedAt: Date } | null {
  return blockedIPs.get(ip) || null
}

// 실제 클라이언트 IP 주소를 가져오는 함수
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()

  return request.ip || "127.0.0.1"
}

export function middleware(request: NextRequest) {
  const clientIP = getClientIP(request)
  const pathname = request.nextUrl.pathname

  console.log(`🌐 Request from IP: ${clientIP} to ${pathname}`)

  // 차단된 IP인지 확인 (허용된 IP든 아니든 차단되면 접근 불가)
  if (blockedIPs.has(clientIP)) {
    console.log(`🚫 Blocked IP ${clientIP} attempted to access ${pathname}`)

    // 빠른 허용 API 접근은 허용
    if (pathname.startsWith("/api/admin/quick-unblock") || pathname.startsWith("/api/admin/ip-block")) {
      return NextResponse.next()
    }

    // 차단 페이지 접근은 허용
    if (pathname === "/blocked" || pathname.startsWith("/api/admin/block-info")) {
      return NextResponse.next()
    }

    // 차단된 IP는 관리자 페이지 접속 알림을 보내지 않음
    // Discord 알림 발송 (관리자 페이지가 아닌 경우만)
    if (!pathname.startsWith("/management-portal-secure-access-2025")) {
      sendBlockedIPAccessAttempt({
        ip: clientIP,
        userAgent: request.headers.get("user-agent") || undefined,
        attemptedUrl: pathname,
      }).catch(console.error)
    } else {
      console.log(`🔇 Blocked IP ${clientIP} accessing admin page - no notification sent`)
    }

    // 차단된 IP는 차단 페이지로 리디렉션
    return NextResponse.redirect(new URL("/blocked", request.url))
  }

  // 관리자 페이지 접근 제어 (차단되지 않은 IP만)
  if (pathname.startsWith("/management-portal-secure-access-2025")) {
    console.log(`👀 Admin panel access attempt from IP: ${clientIP}`)

    // 개인정보 동의 관련 API는 항상 허용
    if (pathname === "/api/admin/register-session" || pathname === "/api/admin/privacy-consent") {
      return NextResponse.next()
    }

    // 로그인 실패 API는 항상 허용
    if (pathname === "/api/admin/login-failure") {
      return NextResponse.next()
    }

    // 메인 관리자 페이지나 로그인 페이지는 항상 접근 허용
    if (
      pathname === "/management-portal-secure-access-2025" ||
      pathname === "/management-portal-secure-access-2025/login"
    ) {
      console.log(`✅ Access allowed to public admin page: ${pathname}`)
      return NextResponse.next()
    }

    // 그 외 관리자 페이지는 인증 확인
    // 개인정보 동의 쿠키 확인
    const consentCookie = request.cookies.get("admin-privacy-consent")
    const sessionCookie = request.cookies.get("admin-session-id")

    console.log(`🔍 Checking access to ${pathname}`)
    console.log(`🍪 Consent cookie: ${consentCookie?.value}`)
    console.log(`🍪 Session cookie: ${sessionCookie?.value}`)
    console.log(`📋 Available sessions: ${Array.from(consentedSessions)}`)

    if (!consentCookie || consentCookie.value !== "true") {
      console.log(`🚫 No valid consent cookie for admin access: ${pathname}`)
      return NextResponse.redirect(new URL("/management-portal-secure-access-2025", request.url))
    }

    if (!sessionCookie) {
      console.log(`🚫 No session cookie for admin access: ${pathname}`)
      return NextResponse.redirect(new URL("/management-portal-secure-access-2025", request.url))
    }

    // 세션 ID 확인
    if (!consentedSessions.has(sessionCookie.value)) {
      console.log(`🚫 Session not found in consented sessions: ${sessionCookie.value}`)
      console.log(`📋 Available sessions: ${Array.from(consentedSessions)}`)
      return NextResponse.redirect(new URL("/management-portal-secure-access-2025", request.url))
    }

    console.log(`✅ Access granted to ${pathname} for session ${sessionCookie.value}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
