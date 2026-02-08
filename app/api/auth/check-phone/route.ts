export const dynamic = 'force-dynamic';
import { dbConnect } from "@/lib/mongodb"
import User from "@/lib/models/User"
import { type NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ success: false, message: "Phone number is required" }, { status: 400 })
    }

    const existingUser = await User.findOne({ phone }).select("phone isVerified")

    if (existingUser) {
      return NextResponse.json({
        success: true,
        exists: true,
        isVerified: existingUser.isVerified,
      })
    }

    return NextResponse.json({
      success: true,
      exists: false,
      isVerified: false,
    })
  } catch (error) {
    console.error("Check phone error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
