export const dynamic = 'force-dynamic';
// // // // // import { type NextRequest, NextResponse } from "next/server"
// // // // // import { dbConnect } from "@/lib/mongodb"
// // // // // import OrderModel from "@/lib/models/order"
// // // // // import PDFDocument from "pdfkit"

// // // // // export async function POST(request: NextRequest) {
// // // // //   try {
// // // // //     await dbConnect()

// // // // //     const { orderId } = await request.json()

// // // // //     if (!orderId) {
// // // // //       return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
// // // // //     }

// // // // //     const order = await OrderModel.findById(orderId)

// // // // //     if (!order) {
// // // // //       return NextResponse.json({ error: "Order not found" }, { status: 404 })
// // // // //     }

// // // // //     if (order.status !== "completed") {
// // // // //       return NextResponse.json(
// // // // //         {
// // // // //           error: "Invoice is only available for completed orders. Please wait for admin to complete your order.",
// // // // //           status: order.status,
// // // // //         },
// // // // //         { status: 400 },
// // // // //       )
// // // // //     }

// // // // //     // Add order completion date if available
// // // // //     const completionDate =
// // // // //       order.updatedAt && order.status === "completed"
// // // // //         ? new Date(order.updatedAt).toLocaleDateString("en-IN")
// // // // //         : "Processing"

// // // // //     // Create PDF
// // // // //     const doc = new PDFDocument({ margin: 50, size: "A4" })
// // // // //     const chunks: Buffer[] = []

// // // // //     doc.on("data", (chunk) => chunks.push(chunk))

// // // // //     const pdfPromise = new Promise<Buffer>((resolve) => {
// // // // //       doc.on("end", () => resolve(Buffer.concat(chunks)))
// // // // //     })

// // // // //     // Shop Header with Logo Space
// // // // //     doc.fontSize(28).fillColor("#e91e63").text("MAHADEV BABY SHOP", 50, 50, { align: "center" })
// // // // //     doc
// // // // //       .fontSize(14)
// // // // //       .fillColor("#333")
// // // // //       .text("Professional Baby Care Products & Accessories", 50, 85, { align: "center" })

// // // // //     // Shop Owner & Contact Information
// // // // //     doc.fontSize(12).fillColor("#666")
// // // // //     doc.text("Owner: Divyesh Nanadaniya", 50, 120)
// // // // //     doc.text("Mobile: +91 99137 37023 | +91 98988 93380", 50, 135)
// // // // //     doc.text("Email: mahadevbabyshop5@gmail.com", 50, 150)
// // // // //     doc.text("WhatsApp: +91 99137 37023", 50, 165)
// // // // //     doc.text("Address: Vithalani Complex, Mangrol, Gujarat", 50, 180)

// // // // //     // Invoice Details Box
// // // // //     doc.rect(400, 120, 150, 80).stroke()
// // // // //     doc.fontSize(16).fillColor("#e91e63").text("INVOICE", 410, 130)
// // // // //     doc.fontSize(11).fillColor("#000")
// // // // //     doc.text(`Invoice #: ${order.orderNumber}`, 410, 150)
// // // // //     doc.text(
// // // // //       `Date: ${new Date(order.orderDate).toLocaleDateString("en-IN", {
// // // // //         day: "2-digit",
// // // // //         month: "2-digit",
// // // // //         year: "numeric",
// // // // //       })}`,
// // // // //       410,
// // // // //       165,
// // // // //     )
// // // // //     doc.text(`Status: ${order.status.toUpperCase()}`, 410, 180)

// // // // //     // Horizontal line separator
// // // // //     doc.moveTo(50, 220).lineTo(550, 220).stroke()

// // // // //     // Customer & Delivery Information
// // // // //     let yPos = 240
// // // // //     doc.fontSize(14).fillColor("#e91e63").text("BILL TO:", 50, yPos)
// // // // //     doc.fontSize(12).fillColor("#000")
// // // // //     doc.text(order.customerName, 50, yPos + 20)
// // // // //     doc.text(`Phone: ${order.customerPhone}`, 50, yPos + 35)
// // // // //     doc.text(`Email: ${order.userEmail}`, 50, yPos + 50)

// // // // //     doc.fontSize(14).fillColor("#e91e63").text("DELIVER TO:", 300, yPos)
// // // // //     doc.fontSize(12).fillColor("#000")
// // // // //     doc.text(order.deliveryAddress.street, 300, yPos + 20)
// // // // //     doc.text(order.deliveryAddress.area, 300, yPos + 35)
// // // // //     doc.text(`${order.deliveryAddress.village}, ${order.deliveryAddress.subDistrict}`, 300, yPos + 50)
// // // // //     doc.text(`${order.deliveryAddress.district}, ${order.deliveryAddress.state}`, 300, yPos + 65)
// // // // //     doc.text(`PIN: ${order.deliveryAddress.pincode}`, 300, yPos + 80)

// // // // //     // Items Table
// // // // //     yPos = 350
// // // // //     doc.fontSize(12).fillColor("#fff")
// // // // //     doc.rect(50, yPos, 500, 25).fill("#e91e63")
// // // // //     doc.text("Product Code", 60, yPos + 8)
// // // // //     doc.text("Product Name", 160, yPos + 8)
// // // // //     doc.text("Qty", 350, yPos + 8)
// // // // //     doc.text("Rate (₹)", 400, yPos + 8)
// // // // //     doc.text("Amount (₹)", 470, yPos + 8)

// // // // //     yPos += 25
// // // // //     let totalItems = 0
// // // // //     let totalWeight = 0

// // // // //     order.items.forEach((item, index) => {
// // // // //       const bgColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff"
// // // // //       doc.rect(50, yPos, 500, 20).fill(bgColor)

// // // // //       doc.fontSize(10).fillColor("#000")
// // // // //       doc.text(item.productCode, 60, yPos + 6)
// // // // //       doc.text(item.name.substring(0, 20) + (item.name.length > 20 ? "..." : ""), 160, yPos + 6)
// // // // //       doc.text(item.quantity.toString(), 360, yPos + 6)
// // // // //       doc.text(item.priceAtOrder.toString(), 410, yPos + 6)
// // // // //       doc.text((item.priceAtOrder * item.quantity).toString(), 480, yPos + 6)

// // // // //       totalItems += item.quantity
// // // // //       totalWeight += item.weightInGrams * item.quantity
// // // // //       yPos += 20
// // // // //     })

