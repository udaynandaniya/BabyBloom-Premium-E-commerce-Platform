export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { uploadFile } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Upload file
    const filePath = await uploadFile(file, folder)

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        filePath,
        fileSize: file.size,
        fileType: file.type,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "File upload failed" }, { status: 500 })
  }
}
