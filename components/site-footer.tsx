import { getCompanyData } from "@/lib/file-db"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export async function SiteFooter() {
  const companyData = getCompanyData()
  const { info: companyInfo } = companyData

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{companyInfo.name}</h3>
            <p className="text-gray-400 mb-6">{companyInfo.description}</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-gray-300">{companyInfo.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-gray-300">{companyInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-gray-300">{companyInfo.email}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/building" className="text-gray-300 hover:text-white">
                  건물 관리
                </Link>
              </li>
              <li>
                <Link href="/services/cleaning" className="text-gray-300 hover:text-white">
                  청소 서비스
                </Link>
              </li>
              <li>
                <Link href="/services/fire" className="text-gray-300 hover:text-white">
                  소방 점검
                </Link>
              </li>
              <li>
                <Link href="/services/elevator" className="text-gray-300 hover:text-white">
                  엘리베이터 관리
                </Link>
              </li>
              <li>
                <Link href="/services/vacancy" className="text-gray-300 hover:text-white">
                  공실 관리
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">바로가기</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link href="/real-estate" className="text-gray-300 hover:text-white">
                  부동산 서비스
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
