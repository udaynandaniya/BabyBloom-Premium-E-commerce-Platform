export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"

import { createOtp } from "@/lib/verification/createOtp"
import { sendEmailToStakeholder } from "@/lib/verification/sendEmailToStakeholder"
import { dbConnect } from "@/lib/mongodb"
import User from "@/lib/models/User"
User

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    await dbConnect()

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: "No account found with this email address" }, { status: 404 })
    }

    // Generate and save OTP
    const otp = await createOtp(email)

    // Send OTP via email
    const emailResult = await sendEmailToStakeholder(email, otp, "password-reset")
    if (!emailResult.success) {
      return NextResponse.json({ success: false, message: "Failed to send OTP email" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password reset code sent to your email",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
