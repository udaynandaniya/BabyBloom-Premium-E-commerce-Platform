export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { BathItemModel, ClothesModel, NewbornItemModel, ToyModel } from "@/lib/models"
// import { Clothes } from "@/models/Clothes"
// import { Toy } from "@/models/Toy"
// import { BathItem } from "@/models/BathItem"
// import { NewbornItem } from "@/models/NewbornItem"



export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { productCode, productType, excludeId } = await request.json()

    if (!productCode || !productType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let Model
    switch (productType) {
      case "clothes":
        Model = ClothesModel
        break
      case "toys":
        Model = ToyModel
        break
      case "bath":
        Model = BathItemModel
        break
      case "newborn":
        Model = NewbornItemModel
        break
      default:
        return NextResponse.json({ error: "Invalid product type" }, { status: 400 })
    }

    const query: any = { productCode }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }

    const existingProduct = await Model.findOne(query)
    const isUnique = !existingProduct

    return NextResponse.json({ isUnique })
  } catch (error) {
    console.error("Error validating product code:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
