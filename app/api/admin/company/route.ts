import { NextResponse } from "next/server"
import { getCompanyData, saveCompanyData, generateId } from "@/lib/file-db"

// 회사 정보 조회
export async function GET() {
  try {
    const data = getCompanyData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("회사 정보 조회 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 회사 기본 정보 업데이트
export async function PUT(request: Request) {
  try {
    const { info } = await request.json()
    const data = getCompanyData()

    data.info = {
      ...data.info,
      ...info,
    }

    const success = saveCompanyData(data)

    if (!success) {
      return NextResponse.json({ error: "회사 정보 저장에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({ success: true, info: data.info })
  } catch (error) {
    console.error("회사 정보 업데이트 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 임원 또는 성공 사례 추가/수정/삭제
export async function POST(request: Request) {
  try {
    const { action, type, data: itemData } = await request.json()
    const companyData = getCompanyData()

    // 타입에 따라 배열 선택
    const arrayKey = type === "executive" ? "executives" : "successCases"

    if (action === "add") {
      // 새 항목 추가
      const newItem = {
        id: generateId(companyData[arrayKey]),
        ...itemData,
      }
      companyData[arrayKey].push(newItem)
    } else if (action === "update") {
      // 기존 항목 업데이트
      const index = companyData[arrayKey].findIndex((item: any) => item.id === itemData.id)
      if (index !== -1) {
        companyData[arrayKey][index] = {
          ...companyData[arrayKey][index],
          ...itemData,
        }
      } else {
        return NextResponse.json({ error: "해당 항목을 찾을 수 없습니다." }, { status: 404 })
      }
    } else if (action === "delete") {
      // 항목 삭제
      const index = companyData[arrayKey].findIndex((item: any) => item.id === itemData.id)
      if (index !== -1) {
        companyData[arrayKey].splice(index, 1)
      } else {
        return NextResponse.json({ error: "해당 항목을 찾을 수 없습니다." }, { status: 404 })
      }
    } else {
      return NextResponse.json({ error: "유효하지 않은 작업입니다." }, { status: 400 })
    }

    const success = saveCompanyData(companyData)

    if (!success) {
      return NextResponse.json({ error: "데이터 저장에 실패했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      [arrayKey]: companyData[arrayKey],
    })
  } catch (error) {
    console.error("데이터 처리 중 오류:", error)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
