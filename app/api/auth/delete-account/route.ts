export const dynamic = 'force-dynamic';
//C:\Users\UDAYN\Downloads\Projects\mahadev-baby - Copy\app\api\auth\delete-account\route.ts

import { NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"
import { dbConnect } from "@/lib/mongodb"


export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json()

    await dbConnect()

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 })
    }

    // Optional: Add OTP/email verification here if needed

    await User.deleteOne({ _id: user._id })

    const response = NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    })

    // Clear jwt-token cookie (uses same structure across project)
    response.cookies.set("jwt-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 })
  }
}
