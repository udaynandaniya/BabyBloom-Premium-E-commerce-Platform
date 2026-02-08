export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import ToyModel from "@/lib/models/toy"
import { deleteFromStockManager } from "@/lib/utils/stock-sync"
import { deleteMultipleCloudinaryImages } from "@/lib/utils/cloudinary-delete"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { toyIds } = await request.json()

    if (!toyIds || !Array.isArray(toyIds) || toyIds.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid toy IDs provided" }, { status: 400 })
    }

    // Find all toys to get their images and product codes
    const toys = await ToyModel.find({ _id: { $in: toyIds } })

    if (toys.length === 0) {
      return NextResponse.json({ success: false, message: "No toys found" }, { status: 404 })
    }

    // Collect all images from all toys
    const allImages: string[] = []
    const productCodes: string[] = []

    toys.forEach((toy) => {
      if (toy.images && toy.images.length > 0) {
        allImages.push(...toy.images)
      }
      productCodes.push(toy.productCode)
    })

    // Delete images from Cloudinary
    if (allImages.length > 0) {
      await deleteMultipleCloudinaryImages(allImages)
    }

    // Delete toys from database
    await ToyModel.deleteMany({ _id: { $in: toyIds } })

    // Delete from stock manager
    const stockDeletePromises = productCodes.map((code) => deleteFromStockManager(code))
    await Promise.allSettled(stockDeletePromises)

    return NextResponse.json({
      success: true,
      message: `${toys.length} toys and their associated images deleted successfully`,
      deletedCount: toys.length,
    })
  } catch (error: any) {
    console.error("Error bulk deleting toys:", error)
    return NextResponse.json({ success: false, message: error.message || "Failed to delete toys" }, { status: 500 })
  }
}
