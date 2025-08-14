import { Clock } from "lucide-react"

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Clock className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">서비스 준비중입니다</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          더 나은 서비스를 제공하기 위해 준비 중입니다.
          <br />
          빠른 시일 내에 만나뵙겠습니다.
        </p>
        <div className="text-sm text-gray-500">문의사항이 있으시면 언제든지 연락주세요.</div>
      </div>
    </div>
  )
}
