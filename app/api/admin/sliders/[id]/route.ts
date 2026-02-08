
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { SliderModel } from "@/lib/models/sliderModel"
import { sliderSchema } from "@/lib/validations/slider-schema"
import { deleteCloudinaryImage } from "@/lib/utils/cloudinary-delete"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const data = await request.json()

    // Validate with Zod schema
    const validatedData = sliderSchema.parse(data)

    // Find existing slider
    const existingSlider = await SliderModel.findById(params.id)
    if (!existingSlider) {
      return NextResponse.json({ success: false, message: "Slider not found" }, { status: 404 })
    }

    // Update slider
    const updatedSlider = await SliderModel.findByIdAndUpdate(params.id, validatedData, {
      new: true,
      runValidators: true,
    })

    if (!updatedSlider) {
      return NextResponse.json({ success: false, message: "Failed to update slider" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: updatedSlider,
      message: "Slider updated successfully",
    })
  } catch (error: any) {
    console.error("Error updating slider:", error)
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
    return NextResponse.json({ success: false, message: error.message || "Failed to update slider" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Find the slider to get image URLs before deletion
    const slider = await SliderModel.findById(params.id)
    if (!slider) {
      return NextResponse.json({ success: false, message: "Slider not found" }, { status: 404 })
    }

    // Delete images from Cloudinary
    if (slider.images && slider.images.length > 0) {
      const deletePromises = slider.images.map(deleteCloudinaryImage)
      await Promise.allSettled(deletePromises)
    }

    // Delete slider from database
    await SliderModel.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: "Slider and associated images deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting slider:", error)
    return NextResponse.json({ success: false, message: error.message || "Failed to delete slider" }, { status: 500 })
  }
}
