export const dynamic = 'force-dynamic';
//C:\Users\UDAYN\Downloads\Projects\mahadev-baby - Copy\app\api\auth\send-otp\route.ts
import { type NextRequest, NextResponse } from "next/server"

import { sendEmailToStakeholder } from "@/lib/verification/sendEmailToStakeholder"
import { dbConnect } from "@/lib/mongodb"
import { createOtp } from "@/lib/verification/createOtp"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { email } = await request.json()



    // Generate and send OTP
    const otp = await createOtp(email)
    const emailResult = await sendEmailToStakeholder(email, otp)

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send OTP",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
