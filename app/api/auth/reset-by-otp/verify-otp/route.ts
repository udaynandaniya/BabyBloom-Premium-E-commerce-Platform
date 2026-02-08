
import { type NextRequest, NextResponse } from "next/server"

import OTP from "@/lib/models/OTP"
import { dbConnect } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()


    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    await dbConnect()

    const allOtpRecords = await OTP.find({ email })

    const otpRecord = await OTP.findOne({ email, otp })

    if (otpRecord) {
   
    }

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
