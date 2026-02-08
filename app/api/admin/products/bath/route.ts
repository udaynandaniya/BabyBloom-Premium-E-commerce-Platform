export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { BathItemModel } from "@/lib/models/bath"
import { bathSchema } from "@/lib/validations/bath-schema"
import { syncStockToManager, checkProductCodeUnique } from "@/lib/utils/stock-sync"

export async function GET() {
  try {
    await dbConnect()
    const bathItems = await BathItemModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json({
      success: true,
      data: bathItems,
      total: bathItems.length,
    })
  } catch (error) {
    console.error("Error fetching bath items:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bath items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()


    // Validate with Zod schema
    const validatedData = bathSchema.parse(data)

    // Check product code uniqueness
    const isUnique = await checkProductCodeUnique(validatedData.productCode)
    if (!isUnique) {
      return NextResponse.json({ success: false, message: "Product code already exists" }, { status: 400 })
    }

    // Create new bath item
    const newBathItem = new BathItemModel(validatedData)
    await newBathItem.save()

    // Sync with stock manager
    await syncStockToManager(
      newBathItem._id.toString(),
      newBathItem.productCode,
      newBathItem.name,
      newBathItem.inStock,
      "bath",
    )

    return NextResponse.json({
      success: true,
      data: newBathItem,
      message: "Bath item added successfully",
    })
  } catch (error: any) {
    console.error("Error adding bath item:", error)
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 },
      )
    }
    return NextResponse.json({ success: false, message: error.message || "Failed to add bath item" }, { status: 500 })
  }
}
