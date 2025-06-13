// Discord 웹훅 알림 전송 함수들

interface DiscordEmbed {
  title: string
  description?: string
  color: number
  fields: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  timestamp: string
  footer?: {
    text: string
  }
}

interface DiscordMessage {
  content?: string
  embeds: DiscordEmbed[]
}

// 허용되지 않은 IP에서 관리자 접속 시도 알림
export async function sendUnauthorizedAdminAccessNotification({
  ip_address,
  user_agent,
  page,
}: {
  ip_address: string
  user_agent: string
  page: string
}) {
  const webhookUrl = process.env.SECURITY_DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_SECURITY_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("Security Discord webhook URL not configured")
    return
  }

  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // 즉시 차단 URL 생성
  const quickBlockUrl = `${domain}/api/admin/ip-block/quick?ip=${ip_address}&action=block&reason=Discord에서 즉시 차단`

  // 허용된 IP 목록 가져오기
  const allowedIPs = process.env.ALLOWED_ADMIN_IPS
  const allowedIPsList = allowedIPs ? allowedIPs.split(",").map((ip) => ip.trim()) : []

  const embed = {
    title: "⚠️ 허용되지 않은 IP에서 관리자 시스템 접근",
    description: "지정된 IP가 아닌 곳에서 관리자 시스템에 접근했습니다.",
    color: 0xff9500, // 주황색
    fields: [
      {
        name: "🌐 접속 IP 주소",
        value: `\`${ip_address}\``,
        inline: true,
      },
      {
        name: "📄 접속 단계",
        value: page,
        inline: true,
      },
      {
        name: "⏰ 접속 시간",
        value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
        inline: true,
      },
      {
        name: "📋 허용된 IP 목록",
        value: allowedIPsList.length > 0 ? allowedIPsList.map((ip) => `\`${ip}\``).join(", ") : "설정되지 않음",
        inline: false,
      },
      {
        name: "🖥️ 사용자 에이전트",
        value: user_agent.length > 100 ? user_agent.substring(0, 100) + "..." : user_agent,
        inline: false,
      },
      {
        name: "🚫 즉시 IP 차단",
        value: `[여기를 클릭하여 즉시 차단](${quickBlockUrl})`,
        inline: false,
      },
      {
        name: "⚙️ 관리자 페이지",
        value: `[보안 관리 페이지로 이동](${domain}/management-portal-secure-access-2025/security)`,
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "SKM파트너스 보안 모니터링 시스템",
    },
  }

  const message = {
    content: `🚨 **보안 알림** - 허용되지 않은 IP에서 관리자 시스템에 접근했습니다! (\`${ip_address}\`)

**조치 필요:** 이 IP가 신뢰할 수 있는 IP인지 확인하고, 필요시 위의 "즉시 IP 차단" 링크를 클릭하여 차단하세요.`,
    embeds: [embed],
  }

  try {
    console.log("Sending Discord notification for unauthorized admin access...")
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`)
    }

    console.log("Unauthorized admin access notification sent successfully")
  } catch (error) {
    console.error("Failed to send unauthorized admin access notification:", error)
  }
}

// 로그인 실패 3번으로 인한 자동 차단 알림
export async function sendLoginFailureAutoBlockNotification({
  ip_address,
  username,
  failureCount,
}: {
  ip_address: string
  username: string
  failureCount: number
}) {
  const webhookUrl = process.env.SECURITY_DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_SECURITY_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("Security Discord webhook URL not configured")
    return
  }

  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const quickUnblockUrl = `${domain}/api/admin/quick-unblock?ip=${ip_address}`

  const embed = {
    title: "🚨 로그인 실패로 인한 자동 IP 차단!",
    description: `로그인 ${failureCount}번 실패로 인해 IP가 자동 차단되었습니다.`,
    color: 0xff0000,
    fields: [
      {
        name: "🌐 차단된 IP",
        value: `\`${ip_address}\``,
        inline: true,
      },
      {
        name: "👤 시도한 사용자명",
        value: username,
        inline: true,
      },
      {
        name: "📊 실패 횟수",
        value: `${failureCount}번`,
        inline: true,
      },
      {
        name: "📅 차단 시간",
        value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
        inline: true,
      },
      {
        name: "🔓 빠른 허용",
        value: `[여기를 클릭하여 즉시 허용](${quickUnblockUrl})`,
        inline: false,
      },
      {
        name: "⚙️ 관리자 페이지",
        value: `[관리자 페이지에서 관리](${domain}/management-portal-secure-access-2025/security)`,
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "SKM파트너스 자동 보안 시스템",
    },
  }

  const message = {
    content: `🚨 **긴급 보안 알림** - 로그인 실패로 IP가 자동 차단되었습니다! (\`${ip_address}\`)

**빠른 조치:** 위의 "빠른 허용" 링크를 클릭하면 즉시 IP를 허용할 수 있습니다.`,
    embeds: [embed],
  }

  try {
    console.log(`🚨 Sending login failure auto-block notification for IP ${ip_address}...`)
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`)
    }

    console.log(`✅ Login failure auto-block notification sent successfully for IP ${ip_address}`)
  } catch (error) {
    console.error("Failed to send login failure auto-block notification:", error)
  }
}

// 차단된 IP 접속 시도 알림
export async function sendBlockedIPAccessAttempt({
  ip,
  userAgent,
  attemptedUrl,
}: {
  ip: string
  userAgent?: string
  attemptedUrl: string
}) {
  const webhookUrl = process.env.SECURITY_DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_SECURITY_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("Security Discord webhook URL not configured")
    return
  }

  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const quickUnblockUrl = `${domain}/api/admin/quick-unblock?ip=${ip}`

  const embed = {
    title: "🚫 차단된 IP 접속 시도",
    color: 0xff0000,
    fields: [
      {
        name: "🌐 IP 주소",
        value: ip,
        inline: true,
      },
      {
        name: "📄 접속 시도 URL",
        value: attemptedUrl,
        inline: true,
      },
      {
        name: "🖥️ 사용자 에이전트",
        value: userAgent || "알 수 없음",
        inline: false,
      },
      {
        name: "⏰ 시간",
        value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
        inline: false,
      },
      {
        name: "🔓 빠른 허용",
        value: `[여기를 클릭하여 즉시 허용](${quickUnblockUrl})`,
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
  }

  const message = {
    embeds: [embed],
  }

  try {
    console.log("Sending Discord notification for blocked IP access attempt...")
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`)
    }

    console.log("Discord notification sent successfully")
  } catch (error) {
    console.error("Failed to send Discord notification:", error)
  }
}

