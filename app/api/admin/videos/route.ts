export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { VideoModel } from "@/lib/models/videoModel"
import { videoSchema } from "@/lib/validations/video-schema"

export async function GET() {
  try {
    await dbConnect()
    const videos = await VideoModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json({
      success: true,
      data: videos,
      total: videos.length,
    })
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const data = await request.json()

    // Validate with Zod schema
    const validatedData = videoSchema.parse(data)

    // Check product code uniqueness
    const existingVideo = await VideoModel.findOne({ productCode: validatedData.productCode })
    if (existingVideo) {
      return NextResponse.json({ success: false, message: "Product code already exists" }, { status: 400 })
    }

    // Create new video
    const newVideo = new VideoModel(validatedData)
    await newVideo.save()

    return NextResponse.json({
      success: true,
      data: newVideo,
      message: "Video added successfully",
    })
  } catch (error: any) {
    console.error("Error adding video:", error)
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
    return NextResponse.json({ success: false, message: error.message || "Failed to add video" }, { status: 500 })
  }
}