// // // // //     // Summary Section
// // // // //     yPos += 20
// // // // //     doc.rect(350, yPos, 200, 120).stroke()

// // // // //     doc.fontSize(12).fillColor("#000")
// // // // //     doc.text("ORDER SUMMARY", 360, yPos + 10)
// // // // //     doc
// // // // //       .moveTo(350, yPos + 25)
// // // // //       .lineTo(550, yPos + 25)
// // // // //       .stroke()

// // // // //     doc.fontSize(11)
// // // // //     doc.text(`Total Items: ${totalItems}`, 360, yPos + 35)
// // // // //     doc.text(`Total Weight: ${Math.ceil(totalWeight / 1000)}kg`, 360, yPos + 50)
// // // // //     doc.text(`Subtotal: ₹${order.subtotal}`, 360, yPos + 65)
// // // // //     doc.text(`Delivery Charge: ₹${order.deliveryCharge}`, 360, yPos + 80)

// // // // //     doc
// // // // //       .moveTo(350, yPos + 95)
// // // // //       .lineTo(550, yPos + 95)
// // // // //       .stroke()
// // // // //     doc.fontSize(14).fillColor("#e91e63")
// // // // //     doc.text(`TOTAL: ₹${order.totalAmount}`, 360, yPos + 105)

// // // // //     // Tracking Information
// // // // //     if (order.consignmentNumber) {
// // // // //       yPos += 140
// // // // //       doc.fontSize(12).fillColor("#000")
// // // // //       doc.text("TRACKING INFORMATION:", 50, yPos)
// // // // //       doc.fontSize(11).fillColor("#666")
// // // // //       doc.text(`Consignment Number: ${order.consignmentNumber}`, 50, yPos + 15)
// // // // //     }

// // // // //     // Footer
// // // // //     yPos += 60
// // // // //     doc.fontSize(10).fillColor("#666")
// // // // //     doc.text("Thank you for choosing Mahadev Baby Shop!", 50, yPos, { align: "center" })
// // // // //     doc.text("For any queries, WhatsApp us at +91 99137 37023", 50, yPos + 15, { align: "center" })
// // // // //     doc.text("Email: mahadevbabyshop5@gmail.com", 50, yPos + 30, { align: "center" })

// // // // //     yPos += 50
// // // // //     doc.fontSize(8).fillColor("#999")
// // // // //     doc.text("This is a computer generated invoice and does not require signature.", 50, yPos, { align: "center" })
// // // // //     doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 50, yPos + 12, { align: "center" })

// // // // //     doc.end()

// // // // //     const pdfBuffer = await pdfPromise

// // // // //     return new NextResponse(pdfBuffer, {
// // // // //       headers: {
// // // // //         "Content-Type": "application/pdf",
// // // // //         "Content-Disposition": `attachment; filename="Invoice-${order.orderNumber}.pdf"`,
// // // // //       },
// // // // //     })
// // // // //   } catch (error) {
// // // // //     console.error("Error generating invoice:", error)
// // // // //     return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
// // // // //   }
// // // // // }

// // // // import { type NextRequest, NextResponse } from "next/server"
// // // // import { dbConnect } from "@/lib/mongodb"
// // // // import OrderModel from "@/lib/models/order"
// // // // import { getSession } from "@/lib/get-session"
// // // // import PDFDocument from "pdfkit"

// // // // export async function POST(request: NextRequest) {
// // // //   try {
// // // //     await dbConnect()

// // // //     // Get session using your auth system
// // // //     const session = await getSession(request)

// // // //     if (!session) {
// // // //       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
// // // //     }

// // // //     const { orderId } = await request.json()

// // // //     if (!orderId) {
// // // //       return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
// // // //     }

// // // //     const order = await OrderModel.findById(orderId)

// // // //     if (!order) {
// // // //       return NextResponse.json({ error: "Order not found" }, { status: 404 })
// // // //     }

// // // //     // Ensure user can only download their own invoices
// // // //     if (order.userEmail !== session.email) {
// // // //       return NextResponse.json({ error: "Access denied" }, { status: 403 })
// // // //     }

// // // //     if (order.status !== "completed") {
// // // //       return NextResponse.json(
// // // //         {
// // // //           error: "Invoice is only available for completed orders. Please wait for admin to complete your order.",
// // // //           status: order.status,
// // // //         },
// // // //         { status: 400 },
// // // //       )
// // // //     }

// // // //     // Create PDF
// // // //     const doc = new PDFDocument({ margin: 50, size: "A4" })
// // // //     const chunks: Buffer[] = []

// // // //     doc.on("data", (chunk) => chunks.push(chunk))

// // // //     const pdfPromise = new Promise<Buffer>((resolve) => {
// // // //       doc.on("end", () => resolve(Buffer.concat(chunks)))
// // // //     })

// // // //     // Shop Header with Logo Space
// // // //     doc.fontSize(28).fillColor("#e91e63").text("MAHADEV BABY SHOP", 50, 50, { align: "center" })
// // // //     doc
// // // //       .fontSize(14)
// // // //       .fillColor("#333")
// // // //       .text("Professional Baby Care Products & Accessories", 50, 85, { align: "center" })

// // // //     // Shop Owner & Contact Information
// // // //     doc.fontSize(12).fillColor("#666")
// // // //     doc.text("Owner: Divyesh Nanadaniya", 50, 120)
// // // //     doc.text("Mobile: +91 99137 37023 | +91 98988 93380", 50, 135)
// // // //     doc.text("Email: mahadevbabyshop5@gmail.com", 50, 150)
// // // //     doc.text("WhatsApp: +91 99137 37023", 50, 165)
// // // //     doc.text("Address: Vithalani Complex, Mangrol, Gujarat", 50, 180)

// // // //     // Invoice Details Box
// // // //     doc.rect(400, 120, 150, 80).stroke()
// // // //     doc.fontSize(16).fillColor("#e91e63").text("INVOICE", 410, 130)
// // // //     doc.fontSize(11).fillColor("#000")
// // // //     doc.text(`Invoice #: ${order.orderNumber}`, 410, 150)
// // // //     doc.text(
// // // //       `Date: ${new Date(order.orderDate).toLocaleDateString("en-IN", {
// // // //         day: "2-digit",
// // // //         month: "2-digit",
// // // //         year: "numeric",
// // // //       })}`,
// // // //       410,
// // // //       165,
// // // //     )
// // // //     doc.text(`Status: ${order.status.toUpperCase()}`, 410, 180)

