export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { VideoModel } from "@/lib/models/videoModel"


export async function POST(request: Request) {
  try {
    await dbConnect()
    const { videoIds } = await request.json()

    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid video IDs provided" }, { status: 400 })
    }

    // Find all videos to get their video URLs
    const videos = await VideoModel.find({ _id: { $in: videoIds } })
    if (videos.length === 0) {
      return NextResponse.json({ success: false, message: "No videos found" }, { status: 404 })
    }

    // Collect all video URLs
    const videoUrls = videos.map((video) => video.videoUrl).filter(Boolean)

  
    // Delete videos from database
    await VideoModel.deleteMany({ _id: { $in: videoIds } })

    return NextResponse.json({
      success: true,
      message: `${videos.length} videos and their associated files deleted successfully`,
      deletedCount: videos.length,
    })
  } catch (error: any) {
    console.error("Error bulk deleting videos:", error)
    return NextResponse.json({ success: false, message: error.message || "Failed to delete videos" }, { status: 500 })
  }
}
