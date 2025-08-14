"use client"

import { useEffect, useState } from "react"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

interface CompanyInfo {
  name?: string
  address?: string
  phone?: string
  email?: string
  description?: string
}

function SiteFooter() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    description: "전문적인 건물 관리 서비스를 제공하는 신뢰할 수 있는 파트너입니다.",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    email: "info@skm.kr",
  })

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    // 현재 연도 업데이트
    setCurrentYear(new Date().getFullYear())

    const loadCompanyData = async () => {
      try {
        const timestamp = Date.now()
        console.log("푸터 데이터 로딩 시작...", timestamp)

        const response = await fetch(`/api/company?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        const data = await response.json()
        console.log("푸터 API 응답:", data)

        if (data && typeof data === "object") {
          setCompanyInfo((prev) => ({
            ...prev,
            name: data.name || prev.name,
            description: data.description || prev.description,
            address: data.address || prev.address,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
          }))
          console.log("푸터 회사 정보 업데이트됨")
        }
      } catch (error) {
        console.error("푸터 데이터 로드 실패:", error)
      }
    }

    loadCompanyData()

    // 3초마다 자동 새로고침
    const interval = setInterval(loadCompanyData, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">{companyInfo.name}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{companyInfo.description}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <div className="space-y-3">
              {companyInfo.address && (
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{companyInfo.address}</span>
                </div>
              )}
              {companyInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">{companyInfo.phone}</span>
                </div>
              )}
              {companyInfo.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">{companyInfo.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">운영시간</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <div className="text-gray-300 text-sm">
                  <div>평일: 10:00 - 17:00</div>
                  <div>주말, 공휴일: 휴무</div>
                  <div className="text-blue-400 mt-1">문의: 언제든지 가능</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {companyInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
export default SiteFooter