// // // //     // Horizontal line separator
// // // //     doc.moveTo(50, 220).lineTo(550, 220).stroke()

// // // //     // Customer & Delivery Information
// // // //     let yPos = 240
// // // //     doc.fontSize(14).fillColor("#e91e63").text("BILL TO:", 50, yPos)
// // // //     doc.fontSize(12).fillColor("#000")
// // // //     doc.text(order.customerName, 50, yPos + 20)
// // // //     doc.text(`Phone: ${order.customerPhone}`, 50, yPos + 35)
// // // //     doc.text(`Email: ${order.userEmail}`, 50, yPos + 50)

// // // //     doc.fontSize(14).fillColor("#e91e63").text("DELIVER TO:", 300, yPos)
// // // //     doc.fontSize(12).fillColor("#000")
// // // //     doc.text(order.deliveryAddress.street, 300, yPos + 20)
// // // //     doc.text(order.deliveryAddress.area, 300, yPos + 35)
// // // //     doc.text(`${order.deliveryAddress.village}, ${order.deliveryAddress.subDistrict}`, 300, yPos + 50)
// // // //     doc.text(`${order.deliveryAddress.district}, ${order.deliveryAddress.state}`, 300, yPos + 65)
// // // //     doc.text(`PIN: ${order.deliveryAddress.pincode}`, 300, yPos + 80)

// // // //     // Items Table
// // // //     yPos = 350
// // // //     doc.fontSize(12).fillColor("#fff")
// // // //     doc.rect(50, yPos, 500, 25).fill("#e91e63")
// // // //     doc.text("Product Code", 60, yPos + 8)
// // // //     doc.text("Product Name", 160, yPos + 8)
// // // //     doc.text("Qty", 350, yPos + 8)
// // // //     doc.text("Rate (₹)", 400, yPos + 8)
// // // //     doc.text("Amount (₹)", 470, yPos + 8)

// // // //     yPos += 25
// // // //     let totalItems = 0
// // // //     let totalWeight = 0

// // // //     order.items.forEach((item, index) => {
// // // //       const bgColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff"
// // // //       doc.rect(50, yPos, 500, 20).fill(bgColor)

// // // //       doc.fontSize(10).fillColor("#000")
// // // //       doc.text(item.productCode, 60, yPos + 6)
// // // //       doc.text(item.name.substring(0, 20) + (item.name.length > 20 ? "..." : ""), 160, yPos + 6)
// // // //       doc.text(item.quantity.toString(), 360, yPos + 6)
// // // //       doc.text(item.priceAtOrder.toString(), 410, yPos + 6)
// // // //       doc.text((item.priceAtOrder * item.quantity).toString(), 480, yPos + 6)

// // // //       totalItems += item.quantity
// // // //       totalWeight += item.weightInGrams * item.quantity
// // // //       yPos += 20
// // // //     })

// // // //     // Summary Section
// // // //     yPos += 20
// // // //     doc.rect(350, yPos, 200, 120).stroke()

// // // //     doc.fontSize(12).fillColor("#000")
// // // //     doc.text("ORDER SUMMARY", 360, yPos + 10)
// // // //     doc
// // // //       .moveTo(350, yPos + 25)
// // // //       .lineTo(550, yPos + 25)
// // // //       .stroke()

// // // //     doc.fontSize(11)
// // // //     doc.text(`Total Items: ${totalItems}`, 360, yPos + 35)
// // // //     doc.text(`Total Weight: ${Math.ceil(totalWeight / 1000)}kg`, 360, yPos + 50)
// // // //     doc.text(`Subtotal: ₹${order.subtotal}`, 360, yPos + 65)
// // // //     doc.text(`Delivery Charge: ₹${order.deliveryCharge}`, 360, yPos + 80)

// // // //     doc
// // // //       .moveTo(350, yPos + 95)
// // // //       .lineTo(550, yPos + 95)
// // // //       .stroke()
// // // //     doc.fontSize(14).fillColor("#e91e63")
// // // //     doc.text(`TOTAL: ₹${order.totalAmount}`, 360, yPos + 105)

// // // //     // Tracking Information
// // // //     if (order.consignmentNumber) {
// // // //       yPos += 140
// // // //       doc.fontSize(12).fillColor("#000")
// // // //       doc.text("TRACKING INFORMATION:", 50, yPos)
// // // //       doc.fontSize(11).fillColor("#666")
// // // //       doc.text(`Consignment Number: ${order.consignmentNumber}`, 50, yPos + 15)
// // // //     }

// // // //     // Footer
// // // //     yPos += 60
// // // //     doc.fontSize(10).fillColor("#666")
// // // //     doc.text("Thank you for choosing Mahadev Baby Shop!", 50, yPos, { align: "center" })
// // // //     doc.text("For any queries, WhatsApp us at +91 99137 37023", 50, yPos + 15, { align: "center" })
// // // //     doc.text("Email: mahadevbabyshop5@gmail.com", 50, yPos + 30, { align: "center" })

// // // //     yPos += 50
// // // //     doc.fontSize(8).fillColor("#999")
// // // //     doc.text("This is a computer generated invoice and does not require signature.", 50, yPos, { align: "center" })
// // // //     doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 50, yPos + 12, { align: "center" })

// // // //     doc.end()

// // // //     const pdfBuffer = await pdfPromise

// // // //     return new NextResponse(pdfBuffer, {
// // // //       headers: {
// // // //         "Content-Type": "application/pdf",
// // // //         "Content-Disposition": `attachment; filename="Invoice-${order.orderNumber}.pdf"`,
// // // //       },
// // // //     })
// // // //   } catch (error) {
// // // //     console.error("Error generating invoice:", error)
// // // //     return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
// // // //   }
// // // // }

// // // import { type NextRequest, NextResponse } from "next/server"
// // // import { dbConnect } from "@/lib/mongodb"
// // // import OrderModel from "@/lib/models/order"
// // // import { getSession } from "@/lib/get-session"
// // // import PDFDocument from "pdfkit"

// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     await dbConnect()

// // //     // Get session using your auth system
// // //     const session = await getSession(request)

// // //     if (!session) {
// // //       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
// // //     }

// // //     const { orderId } = await request.json()

// // //     if (!orderId) {
// // //       return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
// // //     }

// // //     const order = await OrderModel.findById(orderId)

