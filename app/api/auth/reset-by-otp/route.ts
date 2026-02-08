export const dynamic = 'force-dynamic';


//app/api/auth/reset-by-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import User from "@/lib/models/User"
import { dbConnect } from "@/lib/mongodb"

dbConnect()
export async function POST(req: NextRequest) {
  const { email, oldPassword, newPassword } = await req.json()
  const user = await User.findOne({ email })
  if (!user) return NextResponse.json({ error: "Email not found. Please register." }, { status: 404 })

  const match = await bcryptjs.compare(oldPassword, user.password)
  if (!match) return NextResponse.json({ error: "Old password is wrong" }, { status: 400 })

  user.password = await bcryptjs.hash(newPassword, await bcryptjs.genSalt(10))
  await user.save()

  return NextResponse.json({ message: "Password reset successfully" })
}
