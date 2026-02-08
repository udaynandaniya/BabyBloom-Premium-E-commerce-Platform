export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import { ReviewModel } from "@/lib/models/reviewModel"
import { decrypt } from "@/lib/auth"
import { dbConnect } from "@/lib/mongodb"

// GET - Fetch latest 5 reviews
export async function GET() {
  try {
    await dbConnect()

    const reviews = await ReviewModel.find({})
      .select("name rating comment createdAt isVerified")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    const formattedReviews = reviews.map((review) => ({
      id: review._id.toString(),
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.createdAt).toLocaleDateString(),
      isVerified: review.isVerified,
    }))

    return NextResponse.json({
      success: true,
      data: formattedReviews,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST - Create new review
export async function POST(request: NextRequest) {
  try {
    await dbConnect

    // Get token from cookies
    const token = request.cookies.get("jwt-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Decrypt token
    const payload = await decrypt(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment } = body

    // Validation
    if (!rating || !comment) {
      return NextResponse.json({ error: "Rating and comment are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (comment.length < 10 || comment.length > 500) {
      return NextResponse.json({ error: "Comment must be between 10 and 500 characters" }, { status: 400 })
    }

    // Check if user already reviewed (optional - remove if you want multiple reviews per user)
    const existingReview = await ReviewModel.findOne({ userId: payload.userId })
    if (existingReview) {
      return NextResponse.json({ error: "You have already submitted a review" }, { status: 400 })
    }

    // Get user info from payload
    const userInfo = payload as any

    // Create review
    const review = new ReviewModel({
      name: userInfo.name || "Anonymous User",
      email: userInfo.email || "",
      userId: payload.userId,
      rating: Number(rating),
      comment: comment.trim(),
      isVerified: userInfo.isVerified || false,
    })

    await review.save()

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      data: {
        id: review._id.toString(),
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.createdAt).toLocaleDateString(),
        isVerified: review.isVerified,
      },
    })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
