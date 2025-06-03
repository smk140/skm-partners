import { getCompanyData } from "@/lib/file-db"
import Image from "next/image"
import { Building, Mail, MapPin, Phone } from "lucide-react"

export default async function AboutPage() {
  const companyData = getCompanyData()
  const { info: companyInfo, executives } = companyData

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-6 text-center">{companyInfo.name} 소개</h1>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-8">{companyInfo.description}</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">회사 정보</h2>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Building className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">회사명</h3>
                  <p className="text-gray-700">{companyInfo.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">주소</h3>
                  <p className="text-gray-700">{companyInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">전화번호</h3>
                  <p className="text-gray-700">{companyInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">이메일</h3>
                  <p className="text-gray-700">{companyInfo.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">임원 소개</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {executives
            .sort((a, b) => a.order_index - b.order_index)
            .map((executive) => (
              <div key={executive.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 relative">
                  {executive.image_url ? (
                    <Image
                      src={executive.image_url || "/placeholder.svg"}
                      alt={executive.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-4xl">{executive.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{executive.name}</h3>
                  <p className="text-blue-600 mb-4">{executive.position}</p>
                  <p className="text-gray-700">{executive.bio}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  )
}
