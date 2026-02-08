export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import OrderModel from "@/lib/models/order"
import { getSession } from "@/lib/get-session"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Get session using your auth system
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user is admin
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 })
    }

    const validStatuses = ["pending", "accepted", "dispatched", "completed", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const order = await OrderModel.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Validate status transitions
    if (status === "dispatched" && !order.consignmentNumber) {
      return NextResponse.json({ error: "Consignment number is required before dispatching order" }, { status: 400 })
    }

    order.status = status
    order.updatedAt = new Date()
    await order.save()

    return NextResponse.json({ success: true, message: "Order status updated successfully" })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
