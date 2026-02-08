export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { dbConnect } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { encrypt } from "@/lib/auth" // should use jose
import type { SessionPayload } from "@/lib/auth"
import User from "@/lib/models/User"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("[LOGIN] Received request:", { email: body.email })

    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    await dbConnect()

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email }, { phone: email }],
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your account first" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    const sessionPayload: SessionPayload = {
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      name: user.name,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    }

    // Encrypt session payload using jose
    const jwt = await encrypt(sessionPayload)

    const response = NextResponse.json(
      {
        success: true,
        message: `Welcome back, ${user.name}!`,
        user: sessionPayload,
      },
      { status: 200 }
    )

    // Set cookie with JWT
    response.cookies.set("jwt-token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("[LOGIN] Error:", error)
    return NextResponse.json(
      { success: false, message: "Login failed. Please try again." },
      { status: 500 }
    )
  }
}
