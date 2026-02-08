export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import User from "@/lib/models/User"
import OrderModel from "@/lib/models/order"
import { decrypt } from "@/lib/auth"
import { dbConnect } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get token from cookies
    const token = request.cookies.get("jwt-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Decrypt token
    const payload = await decrypt(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Find user
    const user = await User.findById(payload.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check for pending/accepted orders
    const pendingOrders = await OrderModel.find({
      userEmail: user.email,
      status: { $in: ["pending", "accepted", "dispatched"] },
    }).select("orderNumber status totalAmount orderDate")

    const canModifyAccount = pendingOrders.length === 0

    return NextResponse.json({
      success: true,
      data: {
        canModifyAccount,
        pendingOrders: pendingOrders.map((order) => ({
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          orderDate: order.orderDate,
        })),
      },
    })
  } catch (error) {
    console.error("Check orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