// // //     if (!order) {
// // //       return NextResponse.json({ error: "Order not found" }, { status: 404 })
// // //     }

// // //     // Ensure user can only download their own invoices
// // //     if (order.userEmail !== session.email) {
// // //       return NextResponse.json({ error: "Access denied" }, { status: 403 })
// // //     }

// // //     if (order.status !== "completed") {
// // //       return NextResponse.json(
// // //         {
// // //           error: "Invoice is only available for completed orders. Please wait for admin to complete your order.",
// // //           status: order.status,
// // //         },
// // //         { status: 400 },
// // //       )
// // //     }

// // //     // Create PDF (remove any font specifications)
// // //     const doc = new PDFDocument({ margin: 50, size: "A4" })
// // //     const chunks: Buffer[] = []

// // //     doc.on("data", (chunk) => chunks.push(chunk))

// // //     const pdfPromise = new Promise<Buffer>((resolve) => {
// // //       doc.on("end", () => resolve(Buffer.concat(chunks)))
// // //     })

// // //     // Shop Header with Logo Space
// // //     doc.fontSize(28).fillColor("#e91e63").text("MAHADEV BABY SHOP", 50, 50, { align: "center" })
// // //     doc
// // //       .fontSize(14)
// // //       .fillColor("#333")
// // //       .text("Professional Baby Care Products & Accessories", 50, 85, { align: "center" })

// // //     // Shop Owner & Contact Information
// // //     doc.fontSize(12).fillColor("#666")
// // //     doc.text("Owner: Divyesh Nanadaniya", 50, 120)
// // //     doc.text("Mobile: +91 99137 37023 | +91 98988 93380", 50, 135)
// // //     doc.text("Email: mahadevbabyshop5@gmail.com", 50, 150)
// // //     doc.text("WhatsApp: +91 99137 37023", 50, 165)
// // //     doc.text("Address: Vithalani Complex, Mangrol, Gujarat", 50, 180)

// // //     // Invoice Details Box
// // //     doc.rect(400, 120, 150, 80).stroke()
// // //     doc.fontSize(16).fillColor("#e91e63").text("INVOICE", 410, 130)
// // //     doc.fontSize(11).fillColor("#000")
// // //     doc.text(`Invoice #: ${order.orderNumber}`, 410, 150)
// // //     doc.text(
// // //       `Date: ${new Date(order.orderDate).toLocaleDateString("en-IN", {
// // //         day: "2-digit",
// // //         month: "2-digit",
// // //         year: "numeric",
// // //       })}`,
// // //       410,
// // //       165,
// // //     )
// // //     doc.text(`Status: ${order.status.toUpperCase()}`, 410, 180)

// // //     // Horizontal line separator
// // //     doc.moveTo(50, 220).lineTo(550, 220).stroke()

// // //     // Customer & Delivery Information
// // //     let yPos = 240
// // //     doc.fontSize(14).fillColor("#e91e63").text("BILL TO:", 50, yPos)
// // //     doc.fontSize(12).fillColor("#000")
// // //     doc.text(order.customerName, 50, yPos + 20)
// // //     doc.text(`Phone: ${order.customerPhone}`, 50, yPos + 35)
// // //     doc.text(`Email: ${order.userEmail}`, 50, yPos + 50)

// // //     doc.fontSize(14).fillColor("#e91e63").text("DELIVER TO:", 300, yPos)
// // //     doc.fontSize(12).fillColor("#000")
// // //     doc.text(order.deliveryAddress.street, 300, yPos + 20)
// // //     doc.text(order.deliveryAddress.area, 300, yPos + 35)
// // //     doc.text(`${order.deliveryAddress.village}, ${order.deliveryAddress.subDistrict}`, 300, yPos + 50)
// // //     doc.text(`${order.deliveryAddress.district}, ${order.deliveryAddress.state}`, 300, yPos + 65)
// // //     doc.text(`PIN: ${order.deliveryAddress.pincode}`, 300, yPos + 80)

// // //     // Items Table
// // //     yPos = 350
// // //     doc.fontSize(12).fillColor("#fff")
// // //     doc.rect(50, yPos, 500, 25).fill("#e91e63")
// // //     doc.text("Product Code", 60, yPos + 8)
// // //     doc.text("Product Name", 160, yPos + 8)
// // //     doc.text("Qty", 350, yPos + 8)
// // //     doc.text("Rate (₹)", 400, yPos + 8)
// // //     doc.text("Amount (₹)", 470, yPos + 8)

// // //     yPos += 25
// // //     let totalItems = 0
// // //     let totalWeight = 0

// // //     order.items.forEach((item, index) => {
// // //       const bgColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff"
// // //       doc.rect(50, yPos, 500, 20).fill(bgColor)

// // //       doc.fontSize(10).fillColor("#000")
// // //       doc.text(item.productCode, 60, yPos + 6)
// // //       doc.text(item.name.substring(0, 20) + (item.name.length > 20 ? "..." : ""), 160, yPos + 6)
// // //       doc.text(item.quantity.toString(), 360, yPos + 6)
// // //       doc.text(item.priceAtOrder.toString(), 410, yPos + 6)
// // //       doc.text((item.priceAtOrder * item.quantity).toString(), 480, yPos + 6)

// // //       totalItems += item.quantity
// // //       totalWeight += item.weightInGrams * item.quantity
// // //       yPos += 20
// // //     })

// // //     // Summary Section
// // //     yPos += 20
// // //     doc.rect(350, yPos, 200, 120).stroke()

// // //     doc.fontSize(12).fillColor("#000")
// // //     doc.text("ORDER SUMMARY", 360, yPos + 10)
// // //     doc
// // //       .moveTo(350, yPos + 25)
// // //       .lineTo(550, yPos + 25)
// // //       .stroke()

// // //     doc.fontSize(11)
// // //     doc.text(`Total Items: ${totalItems}`, 360, yPos + 35)
// // //     doc.text(`Total Weight: ${Math.ceil(totalWeight / 1000)}kg`, 360, yPos + 50)
// // //     doc.text(`Subtotal: ₹${order.subtotal}`, 360, yPos + 65)
// // //     doc.text(`Delivery Charge: ₹${order.deliveryCharge}`, 360, yPos + 80)

// // //     doc
// // //       .moveTo(350, yPos + 95)
// // //       .lineTo(550, yPos + 95)
// // //       .stroke()
// // //     doc.fontSize(14).fillColor("#e91e63")
// // //     doc.text(`TOTAL: ₹${order.totalAmount}`, 360, yPos + 105)

