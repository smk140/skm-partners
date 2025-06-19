import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 환경 변수 디버깅")

  const envVars = {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? "존재함" : "없음",
    VERCEL_BLOB_READ_WRITE_TOKEN: process.env.VERCEL_BLOB_READ_WRITE_TOKEN ? "존재함" : "없음",
    blobRelatedVars: Object.keys(process.env).filter((key) => key.toLowerCase().includes("blob")),
    allEnvVars: Object.keys(process.env).length,
  }

  return NextResponse.json(envVars)
}
