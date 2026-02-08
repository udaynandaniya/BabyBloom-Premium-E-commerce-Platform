export const dynamic = 'force-dynamic';
// //C:\Users\UDAYN\Downloads\Projects\mahadev-baby - Copy\app\api\products\batch-details\route.ts

// import { type NextRequest, NextResponse } from "next/server"
// import { dbConnect } from "@/lib/mongodb"
// import ClothesModel from "@/lib/models/clothes"
// import { BathItemModel, NewbornItemModel, ToyModel } from "@/lib/models"

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect()

//     const { products } = await request.json()

//     if (!products || !Array.isArray(products)) {
//       return NextResponse.json({ error: "Invalid products array" }, { status: 400 })
//     }

//     const updatedProducts = []

//     for (const productRequest of products) {
//       const { _id, categoryTypemodel } = productRequest

//       let product = null

//       switch (categoryTypemodel) {
//         case "clothes":
//           product = await ClothesModel.findById(_id)
//           break
//         case "toy":
//           product = await ToyModel.findById(_id)
//           break
//         case "bath":
//           product = await BathItemModel.findById(_id)
//           break
//         case "newborn":
//           product = await NewbornItemModel.findById(_id)
//           break
//       }

//        //upadte her to add also productCode and i gurtended u that its predsent in whoke models deon worry
//       if (product) {
//         updatedProducts.push({
//           _id: product._id,
//           name: product.name,
//           sellingPrice: product.sellingPrice,
//           actualPrice: product.actualPrice,
//           inStock: product.inStock,
//           weightInGrams: product.weightInGrams,
//           images: product.images,
//         })
//       }
//     }

//     return NextResponse.json({ success: true, data: updatedProducts })
//   } catch (error) {
//     console.error("Error fetching batch product details:", error)
//     return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import ClothesModel from "@/lib/models/clothes"
import { BathItemModel, NewbornItemModel, ToyModel } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { products } = await request.json()

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products array" }, { status: 400 })
    }

    const updatedProducts = []

    for (const productRequest of products) {
      const { _id, categoryTypemodel } = productRequest
      let product = null

      switch (categoryTypemodel) {
        case "clothes":
          product = await ClothesModel.findById(_id)
          break
        case "toy":
          product = await ToyModel.findById(_id)
          break
        case "bath":
          product = await BathItemModel.findById(_id)
          break
        case "newborn":
          product = await NewbornItemModel.findById(_id)
          break
      }

      if (product) {
        updatedProducts.push({
          _id: product._id,
          name: product.name,
          sellingPrice: product.sellingPrice,
          actualPrice: product.actualPrice,
          inStock: product.inStock,
          weightInGrams: product.weightInGrams,
          images: product.images,
          productCode: product.productCode, // Added productCode
        })
      }
    }

    return NextResponse.json({ success: true, data: updatedProducts })
  } catch (error) {
    console.error("Error fetching batch product details:", error)
    return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 })
  }
}
