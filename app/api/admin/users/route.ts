export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/User"
import OrderModel from "@/lib/models/order"
import { decrypt } from "@/lib/auth"
import { dbConnect } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const token = request.cookies.get("jwt-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const payload = await decrypt(token)
    if (!payload || !payload.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const users = await User.find({}).select("-password").sort({ createdAt: -1 }).lean()

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await OrderModel.find({ userEmail: user.email }).lean()
        const totalOrders = orders.length
        const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

        return {
          ...user,
          _id: user._id.toString(),
          role: user.isAdmin ? "admin" : "user", 
          isActive: user.isVerified, // Use isVerified as active status
          totalOrders,
          totalSpent,
        }
      }),
    )

    return NextResponse.json(usersWithStats)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
