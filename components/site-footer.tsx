"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-blue-400">SKM</span>
              <span className="text-xl font-semibold">Partners</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              전문적인 부동산 컨설팅 서비스를 제공하는 SKM파트너스입니다. 고객의 성공적인 부동산 투자를 위해 최선을
              다하겠습니다.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">서울시 관악구 조원로6길 47, 에스케이엠 1층</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">02-853-7715</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">bykim@skm.kr</span>
              </div>
              {/* 운영시간 블록 통합 */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div className="text-gray-300 leading-tight">
                  <p>평일: 10:00 - 18:00</p>
                  <p>주말 및 공휴일: 휴무</p>
                  <p>문의: 언제든지 가능</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-blue-400 transition-colors">
                  서비스
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="text-gray-300 hover:text-blue-400 transition-colors">
                  부동산
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">서비스</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">부동산 투자</span>
              </li>
              <li>
                <span className="text-gray-300">시장 분석</span>
              </li>
              <li>
                <span className="text-gray-300">전문 컨설팅</span>
              </li>
              <li>
                <span className="text-gray-300">서류 대행</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} SKM Partners. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
