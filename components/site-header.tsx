"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            SKM파트너스
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              회사 소개
            </Link>
            <Link href="/services" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              서비스 소개
            </Link>
            <Link href="/real-estate" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              부동산
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              문의하기
            </Link>
          </nav>

          <div className="hidden md:block">
            <Button className="bg-blue-600 hover:bg-blue-700">빠른 상담 신청</Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/about"
                  className="text-lg font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                >
                  회사 소개
                </Link>
                <Link
                  href="/services"
                  className="text-lg font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                >
                  서비스 소개
                </Link>
                <Link
                  href="/real-estate"
                  className="text-lg font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                >
                  부동산
                </Link>
                <Link
                  href="/contact"
                  className="text-lg font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                >
                  문의하기
                </Link>
                <div className="mt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">빠른 상담 신청</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
