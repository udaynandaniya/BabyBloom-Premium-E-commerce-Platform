export const dynamic = 'force-dynamic';
// import { NextResponse } from "next/server"
// import { dbConnect } from "@/lib/mongodb"
// import { OrderModel } from "@/lib/models/order"

// export async function GET(request: Request) {
//   try {
//     await dbConnect()

//     const { searchParams } = new URL(request.url)
//     const page = Number.parseInt(searchParams.get("page") || "1")
//     const limit = Number.parseInt(searchParams.get("limit") || "20")
//     const status = searchParams.get("status")
//     const search = searchParams.get("search")
//     const sortBy = searchParams.get("sortBy") || "orderDate"
//     const sortOrder = searchParams.get("sortOrder") || "desc"

//     // Build filter query
//     const query: any = {}

//     if (status && status !== "all") {
//       query.status = status
//     }

//     if (search) {
//       query.$or = [
//         { orderNumber: { $regex: search, $options: "i" } },
//         { userEmail: { $regex: search, $options: "i" } },
//         { customerName: { $regex: search, $options: "i" } },
//         { customerPhone: { $regex: search, $options: "i" } },
//         { consignmentNumber: { $regex: search, $options: "i" } },
//       ]
//     }

//     // Build sort object
//     const sortObj: any = {}
//     sortObj[sortBy] = sortOrder === "desc" ? -1 : 1

//     // Execute query with pagination
//     const skip = (page - 1) * limit
//     const orders = await OrderModel.find(query).sort(sortObj).skip(skip).limit(limit).lean()

//     const total = await OrderModel.countDocuments(query)
//     const totalPages = Math.ceil(total / limit)

//     // Get order statistics
//     const stats = await OrderModel.aggregate([
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//           totalAmount: { $sum: "$totalAmount" },
//         },
//       },
//     ])

//     return NextResponse.json({
//       success: true,
//       data: orders,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages,
//         hasNext: page < totalPages,
//         hasPrev: page > 1,
//       },
//       stats,
//     })
//   } catch (error) {
//     console.error("Error fetching orders:", error)
//     return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
//   }
// }


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

    // Check if user is admin
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const orders = await OrderModel.find({}).sort({ orderDate: -1 }).lean()

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Error fetching admin orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
