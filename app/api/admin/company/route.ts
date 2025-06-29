import { NextResponse } from "next/server"
import { getCompanyData, updateCompanyData } from "@/lib/file-db"

export const dynamic = "force-dynamic"

export async function GET() {
  const companyInfo = await getCompanyData()
  return NextResponse.json({ success: true, companyInfo })
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Awaited<ReturnType<typeof getCompanyData>>>
  const result = await updateCompanyData(body)
  const status = result.success ? 200 : 400
  return NextResponse.json(result, { status })
}
