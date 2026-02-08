export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { SliderModel } from "@/lib/models/sliderModel"
import { deleteMultipleCloudinaryImages } from "@/lib/utils/cloudinary-delete"

export async function POST(request: Request) {
  try {
    await dbConnect()
    const { sliderIds } = await request.json()

    if (!sliderIds || !Array.isArray(sliderIds) || sliderIds.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid slider IDs provided" }, { status: 400 })
    }

    // Find all sliders to get their image URLs
    const sliders = await SliderModel.find({ _id: { $in: sliderIds } })
    if (sliders.length === 0) {
      return NextResponse.json({ success: false, message: "No sliders found" }, { status: 404 })
    }

    // Collect all image URLs from all sliders
    const allImageUrls: string[] = []
    sliders.forEach((slider) => {
      if (slider.images && slider.images.length > 0) {
        allImageUrls.push(...slider.images)
      }
    })

    // Delete images from Cloudinary
    if (allImageUrls.length > 0) {
      await deleteMultipleCloudinaryImages(allImageUrls)
    }

    // Delete sliders from database
    await SliderModel.deleteMany({ _id: { $in: sliderIds } })

    return NextResponse.json({
      success: true,
      message: `${sliders.length} sliders and their associated images deleted successfully`,
      deletedCount: sliders.length,
    })
  } catch (error: any) {
    console.error("Error bulk deleting sliders:", error)
    return NextResponse.json({ success: false, message: error.message || "Failed to delete sliders" }, { status: 500 })
  }
}
