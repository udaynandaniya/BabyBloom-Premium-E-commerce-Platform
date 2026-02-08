export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { BathItemModel } from "@/lib/models/bath"
import { deleteFromStockManager } from "@/lib/utils/stock-sync"
import { deleteMultipleCloudinaryImages } from "@/lib/utils/cloudinary-delete"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { bathIds } = await request.json()

    if (!bathIds || !Array.isArray(bathIds) || bathIds.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid bath item IDs provided" }, { status: 400 })
    }

    // Find all bath items to get their images and product codes
    const bathItems = await BathItemModel.find({ _id: { $in: bathIds } })
    if (bathItems.length === 0) {
      return NextResponse.json({ success: false, message: "No bath items found" }, { status: 404 })
    }

    // Collect all images from all bath items
    const allImages: string[] = []
    const productCodes: string[] = []

    bathItems.forEach((item) => {
      if (item.images && item.images.length > 0) {
        allImages.push(...item.images)
      }
      productCodes.push(item.productCode)
    })

    // Delete images from Cloudinary
    if (allImages.length > 0) {
      await deleteMultipleCloudinaryImages(allImages)
    }

    // Delete bath items from database
    await BathItemModel.deleteMany({ _id: { $in: bathIds } })

    // Delete from stock manager
    const stockDeletePromises = productCodes.map((code) => deleteFromStockManager(code))
    await Promise.allSettled(stockDeletePromises)

    return NextResponse.json({
      success: true,
      message: `${bathItems.length} bath items and their associated images deleted successfully`,
      deletedCount: bathItems.length,
    })
  } catch (error: any) {
    console.error("Error bulk deleting bath items:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete bath items" },
      { status: 500 },
    )
  }
}
