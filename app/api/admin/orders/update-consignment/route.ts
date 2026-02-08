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

    const { orderId, consignmentNumber } = await request.json()

    if (!orderId || !consignmentNumber) {
      return NextResponse.json({ error: "Order ID and consignment number are required" }, { status: 400 })
    }

    const order = await OrderModel.findById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    order.consignmentNumber = consignmentNumber.trim()
    order.updatedAt = new Date()
    await order.save()

    return NextResponse.json({ success: true, message: "Consignment number updated successfully" })
  } catch (error) {
    console.error("Error updating consignment number:", error)
    return NextResponse.json({ error: "Failed to update consignment number" }, { status: 500 })
  }
}
