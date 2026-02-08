export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/lib/models/User"
import { dbConnect } from "@/lib/mongodb"


export async function POST(request: NextRequest) {
  try {
    const { email, currentPassword } = await request.json()

    if (!email || !currentPassword) {
      return NextResponse.json(
        {
          error: "Email and current password are required",
        },
        { status: 400 },
      )
    }

    await dbConnect()

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      )
    }

    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Current password is incorrect",
        },
        { status: 401 },
      )
    }

    return NextResponse.json(
      {
        message: "Current password is valid",
        valid: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Validate current password error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
