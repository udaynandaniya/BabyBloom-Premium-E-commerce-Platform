export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email }).select("email isVerified")

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
    console.error("Check email error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
