export const dynamic = 'force-dynamic';
// app/api/auth/reset-by-old/route.ts

import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/lib/models/User"
import { dbConnect } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body = await request.json()
    const { email, oldPassword, newPassword } = body

    // Validate input
    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Email, old password, and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    if (oldPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from the old password" },
        { status: 400 }
      )
    }

    await dbConnect()

    // Case-insensitive email match
    const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") })

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      )
    }

    // Validate old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      )
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    user.password = hashedNewPassword
    user.updatedAt = new Date()
    await user.save()

    return NextResponse.json(
      {
        message: "Password updated successfully! Please login with your new password.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("💥 Reset password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
