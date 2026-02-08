export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/User"
import { decrypt } from "@/lib/auth"
import { dbConnect } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Check admin authentication
    const token = request.cookies.get("jwt-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const payload = await decrypt(token)
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ["$isVerified", 1, 0] } },
          adminUsers: { $sum: { $cond: ["$isAdmin", 1, 0] } },
          verifiedUsers: { $sum: { $cond: ["$isVerified", 1, 0] } },
        },
      },
    ])

    const result = stats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      verifiedUsers: 0,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
