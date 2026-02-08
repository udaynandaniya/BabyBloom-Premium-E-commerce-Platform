export const dynamic = 'force-dynamic';


// // // // //C:\Users\UDAYN\Downloads\Projects\mahadev-baby\app\api\auth\register\route.ts

// // // // import { NextRequest, NextResponse } from "next/server";
// // // // import { z } from "zod";
// // // // import { dbConnect } from "@/lib/mongodb";
// // // // import User from "@/models/User";
// // // // import bcrypt from "bcryptjs";
// // // // import { sendEmail } from "@/lib/mailer"; // Your custom nodemailer function

// // // // const registerSchema = z.object({
// // // //   name: z.string().min(2, "Name must be at least 2 characters"),
// // // //   password: z.string().min(6, "Password must be at least 6 characters"),
// // // //   email: z.string().email("Invalid email").optional(),
// // // //   phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number").optional(),
  
// // // // }).refine(
// // // //   (data) => data.email || data.phone,
// // // //   { message: "Either email or phone must be provided", path: ["email"] }
// // // // );


// // // // export async function POST(req: NextRequest) {
// // // //   try {
// // // //     const body = await req.json();
// // // //     console.log("[REGISTER] Received request:", body);

// // // //     const parsed = registerSchema.safeParse(body);
// // // //     if (!parsed.success) {
// // // //       const errors = parsed.error.flatten().fieldErrors;
// // // //       return NextResponse.json({ success: false, message: "Validation failed", errors }, { status: 400 });
// // // //     }

// // // //     const { name, email, phone, password } = parsed.data;

// // // //     if (!email && !phone) {
// // // //       return NextResponse.json({ success: false, message: "Email or phone is required." }, { status: 400 });
// // // //     }

// // // //     await dbConnect();

// // // //     const existingUser = await User.findOne({
// // // //       $or: [{ email }, { phone }],
// // // //     });

// // // //     if (existingUser?.isVerified) {
// // // //       return NextResponse.json({
// // // //         success: false,
// // // //         message: "A verified account already exists with this email or phone.",
// // // //       }, { status: 400 });
// // // //     }

// // // //     const hashedPassword = await bcrypt.hash(password, 10);
// // // //    const isAdmin = email === process.env.ADMIN_EMAIL

// // // // const userData = {
// // // //   name,
// // // //   email: email || undefined,
// // // //   phone: phone || undefined,
// // // //   password: hashedPassword,
// // // //   isVerified: false,
// // // //   isAdmin,
// // // //   updatedAt: new Date(),
// // // // }


// // // //     let user;

// // // //     if (existingUser && !existingUser.isVerified) {
// // // //       await User.updateOne({ _id: existingUser._id }, userData);
// // // //       user = await User.findById(existingUser._id);
// // // //     } else {
// // // //       user = await User.create(userData);
// // // //     }

// // // // //     // Handle email verification
// // // // //    if (method === "email" && email) {
// // // // //   try {
// // // // //     const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
// // // // //     await sendEmail({
// // // // //       email,
// // // // //       emailType: "VERIFY",
// // // // //       userId: user._id,
// // // // //       otp,
// // // // //     });
// // // // //     console.log("[REGISTER] OTP email sent:", otp);
// // // // //   } catch (err: any) {
// // // // //     console.error("[REGISTER] register route.ts OTP email error:", err.message);
// // // // //     return NextResponse.json(
// // // // //       { success: false, message: "Failed to send verification code." },
// // // // //       { status: 500 }
// // // // //     );
// // // // //   }
// // // // // }

// // // //     // (Optional) Phone OTP logic can remain here if needed later

// // // //     return NextResponse.json(
// // // //       {
// // // //         success: true,
// // // //         message: `Verification sent via ${method}.`,
// // // //       },
// // // //       { status: 200 }
// // // //     );
// // // //   } catch (error: any) {
// // // //     console.error("[REGISTER] Unexpected error:", error);
// // // //     return NextResponse.json(
// // // //       {
// // // //         success: false,
// // // //         message: "Unexpected error occurred during registration.",
// // // //       },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }


// // // import { NextRequest, NextResponse } from "next/server";
// // // import { z } from "zod";
// // // import { dbConnect } from "@/lib/mongodb";
// // // import User from "@/models/User";
// // // import bcrypt from "bcryptjs";