// // //     // Tracking Information
// // //     if (order.consignmentNumber) {
// // //       yPos += 140
// // //       doc.fontSize(12).fillColor("#000")
// // //       doc.text("TRACKING INFORMATION:", 50, yPos)
// // //       doc.fontSize(11).fillColor("#666")
// // //       doc.text(`Consignment Number: ${order.consignmentNumber}`, 50, yPos + 15)
// // //     }

// // //     // Footer
// // //     yPos += 60
// // //     doc.fontSize(10).fillColor("#666")
// // //     doc.text("Thank you for choosing Mahadev Baby Shop!", 50, yPos, { align: "center" })
// // //     doc.text("For any queries, WhatsApp us at +91 99137 37023", 50, yPos + 15, { align: "center" })
// // //     doc.text("Email: mahadevbabyshop5@gmail.com", 50, yPos + 30, { align: "center" })

// // //     yPos += 50
// // //     doc.fontSize(8).fillColor("#999")
// // //     doc.text("This is a computer generated invoice and does not require signature.", 50, yPos, { align: "center" })
// // //     doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 50, yPos + 12, { align: "center" })

// // //     doc.end()

// // //     const pdfBuffer = await pdfPromise

// // //     return new NextResponse(pdfBuffer, {
// // //       headers: {
// // //         "Content-Type": "application/pdf",
// // //         "Content-Disposition": `attachment; filename="Invoice-${order.orderNumber}.pdf"`,
// // //       },
// // //     })
// // //   } catch (error) {
// // //     console.error("Error generating invoice:", error)
// // //     return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
// // //   }
// // // }


// // import { type NextRequest, NextResponse } from "next/server"
// // import { dbConnect } from "@/lib/mongodb"
// // import OrderModel from "@/lib/models/order"
// // import { getSession } from "@/lib/get-session"

// // export async function POST(request: NextRequest) {
// //   try {
// //     await dbConnect()

// //     // Get session using your auth system
// //     const session = await getSession(request)

// //     if (!session) {
// //       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
// //     }

// //     const { orderId } = await request.json()

// //     if (!orderId) {
// //       return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
// //     }

// //     const order = await OrderModel.findById(orderId)

// //     if (!order) {
// //       return NextResponse.json({ error: "Order not found" }, { status: 404 })
// //     }

// //     // Ensure user can only download their own invoices
// //     if (order.userEmail !== session.email) {
// //       return NextResponse.json({ error: "Access denied" }, { status: 403 })
// //     }

// //     if (order.status !== "completed") {
// //       return NextResponse.json(
// //         {
// //           error: "Invoice is only available for completed orders. Please wait for admin to complete your order.",
// //           status: order.status,
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     // Generate HTML invoice instead of PDF
// //     const htmlInvoice = generateHTMLInvoice(order)

// //     return new NextResponse(htmlInvoice, {
// //       headers: {
// //         "Content-Type": "text/html",
// //         "Content-Disposition": `attachment; filename="Invoice-${order.orderNumber}.html"`,
// //       },
// //     })
// //   } catch (error) {
// //     console.error("Error generating invoice:", error)
// //     return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
// //   }
// // }

// // function generateHTMLInvoice(order: any) {
// //   const orderDate = new Date(order.orderDate).toLocaleDateString("en-IN", {
// //     day: "2-digit",
// //     month: "2-digit",
// //     year: "numeric",
// //   })

// //   const totalItems = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
// //   const totalWeight = order.items.reduce((sum: number, item: any) => sum + item.weightInGrams * item.quantity, 0)

// //   return `
// // <!DOCTYPE html>
// // <html lang="en">
// // <head>
// //     <meta charset="UTF-8">
// //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //     <title>Invoice - ${order.orderNumber}</title>
// //     <style>
// //         body {
// //             font-family: Arial, sans-serif;
// //             max-width: 800px;
// //             margin: 0 auto;
// //             padding: 20px;
// //             line-height: 1.6;
// //         }
// //         .header {
// //             text-align: center;
// //             border-bottom: 3px solid #e91e63;
// //             padding-bottom: 20px;
// //             margin-bottom: 30px;
// //         }
// //         .shop-name {
// //             font-size: 32px;
// //             font-weight: bold;
// //             color: #e91e63;
// //             margin-bottom: 10px;
// //         }
// //         .shop-tagline {
// //             font-size: 16px;
// //             color: #666;
// //             margin-bottom: 20px;
// //         }
// //         .contact-info {
// //             background: #f8f9fa;
// //             padding: 15px;
// //             border-radius: 8px;
// //             margin-bottom: 20px;
// //         }
// //         .invoice-details {
// //             background: #e91e63;
// //             color: white;
// //             padding: 15px;
// //             border-radius: 8px;
// //             margin-bottom: 20px;
// //         }
// //         .customer-info {
// //             display: grid;
// //             grid-template-columns: 1fr 1fr;
// //             gap: 20px;
// //             margin-bottom: 30px;
// //         }
// //         .info-section {
// //             background: #f8f9fa;
// //             padding: 15px;
// //             border-radius: 8px;
// //         }
// //         .info-title {
// //             font-weight: bold;
// //             color: #e91e63;
// //             margin-bottom: 10px;
// //             font-size: 16px;
// //         }
// //         .items-table {
// //             width: 100%;
// //             border-collapse: collapse;
// //             margin-bottom: 20px;
// //         }
// //         .items-table th {
// //             background: #e91e63;
// //             color: white;
// //             padding: 12px;
// //             text-align: left;
// //         }
// //         .items-table td {
// //             padding: 10px 12px;
// //             border-bottom: 1px solid #ddd;
// //         }
// //         .items-table tr:nth-child(even) {
// //             background: #f8f9fa;
// //         }
// //         .summary {
// //             background: #f8f9fa;
// //             padding: 20px;
// //             border-radius: 8px;
// //             margin-bottom: 20px;
// //         }
// //         .summary-row {
// //             display: flex;
// //             justify-content: space-between;
// //             margin-bottom: 10px;
// //         }
// //         .total-row {
// //             font-weight: bold;
// //             font-size: 18px;
// //             color: #e91e63;
// //             border-top: 2px solid #e91e63;
// //             padding-top: 10px;
// //         }
// //         .tracking {
// //             background: #e3f2fd;
// //             padding: 15px;
// //             border-radius: 8px;
// //             margin-bottom: 20px;
// //         }
// //         .footer {
// //             text-align: center;
// //             color: #666;
// //             font-size: 14px;
// //             border-top: 1px solid #ddd;
// //             padding-top: 20px;
// //         }
// //         @media print {
// //             body { margin: 0; }
// //             .no-print { display: none; }
// //         }
// //     </style>
// // </head>
// // <body>
// //     <div class="header">
// //         <div class="shop-name">MAHADEV BABY SHOP</div>
// //         <div class="shop-tagline">Professional Baby Care Products & Accessories</div>
// //     </div>

