// 임시로 이메일 기능 비활성화
export async function sendInquiryConfirmation(inquiry: {
  name: string
  email: string
  service: string
}) {
  console.log("Email confirmation would be sent to:", inquiry.email)
  return true
}

export async function sendAdminNotification(inquiry: {
  name: string
  phone: string
  email?: string
  company?: string
  service: string
  message?: string
}) {
  console.log("Admin notification would be sent for inquiry:", inquiry.name)
  return true
}
