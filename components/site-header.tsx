"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "회사소개", href: "/about" },
  { name: "서비스", href: "/services" },
  { name: "부동산", href: "/real-estate" },
  { name: "문의하기", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          SKM&nbsp;<span className="font-normal text-gray-700">Partners</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600",
                pathname === item.href ? "text-blue-600" : "text-gray-700",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link href="/contact">무료 상담</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
