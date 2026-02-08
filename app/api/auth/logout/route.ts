export const dynamic = 'force-dynamic';



// import { NextResponse } from "next/server"

// export async function POST() {
//   try {
//     const response = new NextResponse(
//       JSON.stringify({
//         success: true,
//         message: "Logged out successfully",
//       }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }
//     )

//     // ✅ Clear the jwt-token cookie
//     response.cookies.set("jwt-token", "", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 0,
//     })

//     return response
//   } catch (error) {
//     console.error("[LOGOUT] Error:", error)
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Logout failed",
//       },
//       { status: 500 }
//     )
//   }
// }


import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = new NextResponse(
      JSON.stringify({
        success: true,
        message: "Logged out successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )

    // ✅ Clear the jwt-token cookie
    response.cookies.set("jwt-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("[LOGOUT] Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      { status: 500 }
    )
  }
}
