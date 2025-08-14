"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Phone, Mail } from "lucide-react"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top contact bar */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>02-853-7715</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>bykim@skm.kr</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>서울시 관악구 조원로6길 47, 에스케이엠 1층</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SKM파트너스
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              홈
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              회사소개
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
              서비스
            </Link>
            <Link href="/real-estate" className="text-gray-700 hover:text-blue-600 transition-colors">
              부동산
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              문의하기
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                홈
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                회사소개
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
                서비스
              </Link>
              <Link href="/real-estate" className="text-gray-700 hover:text-blue-600 transition-colors">
                부동산
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                문의하기
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