// 빠른 문의 알림
export async function sendQuickInquiryNotification(data: any) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("Discord webhook URL not configured")
    return
  }

  const embed = {
    title: "📞 새로운 빠른 문의",
    color: 0x00aaff,
    fields: [
      {
        name: "👤 이름",
        value: data.name,
        inline: true,
      },
      {
        name: "📱 연락처",
        value: data.phone,
        inline: true,
      },
      {
        name: "🔍 관심 서비스",
        value: getServiceName(data.service),
        inline: true,
      },
      {
        name: "💬 문의 내용",
        value: data.message || "(내용 없음)",
        inline: false,
      },
      {
        name: "🌐 IP 주소",
        value: data.ip_address || "알 수 없음",
        inline: true,
      },
      {
        name: "⏰ 시간",
        value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
  }

  const message = {
    content: "📢 **새로운 빠른 문의가 접수되었습니다!**",
    embeds: [embed],
  }

  try {
    console.log("Sending Discord notification for quick inquiry...")
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.status} ${response.statusText}`)
    }

    console.log("Discord notification sent successfully")
  } catch (error) {
    console.error("Failed to send Discord notification:", error)
  }
}

// 문의 알림 발송 (서버 전용) - 기존 호환성을 위해 추가
export async function sendInquiryNotification(inquiry: {
  name: string
  phone: string
  email?: string
  company?: string
  service: string
  message?: string
  ip_address?: string
  user_agent?: string
}) {
  console.log("sendInquiryNotification called with:", inquiry.name)

  // 서버 전용 웹훅 URL (NEXT_PUBLIC_ 제거)
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL

  console.log("Webhook URL available:", !!webhookUrl)

  if (!webhookUrl) {
    console.log("Discord inquiry webhook URL not configured")
    return false
  }

  const embed: DiscordEmbed = {
    title: "🔔 새로운 상담 신청이 접수되었습니다!",
    description: `**${inquiry.name}**님으로부터 새로운 상담 신청이 들어왔습니다.`,
    color: 0x3b82f6,
    fields: [
      {
        name: "👤 이름",
        value: inquiry.name,
        inline: true,
      },
      {
        name: "📞 연락처",
        value: inquiry.phone,
        inline: true,
      },
      {
        name: "🏢 서비스",
        value: inquiry.service,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "SKM파트너스 상담 신청 시스템",
    },
  }

  if (inquiry.email) {
    embed.fields.push({
      name: "📧 이메일",
      value: inquiry.email,
      inline: true,
    })
  }

  if (inquiry.company) {
    embed.fields.push({
      name: "🏢 회사명",
      value: inquiry.company,
      inline: true,
    })
  }

  if (inquiry.message) {
    embed.fields.push({
      name: "💬 문의 내용",
      value: inquiry.message.length > 1000 ? inquiry.message.substring(0, 1000) + "..." : inquiry.message,
      inline: false,
    })
  }

  if (inquiry.ip_address) {
    embed.fields.push({
      name: "🌐 IP 주소",
      value: inquiry.ip_address,
      inline: true,
    })
  }

  if (inquiry.user_agent) {
    const shortUserAgent =
      inquiry.user_agent.length > 100 ? inquiry.user_agent.substring(0, 100) + "..." : inquiry.user_agent
    embed.fields.push({
      name: "💻 브라우저 정보",
      value: shortUserAgent,
      inline: false,
    })
  }

  const message: DiscordMessage = {
    content: "@here 새로운 상담 신청이 접수되었습니다! 빠른 연락 부탁드립니다.",
    embeds: [embed],
  }

  try {
    console.log("Sending Discord webhook...")
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    console.log("Discord webhook response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Discord webhook error response:", errorText)
      throw new Error(`Discord webhook failed: ${response.status} - ${errorText}`)
    }

    console.log("Discord inquiry notification sent successfully")
    return true
  } catch (error) {
    console.error("Failed to send Discord inquiry notification:", error)
    return false
  }
}

// IP 차단/해제 알림 발송 (서버 전용)
export async function sendIPBlockNotification(blockData: {
  ip: string
  action: "block" | "unblock"
  reason?: string
  admin: string
}) {
  console.log("sendIPBlockNotification called")

  // 서버 전용 보안 웹훅 URL
  const webhookUrl = process.env.SECURITY_DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_SECURITY_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.log("Security webhook URL not configured")
    return false
  }

  try {
    const isBlocking = blockData.action === "block"
    const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const quickUnblockUrl = `${domain}/api/admin/quick-unblock?ip=${blockData.ip}`
    const quickBlockUrl = `${domain}/api/admin/ip-block/quick?ip=${blockData.ip}&action=block&reason=Discord에서 재차단`

    const embed: DiscordEmbed = {
      title: isBlocking ? "🚫 IP 주소 차단" : "✅ IP 차단 해제",
      description: isBlocking
        ? `관리자 **${blockData.admin}**님이 IP 주소를 차단했습니다.`
        : `관리자 **${blockData.admin}**님이 IP 차단을 해제했습니다.`,
      color: isBlocking ? 0xef4444 : 0x10b981,
      fields: [
        {
          name: "🌐 IP 주소",
          value: `\`${blockData.ip}\``,
          inline: true,
        },
        {
          name: "👤 관리자",
          value: blockData.admin,
          inline: true,
        },
        {
          name: "🔧 액션",
          value: isBlocking ? "🚫 차단" : "✅ 차단 해제",
          inline: true,
        },
        {
          name: "📅 시간",
          value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "SKM파트너스 보안 관리 시스템",
      },
    }

    if (blockData.reason && isBlocking) {
      embed.fields.push({
        name: "📝 차단 사유",
        value: blockData.reason,
        inline: false,
      })
    }

    if (isBlocking) {
      embed.fields.push({
        name: "🔓 빠른 허용",
        value: `[여기를 클릭하여 즉시 허용](${quickUnblockUrl})`,
        inline: false,
      })
    } else {
      // 차단 해제된 경우 다시 차단할 수 있는 링크 추가
      embed.fields.push({
        name: "🚫 다시 차단",
        value: `[여기를 클릭하여 다시 차단](${quickBlockUrl})`,
        inline: false,
      })
    }

    const message: DiscordMessage = {
      content: isBlocking
        ? `🚨 **긴급 보안 알림** - IP 주소가 차단되었습니다! (\`${blockData.ip}\`)`
        : `✅ **보안 알림** - IP 차단이 해제되었습니다. (\`${blockData.ip}\`)`,
      embeds: [embed],
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("IP block Discord webhook error:", errorText)
      throw new Error(`Discord IP block webhook failed: ${response.status} - ${errorText}`)
    }

    console.log("Discord IP block notification sent successfully")
    return true
  } catch (error) {
    console.error("Failed to send Discord IP block notification:", error)
    return false
  }
}

