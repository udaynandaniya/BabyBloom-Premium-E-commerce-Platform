export const dynamic = 'force-dynamic';
// import { NextResponse } from "next/server"
// import { dbConnect } from "@/lib/mongodb"
// import { ClothesModel } from "@/lib/models/clothes"
// import { StockManagerModel } from "@/lib/models/stockManager"

// export async function GET() {
//   try {
//     await dbConnect()
//     const clothes = await ClothesModel.find({}).sort({ createdAt: -1 })
//     return NextResponse.json(clothes)
//   } catch (error) {
//     console.error("Clothes GET Error:", error)
//     return NextResponse.json({ error: "Failed to fetch clothes" }, { status: 500 })
//   }
// }

// export async function POST(request: Request) {
//   try {
//     await dbConnect()
//     const clothesData = await request.json()

//     // Create the clothes item
//     const newClothes = new ClothesModel(clothesData)
//     await newClothes.save()

//     // Create corresponding stock manager entry
//     const stockEntry = new StockManagerModel({
//       productId: newClothes._id.toString(),
//       productCode: clothesData.productCode,
//       productType: "clothes",
//       productName: clothesData.name,
//       currentStock: clothesData.inStock,
//       source: "online",
//       notes: "Initial stock entry",
//     })
//     await stockEntry.save()

//     return NextResponse.json(newClothes, { status: 201 })
//   } catch (error) {
//     console.error("Clothes POST Error:", error)
//     return NextResponse.json({ error: "Failed to create clothes item" }, { status: 500 })
//   }
// }


import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { ClothesModel } from "@/lib/models/clothes"
import { clothesSchema } from "@/lib/validations/clothes-schema"
import { syncStockToManager, checkProductCodeUnique } from "@/lib/utils/stock-sync"

export async function GET() {
  try {
    await dbConnect()
    const clothes = await ClothesModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json({
      success: true,
      data: clothes,
      total: clothes.length,
    })
  } catch (error) {
    console.error("Error fetching clothes:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch clothes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()

    // Validate with Zod schema
    const validatedData = clothesSchema.parse(data)

    // Check product code uniqueness
    const isUnique = await checkProductCodeUnique(validatedData.productCode)
    if (!isUnique) {
      return NextResponse.json({ success: false, message: "Product code already exists" }, { status: 400 })
    }

    // Create new clothes item
    const newClothes = new ClothesModel(validatedData)
    await newClothes.save()

    // Sync with stock manager
    await syncStockToManager(
      newClothes._id.toString(),
      newClothes.productCode,
      newClothes.name,
      newClothes.inStock,
      "clothes",
    )

    return NextResponse.json({
      success: true,
      data: newClothes,
      message: "Clothes item added successfully",
    })
  } catch (error: any) {
    console.error("Error adding clothes:", error)

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

    return NextResponse.json({ success: false, message: error.message || "Failed to add clothes" }, { status: 500 })
  }
}
