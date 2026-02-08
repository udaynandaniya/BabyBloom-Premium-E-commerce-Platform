export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { ReviewModel } from "@/lib/models/reviewModel"
import { dbConnect } from "@/lib/mongodb"

export async function GET() {
  try {
    await dbConnect()

    const stats = await ReviewModel.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ])

    if (stats.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      })
    }

    const { totalReviews, averageRating, ratingDistribution } = stats[0]

    // Count rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    ratingDistribution.forEach((rating: number) => {
      distribution[rating as keyof typeof distribution]++
    })

    return NextResponse.json({
      success: true,
      data: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution: distribution,
      },
    })
  } catch (error) {
    console.error("Error fetching review stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
