export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import OrderModel from "@/lib/models/order"
import { getSession } from "@/lib/get-session"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get session using your auth system
    const session = await getSession(request)

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get email from query params or use authenticated user's email
    const { searchParams } = new URL(request.url)
    const requestedEmail = searchParams.get("email")

    // Ensure user can only access their own orders
    if (requestedEmail && requestedEmail !== session.email) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const userEmail = requestedEmail || session.email

    const orders = await OrderModel.find({ userEmail }).sort({ orderDate: -1 }).lean()

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
