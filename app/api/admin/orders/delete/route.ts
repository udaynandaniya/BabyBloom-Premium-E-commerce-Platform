export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import OrderModel from "@/lib/models/order"
import { getSession } from "@/lib/get-session"

export async function DELETE(request: NextRequest) {
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

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const order = await OrderModel.findById(orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Only allow deletion of rejected or completed orders
    if (order.status !== "rejected" && order.status !== "completed") {
      return NextResponse.json(
        {
          error: "Only rejected or completed orders can be deleted",
          currentStatus: order.status,
        },
        { status: 400 },
      )
    }

    // Delete the order
    await OrderModel.findByIdAndDelete(orderId)

    return NextResponse.json({
      success: true,
      message: `Order #${order.orderNumber} has been permanently deleted`,
    })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