// // // const addressSchema = z.object({
// // //   street: z.string().optional(),
// // //   area: z.string().optional(),
// // //   state: z.string(),
// // //   district: z.string(),
// // //   subDistrict: z.string(),
// // //   village: z.string(),
// // //   pincode: z.string(),
// // // });

// // // const registerSchema = z
// // //   .object({
// // //     name: z.string().min(2, "Name must be at least 2 characters"),
// // //     password: z.string().min(6, "Password must be at least 6 characters"),
// // //     email: z.string().email("Invalid email").optional(),
// // //     phone: z
// // //       .string()
// // //       .regex(/^\+?\d{10,15}$/, "Invalid phone number")
// // //       .optional(),
// // //     address: addressSchema,
// // //   })
// // //   .refine((data) => data.email || data.phone, {
// // //     message: "Either email or phone must be provided",
// // //     path: ["email"],
// // //   });

// // // export async function POST(req: NextRequest) {
// // //   try {
// // //     const body = await req.json();
// // //     console.log("[REGISTER] Received request:", body);

// // //     const parsed = registerSchema.safeParse(body);
// // //     if (!parsed.success) {
// // //       const errors = parsed.error.flatten().fieldErrors;
// // //       return NextResponse.json(
// // //         { success: false, message: "Validation failed", errors },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const { name, email, phone, password, address } = parsed.data;

// // //     await dbConnect();

// // //     const existingUser = await User.findOne({
// // //       $or: [{ email }, { phone }],
// // //     });

// // //     if (existingUser?.isVerified) {
// // //       return NextResponse.json(
// // //         {
// // //           success: false,
// // //           message: "A verified account already exists with this email or phone.",
// // //         },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const hashedPassword = await bcrypt.hash(password, 10);
// // //     const isAdmin = email === process.env.ADMIN_EMAIL;

// // //     const userData = {
// // //       name,
// // //       email: email || undefined,
// // //       phone: phone || undefined,
// // //       password: hashedPassword,
// // //       address,
// // //       isVerified: true, // Because OTP is already handled
// // //       isAdmin,
// // //       updatedAt: new Date(),
// // //     };

// // //     let user;

// // //     if (existingUser && !existingUser.isVerified) {
// // //       await User.updateOne({ _id: existingUser._id }, userData);
// // //       user = await User.findById(existingUser._id);
// // //     } else {
// // //       user = await User.create(userData);
// // //     }

// // //     return NextResponse.json(
// // //       {
// // //         success: true,
// // //         message: "User registered successfully.",
// // //         user: {
// // //           id: user._id,
// // //           name: user.name,
// // //           email: user.email,
// // //           phone: user.phone,
// // //           isAdmin: user.isAdmin,
// // //         },
// // //       },
// // //       { status: 200 }
// // //     );
// // //   } catch (error: any) {
// // //     console.error("[REGISTER] Unexpected error:", error);
// // //     return NextResponse.json(
// // //       {
// // //         success: false,
// // //         message: "Unexpected error occurred during registration.",
// // //       },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }


// // import { type NextRequest, NextResponse } from "next/server"
// // import { z } from "zod"
// // import bcrypt from "bcryptjs"
// // import { dbConnect } from "@/lib/mongodb"
// // import User from "@/models/User"


// // const addressSchema = z.object({
// //   street: z.string().min(1, "Street is required"),
// //   area: z.string().min(1, "Area is required"),
// //   state: z.string().min(1, "State is required"),
// //   district: z.string().min(1, "District is required"),
// //   subDistrict: z.string().min(1, "Sub-district is required"),
// //   village: z.string().min(1, "Village is required"),
// //   pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
// // })

// // const registerSchema = z
// //   .object({
// //     name: z.string().min(2, "Name must be at least 2 characters"),
// //     password: z.string().min(6, "Password must be at least 6 characters"),
// //     email: z.string().email("Invalid email").optional(),
// //     phone: z
// //       .string()
// //       .regex(/^\+?\d{10,15}$/, "Invalid phone number")
// //       .optional(),
// //     address: addressSchema,
// //   })
// //   .refine((data) => data.email || data.phone, {
// //     message: "Either email or phone must be provided",
// //     path: ["email"],
// //   })

