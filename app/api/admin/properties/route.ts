import { NextResponse } from "next/server"
import { getPropertiesData, savePropertiesData, generateId } from "@/lib/file-db"

// 부동산 매물 목록 조회
export async function GET() {
  console.log("[API Properties GET] Request received")
  try {
    const data = getPropertiesData()
    console.log(`[API Properties GET] Returning ${data.properties?.length || 0} properties.`)
    return NextResponse.json({
      success: true,
      properties: data.properties || [],
      total: data.properties?.length || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[API Properties GET] Error:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        success: false,
        properties: [],
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 추가
export async function POST(request: Request) {
  console.log("[API Properties POST] Request received")
  try {
    const propertyDataFromRequest = await request.json()
    console.log("[API Properties POST] Data from request:", propertyDataFromRequest)

    const currentData = getPropertiesData()
    console.log(`[API Properties POST] Current properties count: ${currentData.properties?.length || 0}`)

    const newProperty = {
      id: generateId(currentData.properties || []),
      createdAt: new Date().toISOString(), // Corrected from created_at
      updated_at: new Date().toISOString(),
      status: propertyDataFromRequest.status || "활성",
      ...propertyDataFromRequest, // This will include title, location, image_url, etc.
    }
    console.log("[API Properties POST] New property to add:", newProperty)

    const newPropertiesArray = [...(currentData.properties || []), newProperty]

    const success = savePropertiesData({ properties: newPropertiesArray })
    console.log("[API Properties POST] Save operation result:", success)

    if (!success) {
      console.error("[API Properties POST] Failed to save property.")
      return NextResponse.json({ error: "부동산 매물 저장에 실패했습니다.", success: false }, { status: 500 })
    }

    console.log("[API Properties POST] Property added successfully.")
    return NextResponse.json({
      success: true,
      property: newProperty, // Return the property that was added
      message: "매물이 성공적으로 추가되었습니다.",
    })
  } catch (error) {
    console.error("[API Properties POST] Error:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        success: false,
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 수정 (PUT) - Ensure this also handles image_url if editing is implemented
export async function PUT(request: Request) {
  console.log("[API Properties PUT] Request received")
  try {
    const { id, ...updateData } = await request.json()
    console.log(`[API Properties PUT] Updating property ID: ${id} with data:`, updateData)

    const currentData = getPropertiesData()
    const properties = currentData.properties || []
    const index = properties.findIndex((p: any) => p.id === id)

    if (index === -1) {
      console.error(`[API Properties PUT] Property with ID ${id} not found.`)
      return NextResponse.json({ error: "해당 매물을 찾을 수 없습니다.", success: false }, { status: 404 })
    }

    properties[index] = {
      ...properties[index],
      ...updateData,
      updated_at: new Date().toISOString(),
    }
    console.log("[API Properties PUT] Updated property data:", properties[index])

    const success = savePropertiesData({ properties })
    console.log("[API Properties PUT] Save operation result:", success)

    if (!success) {
      console.error("[API Properties PUT] Failed to update property.")
      return NextResponse.json({ error: "부동산 매물 업데이트에 실패했습니다.", success: false }, { status: 500 })
    }

    console.log("[API Properties PUT] Property updated successfully.")
    return NextResponse.json({
      success: true,
      property: properties[index],
      message: "매물이 성공적으로 수정되었습니다.",
    })
  } catch (error) {
    console.error("[API Properties PUT] Error:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        success: false,
      },
      { status: 500 },
    )
  }
}

// 부동산 매물 삭제
export async function DELETE(request: Request) {
  console.log("[API Properties DELETE] Request received")
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get("id")
    const id = idParam ? Number.parseInt(idParam) : 0
    console.log("[API Properties DELETE] Attempting to delete property ID:", id)

    if (!id) {
      console.error("[API Properties DELETE] Invalid ID provided.")
      return NextResponse.json({ error: "매물 ID가 필요합니다.", success: false }, { status: 400 })
    }

    const currentData = getPropertiesData()
    const initialCount = currentData.properties?.length || 0
    const updatedProperties = (currentData.properties || []).filter((property: any) => property.id !== id)

    if (updatedProperties.length === initialCount) {
      console.warn(`[API Properties DELETE] Property with ID ${id} not found for deletion.`)
      return NextResponse.json({ error: "삭제할 매물을 찾을 수 없습니다.", success: false }, { status: 404 })
    }

    const success = savePropertiesData({ properties: updatedProperties })
    console.log("[API Properties DELETE] Save operation result:", success)

    if (!success) {
      console.error("[API Properties DELETE] Failed to save after deleting property.")
      return NextResponse.json({ error: "부동산 매물 삭제 후 저장에 실패했습니다.", success: false }, { status: 500 })
    }

    console.log("[API Properties DELETE] Property deleted successfully.")
    return NextResponse.json({
      success: true,
      message: "매물이 성공적으로 삭제되었습니다.",
    })
  } catch (error) {
    console.error("[API Properties DELETE] Error:", error)
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
        success: false,
      },
      { status: 500 },
    )
  }
}
