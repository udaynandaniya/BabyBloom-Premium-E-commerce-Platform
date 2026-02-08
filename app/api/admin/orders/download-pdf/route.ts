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

    // Check if user is admin
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get filter parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const minAmount = searchParams.get("minAmount")
    const maxAmount = searchParams.get("maxAmount")
    const state = searchParams.get("state")
    const district = searchParams.get("district")
    const search = searchParams.get("search")

    // Build query
    const query: any = {}

    if (status && status !== "all") {
      query.status = status
    }

    if (dateFrom || dateTo) {
      query.orderDate = {}
      if (dateFrom) query.orderDate.$gte = new Date(dateFrom)
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        query.orderDate.$lte = endDate
      }
    }

    if (minAmount || maxAmount) {
      query.totalAmount = {}
      if (minAmount) query.totalAmount.$gte = Number.parseFloat(minAmount)
      if (maxAmount) query.totalAmount.$lte = Number.parseFloat(maxAmount)
    }

    if (state && state !== "all") {
      query["deliveryAddress.state"] = state
    }

    if (district && district !== "all") {
      query["deliveryAddress.district"] = district
    }

    if (search) {
      const searchRegex = new RegExp(search, "i")
      query.$or = [
        { orderNumber: searchRegex },
        { customerName: searchRegex },
        { userEmail: searchRegex },
        { customerPhone: searchRegex },
        { consignmentNumber: searchRegex },
        { "items.name": searchRegex },
        { "items.productCode": searchRegex },
      ]
    }

    const orders = await OrderModel.find(query).sort({ orderDate: -1 }).lean()

    if (orders.length === 0) {
      return NextResponse.json({ error: "No orders found matching the criteria" }, { status: 404 })
    }

    // Create CSV content instead of PDF
    const csvContent = generateCSVReport(orders, {
      status,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount,
      state,
      district,
      search,
    })

    // Generate filename
    const dateStr = new Date().toISOString().split("T")[0]
    const statusStr = status && status !== "all" ? `_${status}` : ""
    const filename = `Orders_Report_${dateStr}${statusStr}.csv`

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error generating orders report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}

function generateCSVReport(orders: any[], filters: any) {
  const reportDate = new Date().toLocaleDateString("en-IN")
  const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  let csv = "MAHADEV BABY SHOP - ORDERS REPORT\n"
  csv += `Generated on: ${reportDate}\n`
  csv += `Total Orders: ${orders.length}\n`
  csv += `Total Value: ₹${totalValue.toLocaleString()}\n\n`

  // Add filter information
  if (filters.status && filters.status !== "all") {
    csv += `Status Filter: ${filters.status}\n`
  }
  if (filters.dateFrom || filters.dateTo) {
    const dateRange = `${filters.dateFrom ? new Date(filters.dateFrom).toLocaleDateString("en-IN") : "Start"} - ${filters.dateTo ? new Date(filters.dateTo).toLocaleDateString("en-IN") : "End"}`
    csv += `Date Range: ${dateRange}\n`
  }
  if (filters.state && filters.state !== "all") {
    csv += `State Filter: ${filters.state}\n`
  }
  if (filters.district && filters.district !== "all") {
    csv += `District Filter: ${filters.district}\n`
  }

  csv += "\n"

  // CSV Headers
  csv +=
    "Order Number,Date,Customer Name,Phone,Email,Status,Items Count,Subtotal,Delivery Charge,Total Amount,State,District,Village,Consignment Number\n"

  // CSV Data
  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate).toLocaleDateString("en-IN")
    const itemsCount = order.items.length
    const consignmentNumber = order.consignmentNumber || "Not Assigned"

    // Escape commas and quotes in text fields
    const escapeCsvField = (field: string) => {
      if (field.includes(",") || field.includes('"') || field.includes("\n")) {
        return `"${field.replace(/"/g, '""')}"`
      }
      return field
    }

    csv +=
      [
        escapeCsvField(order.orderNumber),
        orderDate,
        escapeCsvField(order.customerName),
        order.customerPhone,
        escapeCsvField(order.userEmail),
        order.status.toUpperCase(),
        itemsCount,
        order.subtotal,
        order.deliveryCharge,
        order.totalAmount,
        escapeCsvField(order.deliveryAddress.state),
        escapeCsvField(order.deliveryAddress.district),
        escapeCsvField(order.deliveryAddress.village),
        escapeCsvField(consignmentNumber),
      ].join(",") + "\n"
  })

  csv += "\n\nDETAILED ORDER ITEMS:\n"
  csv += "Order Number,Product Code,Product Name,Quantity,Price,Total\n"

  orders.forEach((order) => {
    order.items.forEach((item: any) => {
      const escapeCsvField = (field: string) => {
        if (field.includes(",") || field.includes('"') || field.includes("\n")) {
          return `"${field.replace(/"/g, '""')}"`
        }
        return field
      }

      csv +=
        [
          escapeCsvField(order.orderNumber),
          escapeCsvField(item.productCode),
          escapeCsvField(item.name),
          item.quantity,
          item.priceAtOrder,
          item.quantity * item.priceAtOrder,
        ].join(",") + "\n"
    })
  })

  return csv
}
