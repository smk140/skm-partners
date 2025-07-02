"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  website?: string
}

export function SiteFooter() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    email: "info@skm.kr",
  })

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const timestamp = Date.now()
        const response = await fetch(`/api/company?t=${timestamp}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.companyInfo) {
            setCompanyInfo({
              name: data.companyInfo.name || "SKM파트너스",
              address: data.companyInfo.address || "서울특별시 강남구 테헤란로 123",
              phone: data.companyInfo.phone || "02-1234-5678",
              email: data.companyInfo.email || "info@skm.kr",
              website: data.companyInfo.website,
            })
            console.log("✅ Footer: 회사 정보 업데이트됨")
          }
        }
      } catch (error) {
        console.error("❌ Footer: 회사 정보 로드 실패:", error)
      }
    }

    loadCompanyInfo()

    // 5초마다 자동 새로고침 (관리자 수정사항 빠른 반영)
    const interval = setInterval(loadCompanyInfo, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">{companyInfo.name}</h3>
            <p className="text-gray-300 mb-4">전문적인 건물 관리 서비스를 제공하는 신뢰할 수 있는 파트너입니다.</p>
            <div className="space-y-2">
              {companyInfo.address && (
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{companyInfo.address}</span>
                </div>
              )}
              {companyInfo.phone && (
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{companyInfo.phone}</span>
                </div>
              )}
              {companyInfo.email && (
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{companyInfo.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  서비스
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="text-gray-300 hover:text-white transition-colors">
                  부동산
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  연락처
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">운영 시간</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <div>평일: 09:00 - 18:00</div>
                  <div>토요일: 09:00 - 15:00</div>
                  <div className="text-red-400">일요일/공휴일: 휴무</div>
                  <div className="text-blue-400 mt-1">긴급상황: 24시간 대응</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 {companyInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
