"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { useEffect, useState } from "react"

interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
}

export function SiteFooter() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SKM파트너스",
    address: "",
    phone: "",
    email: "",
    description: "",
  })

  useEffect(() => {
    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.info) {
          setCompanyInfo(data.info)
        }
      })
      .catch((error) => {
        console.error("회사 정보 로드 실패:", error)
      })
  }, [])

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{companyInfo.name}</h3>
            <p className="text-slate-300 mb-4">{companyInfo.description}</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-slate-300 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white hover:text-slate-300 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white hover:text-slate-300 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">연락처</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-slate-400" />
                <span>{companyInfo.phone}</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-slate-400" />
                <span>{companyInfo.email}</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-slate-400" />
                <span>{companyInfo.address}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-slate-300 hover:text-white transition-colors">
                  서비스
                </Link>
              </li>
              <li>
                <Link href="/vacancy" className="text-slate-300 hover:text-white transition-colors">
                  공실 관리
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="text-slate-300 hover:text-white transition-colors">
                  부동산 서비스
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-slate-300 hover:text-white transition-colors">
                  고객센터
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>
            © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <Link href="/terms" className="hover:text-white transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
