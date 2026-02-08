export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { VideoModel } from "@/lib/models/videoModel"
import { dbConnect } from "@/lib/mongodb"

export async function GET() {
  try {
    await dbConnect()

    const videos = await VideoModel.find({})
      .select("name productCode videoUrl sellingPrice actualPrice description createdAt")
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: videos,
    })
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch videos" }, { status: 500 })
  }
}
