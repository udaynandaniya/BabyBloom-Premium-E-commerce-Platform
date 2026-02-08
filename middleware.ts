

// import { type NextRequest, NextResponse } from "next/server"

// const protectedUserPaths = [
//   "/cart",
//   "/checkout",
//   "/orders",
//   "/profile",
//   "/reviews",
//   "/my-orders",
  
// ]

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const token = request.cookies.get("jwt-token")?.value

//   if (!token) {
//     const isUserProtected = protectedUserPaths.some((path) =>
//       pathname.startsWith(path)
//     )

//     if (isUserProtected) {
//       return NextResponse.redirect(new URL("/auth/login", request.url))
//     }
//   }

//   // ✅ Skip actual verification — do that server-side in route
//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/user/:path*", "/checkout", "/auth/:path*", "/admin/:path*", "/"],
// }


import { NextResponse, type NextRequest } from "next/server"
import { decrypt } from "@/lib/auth"

const protectedUserPaths = [
  "/cart",
  "/checkout",
  "/orders",
  "/profile",
  "/reviews",
  "/my-orders",
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("jwt-token")?.value

  const isUserProtected = protectedUserPaths.some((path) =>
    pathname.startsWith(path)
  )
  const isAdminPath = pathname.startsWith("/admin")

  if (!token) {
    if (isUserProtected || isAdminPath) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    return NextResponse.next()
  }

  const session = await decrypt(token)

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (isAdminPath && !session.isAdmin) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
    "/reviews",
    "/my-orders",
    "/admin/:path*",
  ],
}
