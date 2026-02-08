export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { verifyOtp } from "@/lib/verification/verifyOtp"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    const result = await verifyOtp(email, otp)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
