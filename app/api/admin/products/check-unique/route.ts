export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { StockManagerModel } from "@/lib/models/stockManager"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productCode = searchParams.get("productCode")
    const excludeId = searchParams.get("excludeId")

    if (!productCode) {
      return NextResponse.json({ success: false, message: "Product code is required" }, { status: 400 })
    }

    await dbConnect()

    const query: any = { productCode }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }

    // Check in stock manager for uniqueness across all product types
    const existingRecord = await StockManagerModel.findOne(query)
    const isUnique = !existingRecord

    return NextResponse.json({
      success: true,
      isUnique,
    })
  } catch (error) {
    console.error("Error checking product code uniqueness:", error)
    return NextResponse.json({ success: false, message: "Failed to check uniqueness" }, { status: 500 })
  }
}
