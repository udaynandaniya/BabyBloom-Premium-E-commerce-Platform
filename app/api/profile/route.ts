export const dynamic = 'force-dynamic';
// import { type NextRequest, NextResponse } from "next/server"
// import User from "@/lib/models/User"
// import OrderModel from "@/lib/models/order"
// import { decrypt } from "@/lib/auth"
// import bcrypt from "bcryptjs"
// import { dbConnect } from "@/lib/mongodb"
// import { Db } from "mongodb"

// // Get user profile
// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect()

//     // Get token from cookies
//     const token = request.cookies.get("jwt-token")?.value

//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//     }

//     // Decrypt token
//     const payload = await decrypt(token)
//     if (!payload) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//     }

//     // Find user
//     const user = await User.findById(payload.userId).select("-password")

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     return NextResponse.json({
//       success: true,
//       data: user,
//     })
//   } catch (error) {
//     console.error("Profile GET error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// // Update user profile
// export async function PUT(request: NextRequest) {
//   try {
//     await dbConnect()

//     // Get token from cookies
//     const token = request.cookies.get("jwt-token")?.value

//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//     }

//     // Decrypt token
//     const payload = await decrypt(token)
//     if (!payload) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//     }

//     // Find user
//     const user = await User.findById(payload.userId)

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Check for pending/accepted orders
//     const pendingOrders = await OrderModel.find({
//       userEmail: user.email,
//       status: { $in: ["pending", "accepted", "dispatched"] },
//     })

//     if (pendingOrders.length > 0) {
//       return NextResponse.json(
//         { error: "Cannot update profile while you have pending or accepted orders" },
//         { status: 400 },
//       )
//     }

//     const body = await request.json()
//     const { name, phone, password, address } = body

//     // Validate required fields
//     if (!name || !phone || !address) {
//       return NextResponse.json({ error: "Name, phone, and address are required" }, { status: 400 })
//     }

//     // Validate phone format
//     if (!/^\d{10}$/.test(phone)) {
//       return NextResponse.json({ error: "Phone number must be exactly 10 digits" }, { status: 400 })
//     }

//     // Check if phone is unique (excluding current user)
//     const existingUser = await User.findOne({
//       phone,
//       _id: { $ne: payload.userId },
//     })

//     if (existingUser) {
//       return NextResponse.json({ error: "Phone number is already registered" }, { status: 400 })
//     }

//     // Prepare update data
//     const updateData: any = {
//       name,
//       phone,
//       address,
//     }

//     // Hash new password if provided
//     if (password && password.trim() !== "") {
//       if (password.length < 6) {
//         return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
//       }
//       updateData.password = await bcrypt.hash(password, 12)
//     }

//     // Update user
//     const updatedUser = await User.findByIdAndUpdate(payload.userId, updateData, {
//       new: true,
//       runValidators: true,
//     }).select("-password")

//     return NextResponse.json({
//       success: true,
//       message: "Profile updated successfully",
//       data: updatedUser,
//     })
//   } catch (error) {
//     console.error("Profile PUT error:", error)

//     if (error instanceof Error) {
//       if (error.message.includes("duplicate key")) {
//         return NextResponse.json({ error: "Phone number is already registered" }, { status: 400 })
//       }
//     }

//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// // Delete user account
// export async function DELETE(request: NextRequest) {
//   try {
//     await dbConnect()

//     // Get token from cookies
//     const token = request.cookies.get("jwt-token")?.value

//     if (!token) {
//       return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//     }

//     // Decrypt token
//     const payload = await decrypt(token)
//     if (!payload) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 })
//     }

//     // Find user
//     const user = await User.findById(payload.userId)

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Check for pending/accepted orders
//     const pendingOrders = await OrderModel.find({
//       userEmail: user.email,
//       status: { $in: ["pending", "accepted", "dispatched"] },
//     })

//     if (pendingOrders.length > 0) {
//       return NextResponse.json(
//         { error: "Cannot delete account while you have pending or accepted orders" },
//         { status: 400 },
//       )
//     }

//     // Delete all orders associated with this user
//     await OrderModel.deleteMany({ userEmail: user.email })

//     // Delete user account
//     await User.findByIdAndDelete(payload.userId)

//     // Create response to clear cookies
//     const response = NextResponse.json({
//       success: true,
//       message: "Account deleted successfully",
//     })

//     // Clear authentication cookies
//     response.cookies.set("jwt-token", "", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 0,
//     })

//     return response
//   } catch (error) {
//     console.error("Profile DELETE error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/lib/models/User"
import OrderModel from "@/lib/models/order"
import { decrypt } from "@/lib/auth"
import bcrypt from "bcryptjs"

// Get user profile
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

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

    // Find user
    const user = await User.findById(payload.userId).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Profile GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

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

    // Find user
    const user = await User.findById(payload.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check for pending/accepted orders
    const pendingOrders = await OrderModel.find({
      userEmail: user.email,
      status: { $in: ["pending", "accepted", "dispatched"] },
    })

    if (pendingOrders.length > 0) {
      return NextResponse.json(
        { error: "Cannot update profile while you have pending or accepted orders" },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { name, phone, password, address } = body

    // Validate required fields
    if (!name || !phone || !address) {
      return NextResponse.json({ error: "Name, phone, and address are required" }, { status: 400 })
    }

    // Validate phone format
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Phone number must be exactly 10 digits" }, { status: 400 })
    }

    // Check if phone is unique (excluding current user)
    const existingUser = await User.findOne({
      phone,
      _id: { $ne: payload.userId },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Phone number is already registered" }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      name,
      phone,
      address,
    }

    // Hash new password if provided
    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(password, 12)
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(payload.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    console.error("Profile PUT error:", error)

    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json({ error: "Phone number is already registered" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Delete user account
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()

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

    // Find user
    const user = await User.findById(payload.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check for pending/accepted orders
    const pendingOrders = await OrderModel.find({
      userEmail: user.email,
      status: { $in: ["pending", "accepted", "dispatched"] },
    })

    if (pendingOrders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete account while you have pending or accepted orders" },
        { status: 400 },
      )
    }

    // Delete all orders associated with this user
    await OrderModel.deleteMany({ userEmail: user.email })

    // Delete user account
    await User.findByIdAndDelete(payload.userId)

    // Create response using the same pattern as logout route
    const response = new NextResponse(
      JSON.stringify({
        success: true,
        message: "Account deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )

    // ✅ Clear the jwt-token cookie (same as logout route)
    response.cookies.set("jwt-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Profile DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