// //     <div class="contact-info">
// //         <strong>Owner:</strong> Divyesh Nanadaniya<br>
// //         <strong>Mobile:</strong> +91 99137 37023 | +91 98988 93380<br>
// //         <strong>Email:</strong> mahadevbabyshop5@gmail.com<br>
// //         <strong>WhatsApp:</strong> +91 99137 37023<br>
// //         <strong>Address:</strong> Vithalani Complex, Mangrol, Gujarat
// //     </div>

// //     <div class="invoice-details">
// //         <h2 style="margin: 0 0 10px 0;">INVOICE</h2>
// //         <strong>Invoice #:</strong> ${order.orderNumber}<br>
// //         <strong>Date:</strong> ${orderDate}<br>
// //         <strong>Status:</strong> ${order.status.toUpperCase()}
// //     </div>

// //     <div class="customer-info">
// //         <div class="info-section">
// //             <div class="info-title">BILL TO:</div>
// //             ${order.customerName}<br>
// //             Phone: ${order.customerPhone}<br>
// //             Email: ${order.userEmail}
// //         </div>
// //         <div class="info-section">
// //             <div class="info-title">DELIVER TO:</div>
// //             ${order.deliveryAddress.street}<br>
// //             ${order.deliveryAddress.area}<br>
// //             ${order.deliveryAddress.village}, ${order.deliveryAddress.subDistrict}<br>
// //             ${order.deliveryAddress.district}, ${order.deliveryAddress.state}<br>
// //             PIN: ${order.deliveryAddress.pincode}
// //         </div>
// //     </div>

// //     <table class="items-table">
// //         <thead>
// //             <tr>
// //                 <th>Product Code</th>
// //                 <th>Product Name</th>
// //                 <th>Qty</th>
// //                 <th>Rate (₹)</th>
// //                 <th>Amount (₹)</th>
// //             </tr>
// //         </thead>
// //         <tbody>
// //             ${order.items
// //               .map(
// //                 (item: any) => `
// //                 <tr>
// //                     <td>${item.productCode}</td>
// //                     <td>${item.name}</td>
// //                     <td>${item.quantity}</td>
// //                     <td>₹${item.priceAtOrder}</td>
// //                     <td>₹${item.priceAtOrder * item.quantity}</td>
// //                 </tr>
// //             `,
// //               )
// //               .join("")}
// //         </tbody>
// //     </table>

// //     <div class="summary">
// //         <h3 style="margin-top: 0; color: #e91e63;">ORDER SUMMARY</h3>
// //         <div class="summary-row">
// //             <span>Total Items:</span>
// //             <span>${totalItems}</span>
// //         </div>
// //         <div class="summary-row">
// //             <span>Total Weight:</span>
// //             <span>${Math.ceil(totalWeight / 1000)}kg</span>
// //         </div>
// //         <div class="summary-row">
// //             <span>Subtotal:</span>
// //             <span>₹${order.subtotal}</span>
// //         </div>
// //         <div class="summary-row">
// //             <span>Delivery Charge:</span>
// //             <span>₹${order.deliveryCharge}</span>
// //         </div>
// //         <div class="summary-row total-row">
// //             <span>TOTAL:</span>
// //             <span>₹${order.totalAmount}</span>
// //         </div>
// //     </div>

// //     ${
// //       order.consignmentNumber
// //         ? `
// //     <div class="tracking">
// //         <div class="info-title">TRACKING INFORMATION:</div>
// //         <strong>Consignment Number:</strong> ${order.consignmentNumber}
// //     </div>
// //     `
// //         : ""
// //     }

// //     <div class="footer">
// //         <p><strong>Thank you for choosing Mahadev Baby Shop!</strong></p>
// //         <p>For any queries, WhatsApp us at +91 99137 37023</p>
// //         <p>Email: mahadevbabyshop5@gmail.com</p>
// //         <br>
// //         <p style="font-size: 12px; color: #999;">
// //             This is a computer generated invoice and does not require signature.<br>
// //             Generated on: ${new Date().toLocaleString("en-IN")}
// //         </p>
// //     </div>

// //     <script>
// //         // Auto print when opened
// //         window.onload = function() {
// //             setTimeout(function() {
// //                 window.print();
// //             }, 500);
// //         }
// //     </script>
// // </body>
// // </html>
// //   `
// // }

// import { type NextRequest, NextResponse } from "next/server"
// import { dbConnect } from "@/lib/mongodb"
// import OrderModel from "@/lib/models/order"
// import { getSession } from "@/lib/get-session"
// import PDFDocument from "pdfkit"

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect()

//     // Get session using your auth system
//     const session = await getSession(request)

//     if (!session) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//     }

//     const { orderId } = await request.json()

//     if (!orderId) {
//       return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
//     }

//     const order = await OrderModel.findById(orderId)

//     if (!order) {
//       return NextResponse.json({ error: "Order not found" }, { status: 404 })
//     }

//     // Ensure user can only download their own invoices
//     if (order.userEmail !== session.email) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     if (order.status !== "completed") {
//       return NextResponse.json(
//         {
//           error: "Invoice is only available for completed orders. Please wait for admin to complete your order.",
//           status: order.status,
//         },
//         { status: 400 },
//       )
//     }

//     // Create PDF with minimal configuration to avoid font issues
//     const doc = new PDFDocument({
//       margin: 50,
//       size: "A4",
//       bufferPages: true,
//       autoFirstPage: true,
//     })

//     const chunks: Buffer[] = []

//     doc.on("data", (chunk) => chunks.push(chunk))

//     const pdfPromise = new Promise<Buffer>((resolve) => {
//       doc.on("end", () => resolve(Buffer.concat(chunks)))
//     })

//     // Use only basic text without any font specifications
//     let yPos = 50

//     // Shop Header
//     doc.fontSize(24).fillColor("#e91e63")
//     doc.text("MAHADEV BABY SHOP", 50, yPos, { align: "center" })
//     yPos += 30

