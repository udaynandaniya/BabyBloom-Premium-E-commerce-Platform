export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { NewbornItemModel } from "@/lib/models/newborn"
import { deleteFromStockManager } from "@/lib/utils/stock-sync"
import { deleteMultipleCloudinaryImages } from "@/lib/utils/cloudinary-delete"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { newbornIds } = await request.json()

    if (!newbornIds || !Array.isArray(newbornIds) || newbornIds.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid newborn item IDs provided" }, { status: 400 })
    }

    // Find all newborn items to get their images and product codes
    const newbornItems = await NewbornItemModel.find({ _id: { $in: newbornIds } })
    if (newbornItems.length === 0) {
      return NextResponse.json({ success: false, message: "No newborn items found" }, { status: 404 })
    }

    // Collect all images from all newborn items
    const allImages: string[] = []
    const productCodes: string[] = []

    newbornItems.forEach((item) => {
      if (item.images && item.images.length > 0) {
        allImages.push(...item.images)
      }
      productCodes.push(item.productCode)
    })

    // Delete images from Cloudinary
    if (allImages.length > 0) {
      await deleteMultipleCloudinaryImages(allImages)
    }

    // Delete newborn items from database
    await NewbornItemModel.deleteMany({ _id: { $in: newbornIds } })

    // Delete from stock manager
    const stockDeletePromises = productCodes.map((code) => deleteFromStockManager(code))
    await Promise.allSettled(stockDeletePromises)

    return NextResponse.json({
      success: true,
      message: `${newbornItems.length} newborn items and their associated images deleted successfully`,
      deletedCount: newbornItems.length,
    })
  } catch (error: any) {
    console.error("Error bulk deleting newborn items:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete newborn items" },
      { status: 500 },
    )
  }
}
