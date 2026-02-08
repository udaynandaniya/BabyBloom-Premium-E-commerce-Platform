export const dynamic = 'force-dynamic';
// // // //C:\Users\UDAYN\Downloads\Projects\mahadev-baby\app\api\products\route.ts

// // // import { type NextRequest, NextResponse } from "next/server"

// // // // GET - Fetch all products
// // // export async function GET(request: NextRequest) {
// // //   try {
// // //     // Replace with actual database query
// // //     const products = []

// // //     return NextResponse.json({
// // //       success: true,
// // //       data: products,
// // //       total: products.length,
// // //     })
// // //   } catch (error) {
// // //     return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
// // //   }
// // // }

// // // // POST - Add new product
// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     const formData = await request.formData()

// // //     // Extract form data
// // //     const productData = {
// // //       name: formData.get("name") as string,
// // //       description: formData.get("description") as string,
// // //       price: Number.parseFloat(formData.get("price") as string),
// // //       originalPrice: formData.get("originalPrice") ? Number.parseFloat(formData.get("originalPrice") as string) : null,
// // //       category: formData.get("category") as string,
// // //       subcategory: formData.get("subcategory") as string,
// // //       brand: formData.get("brand") as string,
// // //       ageGroup: formData.get("ageGroup") as string,
// // //       size: JSON.parse((formData.get("size") as string) || "[]"),
// // //       color: JSON.parse((formData.get("color") as string) || "[]"),
// // //       material: formData.get("material") as string,
// // //       weight: formData.get("weight") as string,
// // //       dimensions: formData.get("dimensions") as string,
// // //       stock: Number.parseInt(formData.get("stock") as string),
// // //       minStock: formData.get("minStock") ? Number.parseInt(formData.get("minStock") as string) : 0,
// // //       sku: formData.get("sku") as string,
// // //       barcode: formData.get("barcode") as string,
// // //       tags: JSON.parse((formData.get("tags") as string) || "[]"),
// // //       isActive: formData.get("isActive") === "true",
// // //       isFeatured: formData.get("isFeatured") === "true",
// // //       seoTitle: formData.get("seoTitle") as string,
// // //       seoDescription: formData.get("seoDescription") as string,
// // //       metaKeywords: JSON.parse((formData.get("metaKeywords") as string) || "[]"),
// // //       createdAt: new Date(),
// // //       updatedAt: new Date(),
// // //     }

// // //     // Handle file uploads
// // //     const images = formData.getAll("images") as File[]
// // //     const documents = formData.getAll("documents") as File[]

// // //     // Process and save files (implement file upload logic)
// // //     const imageUrls: string[] = []
// // //     const documentUrls: string[] = []

// // //     for (const image of images) {
// // //       // Save image and get URL
// // //       const imageUrl = await saveFile(image, "images")
// // //       imageUrls.push(imageUrl)
// // //     }

// // //     for (const document of documents) {
// // //       // Save document and get URL
// // //       const documentUrl = await saveFile(document, "documents")
// // //       documentUrls.push(documentUrl)
// // //     }

// // //     // Add URLs to product data
// // //     productData.images = imageUrls
// // //     productData.documents = documentUrls

// // //     // Save to database (implement database logic)
// // //     const savedProduct = await saveProductToDatabase(productData)

// // //     return NextResponse.json({
// // //       success: true,
// // //       data: savedProduct,
// // //       message: "Product added successfully",
// // //     })
// // //   } catch (error) {
// // //     console.error("Error adding product:", error)
// // //     return NextResponse.json({ success: false, error: "Failed to add product" }, { status: 500 })
// // //   }
// // // }

// // // // Helper function to save files
// // // async function saveFile(file: File, folder: string): Promise<string> {
// // //   // Implement file saving logic (e.g., to cloud storage)
// // //   // Return the URL of the saved file
// // //   return `/uploads/${folder}/${Date.now()}-${file.name}`
// // // }

// // // // Helper function to save product to database
// // // async function saveProductToDatabase(productData: any) {
// // //   // Implement database saving logic
// // //   // Return the saved product with ID
// // //   return {
// // //     id: Date.now().toString(),
// // //     ...productData,
// // //   }
// // // }