//     doc.fontSize(12).fillColor("#333")
//     doc.text("Professional Baby Care Products & Accessories", 50, yPos, { align: "center" })
//     yPos += 40

//     // Shop Contact Information
//     doc.fontSize(10).fillColor("#666")
//     doc.text("Owner: Divyesh Nanadaniya", 50, yPos)
//     yPos += 15
//     doc.text("Mobile: +91 99137 37023 | +91 98988 93380", 50, yPos)
//     yPos += 15
//     doc.text("Email: mahadevbabyshop5@gmail.com", 50, yPos)
//     yPos += 15
//     doc.text("WhatsApp: +91 99137 37023", 50, yPos)
//     yPos += 15
//     doc.text("Address: Vithalani Complex, Mangrol, Gujarat", 50, yPos)
//     yPos += 30

//     // Invoice Details Box
//     doc.rect(400, 120, 150, 80).stroke()
//     doc.fontSize(14).fillColor("#e91e63")
//     doc.text("INVOICE", 410, 130)

//     doc.fontSize(10).fillColor("#000")
//     doc.text(`Invoice #: ${order.orderNumber}`, 410, 150)
//     doc.text(
//       `Date: ${new Date(order.orderDate).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       })}`,
//       410,
//       165,
//     )
//     doc.text(`Status: ${order.status.toUpperCase()}`, 410, 180)

//     // Line separator
//     yPos = 220
//     doc.moveTo(50, yPos).lineTo(550, yPos).stroke()
//     yPos += 20

//     // Customer Information
//     doc.fontSize(12).fillColor("#e91e63")
//     doc.text("BILL TO:", 50, yPos)
//     doc.text("DELIVER TO:", 300, yPos)
//     yPos += 20

//     doc.fontSize(10).fillColor("#000")
//     doc.text(order.customerName, 50, yPos)
//     doc.text(order.deliveryAddress.street, 300, yPos)
//     yPos += 15

//     doc.text(`Phone: ${order.customerPhone}`, 50, yPos)
//     doc.text(order.deliveryAddress.area, 300, yPos)
//     yPos += 15

//     doc.text(`Email: ${order.userEmail}`, 50, yPos)
//     doc.text(`${order.deliveryAddress.village}, ${order.deliveryAddress.subDistrict}`, 300, yPos)
//     yPos += 15

//     doc.text("", 50, yPos) // Empty space for bill to
//     doc.text(`${order.deliveryAddress.district}, ${order.deliveryAddress.state}`, 300, yPos)
//     yPos += 15

//     doc.text("", 50, yPos) // Empty space for bill to
//     doc.text(`PIN: ${order.deliveryAddress.pincode}`, 300, yPos)
//     yPos += 30

//     // Items Table Header
//     doc.rect(50, yPos, 500, 25).fillAndStroke("#e91e63", "#e91e63")
//     doc.fontSize(10).fillColor("#fff")
//     doc.text("Product Code", 60, yPos + 8)
//     doc.text("Product Name", 160, yPos + 8)
//     doc.text("Qty", 350, yPos + 8)
//     doc.text("Rate", 400, yPos + 8)
//     doc.text("Amount", 470, yPos + 8)
//     yPos += 25

//     // Items
//     let totalItems = 0
//     let totalWeight = 0

//     order.items.forEach((item, index) => {
//       const bgColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff"
//       doc.rect(50, yPos, 500, 20).fillAndStroke(bgColor, bgColor)

//       doc.fontSize(9).fillColor("#000")
//       doc.text(item.productCode, 60, yPos + 6)

//       // Truncate long product names
//       const productName = item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name
//       doc.text(productName, 160, yPos + 6)

//       doc.text(item.quantity.toString(), 360, yPos + 6)
//       doc.text(`Rs ${item.priceAtOrder}`, 400, yPos + 6)
//       doc.text(`Rs ${item.priceAtOrder * item.quantity}`, 470, yPos + 6)

//       totalItems += item.quantity
//       totalWeight += item.weightInGrams * item.quantity
//       yPos += 20
//     })

//     // Summary Section
//     yPos += 20
//     doc.rect(350, yPos, 200, 120).stroke()

//     doc.fontSize(11).fillColor("#000")
//     doc.text("ORDER SUMMARY", 360, yPos + 10)
//     doc
//       .moveTo(350, yPos + 25)
//       .lineTo(550, yPos + 25)
//       .stroke()

//     doc.fontSize(10)
//     doc.text(`Total Items: ${totalItems}`, 360, yPos + 35)
//     doc.text(`Total Weight: ${Math.ceil(totalWeight / 1000)}kg`, 360, yPos + 50)
//     doc.text(`Subtotal: Rs ${order.subtotal}`, 360, yPos + 65)
//     doc.text(`Delivery Charge: Rs ${order.deliveryCharge}`, 360, yPos + 80)

//     doc
//       .moveTo(350, yPos + 95)
//       .lineTo(550, yPos + 95)
//       .stroke()
//     doc.fontSize(12).fillColor("#e91e63")
//     doc.text(`TOTAL: Rs ${order.totalAmount}`, 360, yPos + 105)

//     // Tracking Information
//     if (order.consignmentNumber) {
//       yPos += 140
//       doc.fontSize(11).fillColor("#000")
//       doc.text("TRACKING INFORMATION:", 50, yPos)
//       doc.fontSize(10).fillColor("#666")
//       doc.text(`Consignment Number: ${order.consignmentNumber}`, 50, yPos + 15)
//       yPos += 30
//     }

//     // Footer
//     yPos += 60
//     doc.fontSize(10).fillColor("#666")
//     doc.text("Thank you for choosing Mahadev Baby Shop!", 50, yPos, { align: "center" })
//     yPos += 15
//     doc.text("For any queries, WhatsApp us at +91 99137 37023", 50, yPos, { align: "center" })
//     yPos += 15
//     doc.text("Email: mahadevbabyshop5@gmail.com", 50, yPos, { align: "center" })

//     yPos += 30
//     doc.fontSize(8).fillColor("#999")
//     doc.text("This is a computer generated invoice and does not require signature.", 50, yPos, { align: "center" })
//     yPos += 12
//     doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 50, yPos, { align: "center" })

//     // Finalize the PDF
//     doc.end()

//     const pdfBuffer = await pdfPromise

