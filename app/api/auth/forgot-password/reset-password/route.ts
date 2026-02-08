export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { dbConnect } from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Email and new password are required" },
        { status: 400 },
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    await dbConnect()



    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user's password
    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    )

    // Delete the OTP after successful password reset

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully! Please login with your new password.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
