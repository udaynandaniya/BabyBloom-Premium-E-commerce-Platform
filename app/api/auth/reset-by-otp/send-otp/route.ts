export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/User"
import { dbConnect } from "@/lib/mongodb"
import { createOtp } from "@/lib/verification/createOtp"
import { sendEmailToStakeholder } from "@/lib/verification/sendEmailToStakeholder"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await dbConnect()

    // Only check User collection
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "No user found with this email address" }, { status: 404 })
    }

    // Generate OTP for the "user" role
    const otp = await createOtp(email, "user")

    // Send OTP via email
    const emailResult = await sendEmailToStakeholder(email, otp, "user")

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "OTP sent successfully to your email",
        role: "user",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
