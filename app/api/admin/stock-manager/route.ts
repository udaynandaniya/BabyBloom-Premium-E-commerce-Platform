

import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { StockManagerModel } from "@/lib/models/stockManager"
import { NewbornItemModel } from "@/lib/models/newborn"
import { ClothesModel } from "@/lib/models/clothes"
import { BathItemModel } from "@/lib/models/bath"
import { ToyModel } from "@/lib/models"


export async function GET() {
  try {
    await dbConnect()

    const stockItems = await StockManagerModel.find({}).sort({ lastUpdated: -1 })

    return NextResponse.json(stockItems)
  } catch (error) {
    console.error("Stock Manager GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    console.log("\n\nUpdating stock...in stock-manager route.ts")
    const { itemId, newStock, notes, productType, productCode } = await request.json()

    console.log("Updating stock for item:", { itemId, newStock, notes, productType, productCode })

    // 1. Update StockManagerModel
    const updatedItem = await StockManagerModel.findByIdAndUpdate(
      itemId,
      {
        currentStock: newStock,
        lastUpdated: new Date(),
        notes: notes || undefined,
      },
      { new: true },
    )

    if (!updatedItem) {
      return NextResponse.json({ error: "Stock item not found" }, { status: 404 })
    }

    // 2. Update original model based on productType
    let modelUpdated = false

    console.log("Updating stock in original model:", productType, productCode, newStock)
    

    switch (productType) {
      case "newborn":
        await NewbornItemModel.findOneAndUpdate(
          { productCode },
          { inStock: newStock, updatedAt: new Date() }
        )
        modelUpdated = true
        break
      case "bath":
        await BathItemModel.findOneAndUpdate(
          { productCode },
          { inStock: newStock, updatedAt: new Date() }
        )
        modelUpdated = true
        break
      case "toy":
        await ToyModel.findOneAndUpdate(
          { productCode },
          { inStock: newStock, updatedAt: new Date() }
        )
        modelUpdated = true
        break
      case "clothes":
        await ClothesModel.findOneAndUpdate(
          { productCode },
          { inStock: newStock, updatedAt: new Date() }
        )
        modelUpdated = true
        break
      default:
        console.warn("Invalid productType, skipping model sync:", productType)
    }

    if (!modelUpdated) {
      console.warn("No matching model updated for:", productCode)
    }
    console.log("\nStock update successful:", updatedItem)

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Stock Manager PUT Error:", error)
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const stockData = await request.json()

    const newStockItem = new StockManagerModel({
      ...stockData,
      lastUpdated: new Date(),
    })

    await newStockItem.save()

    return NextResponse.json(newStockItem, { status: 201 })
  } catch (error) {
    console.error("Stock Manager POST Error:", error)
    return NextResponse.json({ error: "Failed to create stock item" }, { status: 500 })
  }
}