// 서비스 이름 변환 함수
function getServiceName(serviceCode: string): string {
  const serviceMap: Record<string, string> = {
    "building-management": "건물 관리",
    "facility-management": "시설 관리",
    "security-service": "보안 서비스",
    "cleaning-service": "청소 서비스",
    maintenance: "유지보수",
    consulting: "컨설팅",
    other: "기타",
  }

  return serviceMap[serviceCode] || serviceCode
}

// 기존 함수명 호환성을 위해 유지
export const sendDiscordNotification = sendInquiryNotification

// 더미 함수들 (호환성을 위해 유지)
export async function sendAdminLoginNotification() {
  // 더 이상 사용하지 않음
}

export async function sendAdminAccessNotification() {
  // 더 이상 사용하지 않음
}

export async function sendAdminPrivacyConsentNotification() {
  // 더 이상 사용하지 않음
}

export async function sendSystemUpdateNotification() {
  // 더 이상 사용하지 않음
}

// 관리자 로그인 성공 알림
export async function sendAdminLoginSuccessNotification({
  username,
  ip_address,
  timestamp,
}: {
  username: string
  ip_address: string
  timestamp: string
}) {
  const webhookUrl = process.env.ADMIN_DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_ADMIN_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.log("Admin Discord webhook URL not configured")
    return false
  }

  const embed: DiscordEmbed = {
    title: "🔐 관리자 로그인 성공",
    description: `관리자가 시스템에 로그인했습니다.`,
    color: 0x00ff00,
    fields: [
      {
        name: "👤 사용자",
        value: username,
        inline: true,
      },
      {
        name: "🌐 접속 위치",
        value: ip_address,
        inline: true,
      },
      {
        name: "⏰ 로그인 시간",
        value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
        inline: true,
      },
    ],
    timestamp: timestamp,
    footer: {
      text: "SKM파트너스 관리자 시스템",
    },
  }

  const message: DiscordMessage = {
    content: "✅ 관리자가 시스템에 로그인했습니다.",
    embeds: [embed],
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Admin login Discord webhook error:", errorText)
      return false
    }

    console.log("Admin login notification sent successfully")
    return true
  } catch (error) {
    console.error("Failed to send admin login notification:", error)
    return false
  }
}