// // export async function POST(req: NextRequest) {
// //   try {
// //     const body = await req.json()
// //     console.log("[REGISTER] Received request:", { ...body, password: "[HIDDEN]" })

// //     const parsed = registerSchema.safeParse(body)
// //     if (!parsed.success) {
// //       const errors = parsed.error.flatten().fieldErrors
// //       return NextResponse.json({ success: false, message: "Validation failed", errors }, { status: 400 })
// //     }

// //     const { name, email, phone, password, address } = parsed.data

// //     await dbConnect()

// //     // Check for existing verified user
// //     const existingUser = await User.findOne({
// //       $or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
// //     })

// //     if (existingUser?.isVerified) {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "A verified account already exists with this email or phone.",
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 12)

// //     // Check if admin using server-side env variable (not NEXT_PUBLIC_)
// //     const isAdmin = email === process.env.ADMIN_EMAIL

// //     const userData = {
// //       name,
// //       email: email || undefined,
// //       phone: phone || undefined,
// //       password: hashedPassword,
// //       address,
// //       isVerified: true, // Set to true since OTP verification was completed in previous step
// //       isAdmin,
// //       updatedAt: new Date(),
// //     }

// //     let user

// //     if (existingUser && !existingUser.isVerified) {
// //       // Update existing unverified user
// //       await User.updateOne({ _id: existingUser._id }, userData)
// //       user = await User.findById(existingUser._id).select("-password")
// //     } else {
// //       // Create new user
// //       user = await User.create(userData)
// //       user = await User.findById(user._id).select("-password")
// //     }

// //     return NextResponse.json(
// //       {
// //         success: true,
// //         message: `User registered successfully.${isAdmin ? " Admin privileges granted." : ""}`,
// //         user: {
// //           id: user._id,
// //           name: user.name,
// //           email: user.email,
// //           phone: user.phone,
// //           isAdmin: user.isAdmin,
// //         },
// //       },
// //       { status: 201 },
// //     )
// //   } catch (error: any) {
// //     console.error("[REGISTER] Unexpected error:", error)

