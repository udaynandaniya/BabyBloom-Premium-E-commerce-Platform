export const dynamic = 'force-dynamic';
// //C:\Users\UDAYN\Downloads\Projects\mahadev-baby\app\api\products\bath\route.ts

// import { NextResponse } from "next/server"
// import { dbConnect } from "@/lib/mongodb"
// import { BathItemModel } from "@/lib/models/bath"

// export async function GET() {
//   try {
//     await dbConnect()
//     const bathItems = await BathItemModel.find({}).sort({ createdAt: -1 })

//     return NextResponse.json({
//       success: true,
//       data: bathItems,
//       total: bathItems.length,
//     })
//   } catch (error) {
//     console.error("Error fetching bath items:", error)
//     return NextResponse.json({ success: false, error: "Failed to fetch bath items" }, { status: 500 })
//   }
// }

// export async function POST(request: Request) {
//   try {
//     await dbConnect()
//     const data = await request.json()

//     const newBathItem = new BathItemModel(data)
//     await newBathItem.save()

//     return NextResponse.json({
//       success: true,
//       data: newBathItem,
//       message: "Bath item added successfully",
//     })
//   } catch (error) {
//     console.error("Error adding bath item:", error)
//     return NextResponse.json({ success: false, error: "Failed to add bath item" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { BathItemModel } from "@/lib/models/bath"

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const type = searchParams.get("type")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const search = searchParams.get("search")

    // Build filter query
    const query: any = { inStock: { $gt: 0 } } // Only show in-stock items

    if (type) {
      query.type = { $in: type.split(",") }
    }

    if (minPrice || maxPrice) {
      query.sellingPrice = {}
      if (minPrice) query.sellingPrice.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.sellingPrice.$lte = Number.parseFloat(maxPrice)
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort object
    const sortObj: any = {}
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1

    // Execute query with pagination
    const skip = (page - 1) * limit
    const bathItems = await BathItemModel.find(query).sort(sortObj).skip(skip).limit(limit)// Don't send internal product codes to users

    const total = await BathItemModel.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: bathItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching bath items:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch bath items" }, { status: 500 })
  }
}