// 관리자 로그인 실패 알림
export async function sendAdminLoginFailureNotification({
  username,
  ip_address,
  timestamp,
}: {
  username: string
  ip_address: string
  timestamp: string
}) {
  const webhookUrl = process.env.SECURITY_DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_SECURITY_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.log("Security Discord webhook URL not configured")
    return false
  }

  const embed: DiscordEmbed = {
    title: "⚠️ 관리자 로그인 실패",
    description: `잘못된 관리자 로그인 시도가 감지되었습니다.`,
    color: 0xff0000,
    fields: [
      {
        name: "👤 시도한 사용자명",
        value: username,
        inline: true,
      },
      {
        name: "🌐 접속 위치",
        value: ip_address,
        inline: true,
      },
      {
        name: "⏰ 시도 시간",
        value: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
        inline: true,
      },
    ],
    timestamp: timestamp,
    footer: {
      text: "SKM파트너스 보안 시스템",
    },
  }

  const message: DiscordMessage = {
    content: "🚨 **보안 알림** - 잘못된 관리자 로그인 시도가 감지되었습니다!",
    embeds: [embed],
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Admin login failure Discord webhook error:", errorText)
      return false
    }

    console.log("Admin login failure notification sent successfully")
    return true
  } catch (error) {
    console.error("Failed to send admin login failure notification:", error)
    return false
  }
}