// //     // Handle duplicate key errors
// //     if (error.code === 11000) {
// //       const field = Object.keys(error.keyPattern)[0]
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: `${field === "email" ? "Email" : "Phone number"} already exists.`,
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     return NextResponse.json(
// //       {
// //         success: false,
// //         message: "Unexpected error occurred during registration.",
// //       },
// //       { status: 500 },
// //     )
// //   }
// // }


// import { type NextRequest, NextResponse } from "next/server"
// import { z } from "zod"

// import bcrypt from "bcryptjs"
// import { encrypt } from "@/lib/auth"
// import type { SessionPayload } from "@/lib/auth"
// import { dbConnect } from "@/lib/mongodb"
// import User from "@/models/User"

// const addressSchema = z.object({
//   street: z.string().min(1, "Street is required"),
//   area: z.string().min(1, "Area is required"),
//   state: z.string().min(1, "State is required"),
//   district: z.string().min(1, "District is required"),
//   subDistrict: z.string().min(1, "Sub-district is required"),
//   village: z.string().min(1, "Village is required"),
//   pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
// })

// const registerSchema = z
//   .object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     email: z.string().email("Invalid email").optional(),
//     phone: z
//       .string()
//       .regex(/^\+?\d{10,15}$/, "Invalid phone number")
//       .optional(),
//     address: addressSchema,
//   })
//   .refine((data) => data.email || data.phone, {
//     message: "Either email or phone must be provided",
//     path: ["email"],
//   })

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     console.log("[REGISTER] Received request:", { ...body, password: "[HIDDEN]" })

//     const parsed = registerSchema.safeParse(body)
//     if (!parsed.success) {
//       const errors = parsed.error.flatten().fieldErrors
//       return NextResponse.json({ success: false, message: "Validation failed", errors }, { status: 400 })
//     }

//     const { name, email, phone, password, address } = parsed.data

//     await dbConnect()

//     // Check for existing verified user
//     const existingUser = await User.findOne({
//       $or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
//     })

//     if (existingUser?.isVerified) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "A verified account already exists with this email or phone.",
//         },
//         { status: 400 },
//       )
//     }

//     const hashedPassword = await bcrypt.hash(password, 12)

//     // Check if admin using server-side env variable (not NEXT_PUBLIC_)
//     const isAdmin = email === process.env.ADMIN_EMAIL

//     const userData = {
//       name,
//       email: email || undefined,
//       phone: phone || undefined,
//       password: hashedPassword,
//       address,
//       isVerified: true, // Set to true since OTP verification was completed in previous step
//       isAdmin,
//       updatedAt: new Date(),
//     }

//     let user

//     if (existingUser && !existingUser.isVerified) {
//       // Update existing unverified user
//       await User.updateOne({ _id: existingUser._id }, userData)
//       user = await User.findById(existingUser._id).select("-password")
//     } else {
//       // Create new user
//       user = await User.create(userData)
//       user = await User.findById(user._id).select("-password")
//     }

//     // Create session payload
//     const sessionPayload: SessionPayload = {
//       userId: user._id.toString(),
//       email: user.email,
//       phone: user.phone,
//       name: user.name,
//       isAdmin: user.isAdmin,
//       isVerified: user.isVerified,
//     }

//     // Create encrypted session
//     const encryptedSession = await encrypt(sessionPayload)

//     // Create response
//     const response = NextResponse.json(
//       {
//         success: true,
//         message: `User registered successfully.${isAdmin ? " Admin privileges granted." : ""}`,
//         user: {
//           userId: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           phone: user.phone,
//           isAdmin: user.isAdmin,
//           isVerified: user.isVerified,
//         },
//       },
//       { status: 201 },
//     )

//     // Set HTTP-only cookie
//     response.cookies.set({
//       name: "auth-token",
//       value: encryptedSession,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     })

//     return response
//   } catch (error: any) {
//     console.error("[REGISTER] Unexpected error:", error)

//     // Handle duplicate key errors
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0]
//       return NextResponse.json(
//         {
//           success: false,
//           message: `${field === "email" ? "Email" : "Phone number"} already exists.`,
//         },
//         { status: 400 },
//       )
//     }

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Unexpected error occurred during registration.",
//       },
//       { status: 500 },
//     )
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { dbConnect } from "@/lib/mongodb"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"
import { encrypt } from "@/lib/auth"
import type { SessionPayload } from "@/lib/auth"

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  area: z.string().min(1, "Area is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  subDistrict: z.string().min(1, "Sub-district is required"),
  village: z.string().min(1, "Village is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
})

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Invalid email").optional(),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/, "Invalid phone number")
      .optional(),
    address: addressSchema,
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
  })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("[REGISTER] Received request:", { ...body, password: "[HIDDEN]" })

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ success: false, message: "Validation failed", errors }, { status: 400 })
    }

    const { name, email, phone, password, address } = parsed.data

    await dbConnect()

    const existingUser = await User.findOne({
      $or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
    })

    if (existingUser?.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "A verified account already exists with this email or phone.",
        },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const isAdmin = email === process.env.ADMIN_EMAIL

    const userData = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      password: hashedPassword,
      address,
      isVerified: true,
      isAdmin,
      updatedAt: new Date(),
    }

    let user
    if (existingUser && !existingUser.isVerified) {
      await User.updateOne({ _id: existingUser._id }, userData)
      user = await User.findById(existingUser._id).select("-password")
    } else {
      user = await User.create(userData)
      user = await User.findById(user._id).select("-password")
    }

    const sessionPayload: SessionPayload = {
      userId: user._id.toString(),
      email: user.email,
      phone: user.phone,
      name: user.name,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    }

    const encryptedSession = await encrypt(sessionPayload)

    const response = NextResponse.json(
      {
        success: true,
        message: `User registered successfully.${isAdmin ? " Admin privileges granted." : ""}`,
        user: {
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
        },
      },
      { status: 201 },
    )

    response.cookies.set({
      name: "jwt-token",
      value: encryptedSession,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error: any) {
    // console.error("[REGISTER] Unexpected error:", error)

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        {
          success: false,
          message: `${field === "email" ? "Email" : "Phone number"} already exists.`,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error occurred during registration.",
      },
      { status: 500 },
    )
  }
}
