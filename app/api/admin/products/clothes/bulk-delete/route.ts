export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { ClothesModel } from "@/lib/models/clothes"
import { deleteFromStockManager } from "@/lib/utils/stock-sync"
import { deleteMultipleCloudinaryImages } from "@/lib/utils/cloudinary-delete"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { clothesIds } = await request.json()

    if (!clothesIds || !Array.isArray(clothesIds) || clothesIds.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid clothes IDs provided" }, { status: 400 })
    }

    // Find all clothes items to get their images and product codes
    const clothesItems = await ClothesModel.find({ _id: { $in: clothesIds } })

    if (clothesItems.length === 0) {
      return NextResponse.json({ success: false, message: "No clothes items found" }, { status: 404 })
    }

    // Collect all images from all clothes items
    const allImages: string[] = []
    const productCodes: string[] = []

    clothesItems.forEach((item) => {
      if (item.images && item.images.length > 0) {
        allImages.push(...item.images)
      }
      productCodes.push(item.productCode)
    })

    // Delete images from Cloudinary
    if (allImages.length > 0) {
      await deleteMultipleCloudinaryImages(allImages)
    }

    // Delete clothes items from database
    await ClothesModel.deleteMany({ _id: { $in: clothesIds } })

    // Delete from stock manager
    const stockDeletePromises = productCodes.map((code) => deleteFromStockManager(code))
    await Promise.allSettled(stockDeletePromises)

    return NextResponse.json({
      success: true,
      message: `${clothesItems.length} clothes items and their associated images deleted successfully`,
      deletedCount: clothesItems.length,
    })
  } catch (error: any) {
    console.error("Error bulk deleting clothes:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete clothes items" },
      { status: 500 },
    )
  }
}
