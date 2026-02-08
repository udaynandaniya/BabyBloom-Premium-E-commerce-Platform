

import { getSession } from "@/lib/get-session"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req)

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          userId: session.userId,
          name: session.name,
          email: session.email,
          phone: session.phone,
          isAdmin: session.isAdmin,
          isVerified: session.isVerified,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300", // 5 minutes cache
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get user info",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache",
        },
      },
    )
  }
}

