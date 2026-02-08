import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import OTP from "@/lib/models/OTP"
import User from "@/lib/models/User"
import { dbConnect } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

  
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP, and new password are required" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    await dbConnect()

    const allOtpRecords = await OTP.find({ email })

    const totalOtpRecords = await OTP.countDocuments()

    const otpRecord = await OTP.findOne({ email, otp })

  
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    let updateResult = null
    const userRole = otpRecord.role

    try {
      if (userRole === "user") {
        updateResult = await User.findOneAndUpdate(
          { email },
          { password: hashedPassword, updatedAt: new Date() },
          { new: true },
        )
      } else if (userRole === "doctor") {
        updateResult = await Doctor.findOneAndUpdate(
          { email },
          { password: hashedPassword, updatedAt: new Date() },
          { new: true },
        )
      } else if (userRole === "hospital") {
        updateResult = await Hospital.findOneAndUpdate(
          { email },
          { password: hashedPassword, updatedAt: new Date() },
          { new: true },
        )
      }

    } catch (updateError) {
      console.error("❌ Update error:", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    if (!updateResult) {
      return NextResponse.json({ error: "User not found or password update failed" }, { status: 404 })
    }

    try {
      await OTP.deleteOne({ _id: otpRecord._id })
    } catch (deleteError) {
      console.error("⚠️ Failed to delete OTP:", deleteError)
    }

    return NextResponse.json(
      {
        message: "Password reset successfully! Please login with your new password.",
        role: userRole,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("💥 Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
