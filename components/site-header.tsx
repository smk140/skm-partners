"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "회사소개", href: "/about" },
  { name: "서비스", href: "/services" },
  { name: "부동산", href: "/real-estate" },
  { name: "문의하기", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="w-full flex h-16 items-center px-4 relative">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900 flex-shrink-0">
          SKM&nbsp;<span className="font-normal text-gray-700">Partners</span>
        </Link>

        {/* Desktop nav - 완전 가운데 정렬 */}
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-base font-medium transition-colors hover:text-blue-600 whitespace-nowrap",
                pathname === item.href ? "text-blue-600" : "text-gray-700",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA - 완전히 오른쪽 끝에 붙임 */}
        <div className="hidden md:flex ml-auto">
          <Button asChild size="sm">
            <Link href="/contact">무료 상담</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden ml-auto p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-base font-medium transition-colors hover:text-blue-600 hover:bg-gray-50 rounded-md",
                  pathname === item.href ? "text-blue-600 bg-blue-50" : "text-gray-700",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Button asChild size="sm" className="w-full">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  무료 상담
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default SiteHeader