// // import { type NextRequest, NextResponse } from "next/server"
// // import { getDatabase } from "@/lib/mongodb"
// // import type { Product } from "@/lib/models/Product"
// // import jwt from "jsonwebtoken"

// // export async function GET(request: NextRequest) {
// //   try {
// //     const db = await getDatabase()
// //     const products = await db.collection<Product>("products").find({ isActive: true }).sort({ createdAt: -1 }).toArray()

// //     return NextResponse.json({
// //       success: true,
// //       data: products,
// //       total: products.length,
// //     })
// //   } catch (error) {
// //     console.error("Error fetching products:", error)
// //     return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
// //   }
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     // Add at the top of the POST function
// //     const token = request.cookies.get("token")?.value
// //     if (!token) {
// //       return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
// //     }

// //     try {
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
// //       // Check if user is admin for product creation
// //       if (decoded.id !== "admin-001") {
// //         return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 })
// //       }
// //     } catch (error) {
// //       return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
// //     }

// //     const formData = await request.formData()

// //     const productData: Omit<Product, "_id"> = {
// //       name: formData.get("name") as string,
// //       description: formData.get("description") as string,
// //       price: Number.parseFloat(formData.get("price") as string),
// //       originalPrice: formData.get("originalPrice")
// //         ? Number.parseFloat(formData.get("originalPrice") as string)
// //         : undefined,
// //       category: formData.get("category") as "clothes" | "toys" | "newborn",
// //       subcategory: formData.get("subcategory") as string,
// //       brand: formData.get("brand") as string,
// //       ageRange: JSON.parse((formData.get("ageRange") as string) || "[]"),
// //       gender: formData.get("gender") as "boy" | "girl" | "unisex",
// //       size: JSON.parse((formData.get("size") as string) || "[]"),
// //       color: JSON.parse((formData.get("color") as string) || "[]"),
// //       material: formData.get("material") as string,
// //       weight: formData.get("weight") as string,
// //       dimensions: formData.get("dimensions") as string,
// //       stock: Number.parseInt(formData.get("stock") as string),
// //       minStock: formData.get("minStock") ? Number.parseInt(formData.get("minStock") as string) : 0,
// //       sku: formData.get("sku") as string,
// //       barcode: formData.get("barcode") as string,
// //       tags: JSON.parse((formData.get("tags") as string) || "[]"),
// //       isActive: formData.get("isActive") === "true",
// //       isFeatured: formData.get("isFeatured") === "true",
// //       seoTitle: formData.get("seoTitle") as string,
// //       seoDescription: formData.get("seoDescription") as string,
// //       metaKeywords: JSON.parse((formData.get("metaKeywords") as string) || "[]"),
// //       images: [], // Will be populated after file upload
// //       createdAt: new Date(),
// //       updatedAt: new Date(),
// //     }

// //     // In the POST function, after creating productData but before saving to database:
// //     productData.minStock = formData.get("minStock") ? Number.parseInt(formData.get("minStock") as string) : 5 // Default min stock
// //     productData.stock = Number.parseInt(formData.get("stock") as string) || 0

// //     // Ensure stock is never negative
// //     if (productData.stock < 0) {
// //       productData.stock = 0
// //     }

// //     // Handle file uploads
// //     const images = formData.getAll("images") as File[]
// //     const imageUrls: string[] = []

// //     for (const image of images) {
// //       const imageUrl = await saveFile(image, "images")
// //       imageUrls.push(imageUrl)
// //     }

// //     productData.images = imageUrls

// //     const db = await getDatabase()
// //     const result = await db.collection<Product>("products").insertOne(productData)

// //     const savedProduct = await db.collection<Product>("products").findOne({ _id: result.insertedId })

// //     return NextResponse.json({
// //       success: true,
// //       data: savedProduct,
// //       message: "Product added successfully",
// //     })
// //   } catch (error) {
// //     console.error("Error adding product:", error)
// //     return NextResponse.json({ success: false, error: "Failed to add product" }, { status: 500 })
// //   }
// // }

// // async function saveFile(file: File, folder: string): Promise<string> {
// //   // For now, return a placeholder URL
// //   // In production, implement actual file upload to cloud storage
// //   return `/uploads/${folder}/${Date.now()}-${file.name}`
// // }



