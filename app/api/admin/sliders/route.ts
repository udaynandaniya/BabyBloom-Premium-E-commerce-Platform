export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { SliderModel } from "@/lib/models/sliderModel"
import { sliderSchema } from "@/lib/validations/slider-schema"

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const groupName = searchParams.get("groupName")

    let query = {}
    if (groupName) {
      query = { groupName }
    }

    const sliders = await SliderModel.find(query).sort({ order: 1, createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: sliders,
      total: sliders.length,
    })
  } catch (error) {
    console.error("Error fetching sliders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch sliders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()

    // Validate with Zod schema
    const validatedData = sliderSchema.parse(data)

    // Create new slider
    const newSlider = new SliderModel(validatedData)
    await newSlider.save()

    return NextResponse.json({
      success: true,
      data: newSlider,
      message: "Slider image added successfully",
    })
  } catch (error: any) {
    console.error("Error adding slider:", error)
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
    return NextResponse.json({ success: false, message: error.message || "Failed to add slider" }, { status: 500 })
  }
}
