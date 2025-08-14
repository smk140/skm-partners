"use client"

import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">SKM파트너스</h3>
            <p className="text-gray-300 mb-4">
              전문적인 부동산 서비스와 건물 관리 솔루션을 제공하는 신뢰할 수 있는 파트너입니다.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📞 02-853-7715</p>
              <p>✉️ bykim@skm.kr</p>
              <p>📍 서울시 관악구 조원로6길 47, 에스케이엠 1층</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  부동산 중개
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  건물 관리
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  시설 관리
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  컨설팅
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">회사</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="hover:text-white transition-colors">
                  부동산 매물
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 SKM파트너스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
