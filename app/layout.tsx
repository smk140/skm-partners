import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

import ClientLayout from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SKM파트너스 - 전문적인 건물 관리 서비스",
  description: "청소, 소방, 엘리베이터 관리 등 건물 관리의 모든 것을 책임집니다.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
