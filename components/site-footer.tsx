"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Phone, Mail, MapPin } from "lucide-react"

export default function SiteFooter() {
  const [currentYear, setCurrentYear] = useState(2024)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">SKM파트너스</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              전문적인 부동산 관리 및 컨설팅 서비스를 제공하는 신뢰할 수 있는 파트너입니다.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@skm.kr</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>서울특별시 강남구 테헤란로 123</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400 transition-colors">
                  서비스
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="hover:text-blue-400 transition-colors">
                  부동산
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">운영시간</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <div>
                <div className="font-medium">평일</div>
                <div>10:00 - 17:00</div>
              </div>
              <div>
                <div className="font-medium">주말, 공휴일</div>
                <div className="text-red-400">휴무</div>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <div className="text-blue-400 font-medium">문의: 언제든지 가능</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} SKM파트너스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
