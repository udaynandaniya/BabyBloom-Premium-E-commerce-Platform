export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { ClothesModel } from "@/lib/models/clothes"

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const ageGroup = searchParams.get("ageGroup")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const search = searchParams.get("search")

    // Build filter query
    const query: any = { inStock: { $gt: 0 } } // Only show in-stock items

    if (category) {
      query.category = { $in: category.split(",") }
    }

    if (ageGroup) {
      query.ageGroup = { $in: ageGroup.split(",") }
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
        { color: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort object
    const sortObj: any = {}
    sortObj[sortBy] = sortOrder === "desc" ? -1 : 1

    // Execute query with pagination
    const skip = (page - 1) * limit
    const clothes = await ClothesModel.find(query).sort(sortObj).skip(skip).limit(limit).select("-productCode") // Don't send internal product codes to users

    const total = await ClothesModel.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: clothes,
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
    console.error("Error fetching clothes:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch clothes" }, { status: 500 })
  }
}
