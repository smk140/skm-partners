import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, MessageCircle } from "lucide-react"

export default function RealEstatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="mb-6">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">부동산 서비스</h1>
                <p className="text-lg text-gray-600 mb-4">현재 지원하지 않는 서비스입니다</p>
                <p className="text-gray-500">죄송합니다. 부동산 관련 서비스는 현재 제공하지 않고 있습니다.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    홈으로 돌아가기
                  </Link>
                </Button>

                <Button asChild>
                  <Link href="/contact" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    문의하기
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