// import { type NextRequest, NextResponse } from "next/server"
// import { dbConnect } from "@/lib/mongodb"
// import { ProductModel } from "@/lib/models/Product"
// import jwt from "jsonwebtoken"

// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect()

//     const products = await ProductModel.find({ isActive: true })
//       .sort({ createdAt: -1 })
//       .lean()

//     return NextResponse.json({
//       success: true,
//       data: products,
//       total: products.length,
//     })
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const token = request.cookies.get("token")?.value
//     if (!token) {
//       return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
//       if (decoded.id !== "admin-001") {
//         return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 })
//       }
//     } catch (error) {
//       return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
//     }

//     const formData = await request.formData()

//     const productData = {
//       name: formData.get("name") as string,
//       description: formData.get("description") as string,
//       price: Number.parseFloat(formData.get("price") as string),
//       originalPrice: formData.get("originalPrice")
//         ? Number.parseFloat(formData.get("originalPrice") as string)
//         : undefined,
//       category: formData.get("category") as "clothes" | "toys" | "newborn",
//       subcategory: formData.get("subcategory") as string,
//       brand: formData.get("brand") as string,
//       ageRange: JSON.parse((formData.get("ageRange") as string) || "[]"),
//       gender: formData.get("gender") as "boy" | "girl" | "unisex",
//       size: JSON.parse((formData.get("size") as string) || "[]"),
//       color: JSON.parse((formData.get("color") as string) || "[]"),
//       material: formData.get("material") as string,
//       weight: formData.get("weight") as string,
//       dimensions: formData.get("dimensions") as string,
//       stock: Math.max(Number.parseInt(formData.get("stock") as string) || 0, 0),
//       minStock: formData.get("minStock") ? Number.parseInt(formData.get("minStock") as string) : 5,
//       sku: formData.get("sku") as string,
//       barcode: formData.get("barcode") as string,
//       tags: JSON.parse((formData.get("tags") as string) || "[]"),
//       isActive: formData.get("isActive") === "true",
//       isFeatured: formData.get("isFeatured") === "true",
//       seoTitle: formData.get("seoTitle") as string,
//       seoDescription: formData.get("seoDescription") as string,
//       metaKeywords: JSON.parse((formData.get("metaKeywords") as string) || "[]"),
//       images: [],
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }

//     // Handle file uploads
//     const images = formData.getAll("images") as File[]
//     const imageUrls: string[] = []

//     for (const image of images) {
//       const imageUrl = await saveFile(image, "images")
//       imageUrls.push(imageUrl)
//     }

//     productData.images = imageUrls

//     await dbConnect()
//     const product = await ProductModel.create(productData)

//     return NextResponse.json({
//       success: true,
//       data: product,
//       message: "Product added successfully",
//     })
//   } catch (error) {
//     console.error("Error adding product:", error)
//     return NextResponse.json({ success: false, error: "Failed to add product" }, { status: 500 })
//   }
// }

// async function saveFile(file: File, folder: string): Promise<string> {
//   return `/uploads/${folder}/${Date.now()}-${file.name}`
// }



import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { getModelByCategory } from "@/lib/utils/getModelByCategory"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") || "clothes"
  const Model = getModelByCategory(category)

  try {
    await dbConnect()
    const products = await Model.find({ isActive: true }).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: products, total: products.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("jwt-token")?.value
  if (!token) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })

  let decoded: any
  try { decoded = jwt.verify(token, process.env.JWT_SECRET!) }
  catch { return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 }) }

  if (decoded.id !== "admin-001") return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 })

  const formData = await request.formData()
  const category = formData.get("category") as string
  const Model = getModelByCategory(category)

  const productData: any = {
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    inStock: Math.max(Number(formData.get("stock") || 0), 0),
    images: [],
    description: formData.get("description") as string,
    // add any other fields as per the model
  }

  const images = formData.getAll("images") as File[]
  productData.images = await Promise.all(images.map(img => saveFile(img, "images")))

  try {
    await dbConnect()
    const newProduct = await Model.create(productData)
    return NextResponse.json({ success: true, data: newProduct, message: "Product added successfully" })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "Failed to add product" }, { status: 500 })
  }
}

async function saveFile(file: File, folder: string): Promise<string> {
  return `/uploads/${folder}/${Date.now()}-${file.name}`
}