//     return new NextResponse(pdfBuffer, {
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="Invoice-${order.orderNumber}.pdf"`,
//         "Cache-Control": "no-cache",
//       },
//     })
//   } catch (error) {
//     console.error("Error generating invoice:", error)
//     return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
//   }
// }


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

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const order = await OrderModel.findById(orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Ensure user can only download their own invoices
    if (order.userEmail !== session.email) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    if (order.status !== "completed") {
      return NextResponse.json(
        {
          error: "Invoice is only available for completed orders. Please wait for admin to complete your order.",
          status: order.status,
        },
        { status: 400 },
      )
    }

    // Generate HTML invoice that can be printed as PDF
    const htmlInvoice = generatePrintableInvoice(order)

    return new NextResponse(htmlInvoice, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="Invoice-${order.orderNumber}.html"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}

function generatePrintableInvoice(order: any) {
  const orderDate = new Date(order.orderDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const totalItems = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
  const totalWeight = order.items.reduce((sum: number, item: any) => sum + item.weightInGrams * item.quantity, 0)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${order.orderNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #e91e63;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .shop-name {
            font-size: 32px;
            font-weight: bold;
            color: #e91e63;
            margin-bottom: 10px;
        }
        
        .shop-tagline {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
        }
        
        .contact-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .invoice-details {
            background: #e91e63;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            float: right;
            width: 250px;
        }
        
        .customer-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            clear: both;
        }
        
        .info-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            width: 48%;
        }
        
        .info-title {
            font-weight: bold;
            color: #e91e63;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .items-table th {
            background: #e91e63;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        
        .items-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
        }
        
        .items-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            float: right;
            width: 300px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .total-row {
            font-weight: bold;
            font-size: 18px;
            color: #e91e63;
            border-top: 2px solid #e91e63;
            padding-top: 10px;
        }
        
        .tracking {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            clear: both;
        }
        
        .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            clear: both;
        }
        
        .print-button {
            background: #e91e63;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin: 20px auto;
            display: block;
        }
        
        .print-button:hover {
            background: #c2185b;
        }
        
        @media print {
            .print-button {
                display: none;
            }
            
            body {
                margin: 0;
                padding: 0;
            }
            
            .invoice-container {
                max-width: none;
                margin: 0;
                padding: 0;
            }
            
            .header {
                page-break-inside: avoid;
            }
            
            .items-table {
                page-break-inside: avoid;
            }
        }
        
        @media (max-width: 768px) {
            .invoice-details {
                float: none;
                width: 100%;
                margin-bottom: 20px;
            }
            
            .customer-info {
                flex-direction: column;
            }
            
            .info-section {
                width: 100%;
                margin-bottom: 15px;
            }
            
            .summary {
                float: none;
                width: 100%;
            }
            
            .shop-name {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <button class="print-button" onclick="window.print()">🖨️ Print Invoice as PDF</button>
        
        <div class="header">
            <div class="shop-name">MAHADEV BABY SHOP</div>
            <div class="shop-tagline">Professional Baby Care Products & Accessories</div>
        </div>

        <div class="invoice-details">
            <h2 style="margin: 0 0 10px 0;">INVOICE</h2>
            <strong>Invoice #:</strong> ${order.orderNumber}<br>
            <strong>Date:</strong> ${orderDate}<br>
            <strong>Status:</strong> ${order.status.toUpperCase()}
        </div>

        <div class="contact-info">
            <strong>Owner:</strong> Divyesh Nanadaniya<br>
            <strong>Mobile:</strong> +91 99137 37023 | +91 98988 93380<br>
            <strong>Email:</strong> mahadevbabyshop5@gmail.com<br>
            <strong>WhatsApp:</strong> +91 99137 37023<br>
            <strong>Address:</strong> Vithalani Complex, Mangrol, Gujarat
        </div>

        <div class="customer-info">
            <div class="info-section">
                <div class="info-title">BILL TO:</div>
                ${order.customerName}<br>
                Phone: ${order.customerPhone}<br>
                Email: ${order.userEmail}
            </div>
            <div class="info-section">
                <div class="info-title">DELIVER TO:</div>
                ${order.deliveryAddress.street}<br>
                ${order.deliveryAddress.area}<br>
                ${order.deliveryAddress.village}, ${order.deliveryAddress.subDistrict}<br>
                ${order.deliveryAddress.district}, ${order.deliveryAddress.state}<br>
                PIN: ${order.deliveryAddress.pincode}
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Rate (₹)</th>
                    <th>Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                ${order.items
                  .map(
                    (item: any) => `
                    <tr>
                        <td>${item.productCode}</td>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.priceAtOrder}</td>
                        <td>₹${item.priceAtOrder * item.quantity}</td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>

        <div class="summary">
            <h3 style="margin-top: 0; color: #e91e63;">ORDER SUMMARY</h3>
            <div class="summary-row">
                <span>Total Items:</span>
                <span>${totalItems}</span>
            </div>
            <div class="summary-row">
                <span>Total Weight:</span>
                <span>${Math.ceil(totalWeight / 1000)}kg</span>
            </div>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${order.subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Delivery Charge:</span>
                <span>₹${order.deliveryCharge}</span>
            </div>
            <div class="summary-row total-row">
                <span>TOTAL:</span>
                <span>₹${order.totalAmount}</span>
            </div>
        </div>

        ${
          order.consignmentNumber
            ? `
        <div class="tracking">
            <div class="info-title">TRACKING INFORMATION:</div>
            <strong>Consignment Number:</strong> ${order.consignmentNumber}
        </div>
        `
            : ""
        }

        <div class="footer">
            <p><strong>Thank you for choosing Mahadev Baby Shop!</strong></p>
            <p>For any queries, WhatsApp us at +91 99137 37023</p>
            <p>Email: mahadevbabyshop5@gmail.com</p>
            <br>
            <p style="font-size: 12px; color: #999;">
                This is a computer generated invoice and does not require signature.<br>
                Generated on: ${new Date().toLocaleString("en-IN")}
            </p>
            <br>
            <p style="font-size: 12px; color: #e91e63; font-weight: bold;">
                💡 To save as PDF: Click Print button above → Choose "Save as PDF" → Save
            </p>
        </div>
    </div>

    <script>
        // Add keyboard shortcut for printing
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                window.print();
            }
        });
        
        // Auto-focus print button for accessibility
        window.onload = function() {
            document.querySelector('.print-button').focus();
        };
    </script>
</body>
</html>
`
}
