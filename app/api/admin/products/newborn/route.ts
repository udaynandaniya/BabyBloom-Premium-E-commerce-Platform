export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { NewbornItemModel } from "@/lib/models/newborn"
import { newbornSchema } from "@/lib/validations/newborn-schema"
import { syncStockToManager, checkProductCodeUnique } from "@/lib/utils/stock-sync"

export async function GET() {
  try {
    await dbConnect()
    const newbornItems = await NewbornItemModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json({
      success: true,
      data: newbornItems,
      total: newbornItems.length,
    })
  } catch (error) {
    console.error("Error fetching newborn items:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch newborn items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()

    // Validate with Zod schema
    const validatedData = newbornSchema.parse(data)

    // Check product code uniqueness
    const isUnique = await checkProductCodeUnique(validatedData.productCode)
    if (!isUnique) {
      return NextResponse.json({ success: false, message: "Product code already exists" }, { status: 400 })
    }

    // Create new newborn item
    const newNewbornItem = new NewbornItemModel(validatedData)
    await newNewbornItem.save()

    // Sync with stock manager
    await syncStockToManager(
      newNewbornItem._id.toString(),
      newNewbornItem.productCode,
      newNewbornItem.name,
      newNewbornItem.inStock,
      "newborn",
    )

    return NextResponse.json({
      success: true,
      data: newNewbornItem,
      message: "Newborn item added successfully",
    })
  } catch (error: any) {
    console.error("Error adding newborn item:", error)
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
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add newborn item" },
      { status: 500 },
    )
  }
}
