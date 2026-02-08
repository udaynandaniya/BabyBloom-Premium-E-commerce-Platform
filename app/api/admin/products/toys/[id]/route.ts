

// // import { NextResponse } from "next/server"
// // import { dbConnect } from "@/lib/mongodb"
// // import ToyModel from "@/lib/models/toy"
// // import { toySchema } from "@/lib/validations/toy-schema"
// // import { syncStockToManager, deleteFromStockManager } from "@/lib/utils/stock-sync"

// // export async function PUT(request: Request, { params }: { params: { id: string } }) {
// //   try {
// //     await dbConnect()
// //     const data = await request.json()

// //     // Validate with Zod schema
// //     const validatedData = toySchema.parse(data)

// //     // Find existing toy
// //     const existingToy = await ToyModel.findById(params.id)
// //     if (!existingToy) {
// //       return NextResponse.json({ success: false, message: "Toy not found" }, { status: 404 })
// //     }

// //     // Update toy
// //     const updatedToy = await ToyModel.findByIdAndUpdate(params.id, validatedData, { new: true, runValidators: true })

// //     if (!updatedToy) {
// //       return NextResponse.json({ success: false, message: "Failed to update toy" }, { status: 500 })
// //     }

// //     // Sync stock changes with stock manager
// //     await syncStockToManager(
// //       updatedToy._id.toString(),
// //       updatedToy.productCode,
// //       updatedToy.name,
// //       updatedToy.inStock,
// //       "toy",
// //     )

// //     return NextResponse.json({
// //       success: true,
// //       data: updatedToy,
// //       message: "Toy updated successfully",
// //     })
// //   } catch (error: any) {
// //     console.error("Error updating toy:", error)

// //     if (error.name === "ZodError") {
// //       return NextResponse.json(
// //         {
// //           success: false,
// //           message: "Validation error",
// //           errors: error.errors,
// //         },
// //         { status: 400 },
// //       )
// //     }

// //     return NextResponse.json({ success: false, message: error.message || "Failed to update toy" }, { status: 500 })
// //   }
// // }

// // export async function DELETE(request: Request, { params }: { params: { id: string } }) {
// //   try {
// //     await dbConnect()

// //     // Find the toy to get product code before deletion
// //     const toy = await ToyModel.findById(params.id)
// //     if (!toy) {
// //       return NextResponse.json({ success: false, message: "Toy not found" }, { status: 404 })
// //     }

// //     // Delete toy
// //     await ToyModel.findByIdAndDelete(params.id)

// //     // Delete from stock manager
// //     await deleteFromStockManager(toy.productCode)

// //     return NextResponse.json({
// //       success: true,
// //       message: "Toy deleted successfully",
// //     })
// //   } catch (error: any) {
// //     console.error("Error deleting toy:", error)
// //     return NextResponse.json({ success: false, message: error.message || "Failed to delete toy" }, { status: 500 })
// //   }
// // }


// import { NextResponse } from "next/server"
// import { dbConnect } from "@/lib/mongodb"
// import ToyModel from "@/lib/models/toy"
// import { toySchema } from "@/lib/validations/toy-schema"
// import { syncStockToManager, deleteFromStockManager } from "@/lib/utils/stock-sync"

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     await dbConnect()
//     const data = await request.json()

//     // Validate with Zod schema
//     const validatedData = toySchema.parse(data)

//     // Find existing toy
//     const existingToy = await ToyModel.findById(params.id)
//     if (!existingToy) {
//       return NextResponse.json({ success: false, message: "Toy not found" }, { status: 404 })
//     }

//     // Update toy
//     const updatedToy = await ToyModel.findByIdAndUpdate(params.id, validatedData, { new: true, runValidators: true })

//     if (!updatedToy) {
//       return NextResponse.json({ success: false, message: "Failed to update toy" }, { status: 500 })
//     }

//     // Sync stock changes with stock manager
//     await syncStockToManager(
//       updatedToy._id.toString(),
//       updatedToy.productCode,
//       updatedToy.name,
//       updatedToy.inStock,
//       "toy",
//     )

//     return NextResponse.json({
//       success: true,
//       data: updatedToy,
//       message: "Toy updated successfully",
//     })
//   } catch (error: any) {
//     console.error("Error updating toy:", error)

//     if (error.name === "ZodError") {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Validation error",
//           errors: error.errors,
//         },
//         { status: 400 },
//       )
//     }

//     return NextResponse.json({ success: false, message: error.message || "Failed to update toy" }, { status: 500 })
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     await dbConnect()

//     // Find the toy to get product code and images before deletion
//     const toy = await ToyModel.findById(params.id)
//     if (!toy) {
//       return NextResponse.json({ success: false, message: "Toy not found" }, { status: 404 })
//     }

//     // Delete images from Cloudinary
//     if (toy.images && toy.images.length > 0) {
//       await deleteCloudinaryImages(toy.images)
//     }

//     // Delete toy from database
//     await ToyModel.findByIdAndDelete(params.id)

//     // Delete from stock manager
//     await deleteFromStockManager(toy.productCode)

//     return NextResponse.json({
//       success: true,
//       message: "Toy and associated images deleted successfully",
//     })
//   } catch (error: any) {
//     console.error("Error deleting toy:", error)
//     return NextResponse.json({ success: false, message: error.message || "Failed to delete toy" }, { status: 500 })
//   }
// }

// // Helper function to delete images from Cloudinary
// async function deleteCloudinaryImages(imageUrls: string[]) {
//   try {
//     const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
//     const apiKey = process.env.CLOUDINARY_API_KEY
//     const apiSecret = process.env.CLOUDINARY_API_SECRET

//     if (!cloudName || !apiKey || !apiSecret) {
//       console.warn("Cloudinary credentials not found. Images will not be deleted from Cloudinary.")
//       return
//     }

//     const deletePromises = imageUrls.map(async (imageUrl) => {
//       try {
//         // Extract public_id from Cloudinary URL
//         const publicId = extractPublicIdFromUrl(imageUrl)
//         if (!publicId) {
//           console.warn(`Could not extract public_id from URL: ${imageUrl}`)
//           return
//         }

//         // Create signature for authentication
//         const timestamp = Math.round(new Date().getTime() / 1000)
//         const signature = await createSignature(publicId, timestamp, apiSecret)

//         // Delete from Cloudinary
//         const formData = new FormData()
//         formData.append("public_id", publicId)
//         formData.append("signature", signature)
//         formData.append("api_key", apiKey)
//         formData.append("timestamp", timestamp.toString())

//         const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
//           method: "POST",
//           body: formData,
//         })

//         const result = await response.json()

//         if (result.result === "ok") {
//           console.log(`Successfully deleted image: ${publicId}`)
//         } else {
//           console.warn(`Failed to delete image ${publicId}:`, result)
//         }
//       } catch (error) {
//         console.error(`Error deleting image ${imageUrl}:`, error)
//       }
//     })

//     await Promise.allSettled(deletePromises)
//   } catch (error) {
//     console.error("Error in deleteCloudinaryImages:", error)
//   }
// }

// // Extract public_id from Cloudinary URL
// function extractPublicIdFromUrl(url: string): string | null {
//   try {
//     // Handle different Cloudinary URL formats
//     const regex = /\/(?:v\d+\/)?([^/.]+)(?:\.[^.]+)?$/
//     const match = url.match(regex)
//     return match ? match[1] : null
//   } catch (error) {
//     console.error("Error extracting public_id:", error)
//     return null
//   }
// }

// // Create signature for Cloudinary API authentication
// async function createSignature(publicId: string, timestamp: number, apiSecret: string): Promise<string> {
//   const crypto = await import("crypto")
//   const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
//   return crypto.createHash("sha1").update(stringToSign).digest("hex")
// }



import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import ToyModel from "@/lib/models/toy"
import { toySchema } from "@/lib/validations/toy-schema"
import { syncStockToManager, deleteFromStockManager } from "@/lib/utils/stock-sync"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const data = await request.json()

    // Validate with Zod schema
    const validatedData = toySchema.parse(data)

    // Find existing toy
    const existingToy = await ToyModel.findById(params.id)
    if (!existingToy) {
      return NextResponse.json({ success: false, message: "Toy not found" }, { status: 404 })
    }

    // Update toy
    const updatedToy = await ToyModel.findByIdAndUpdate(params.id, validatedData, { new: true, runValidators: true })

    if (!updatedToy) {
      return NextResponse.json({ success: false, message: "Failed to update toy" }, { status: 500 })
    }

    // Sync stock changes with stock manager
    await syncStockToManager(
      updatedToy._id.toString(),
      updatedToy.productCode,
      updatedToy.name,
      updatedToy.inStock,
      "toy",
    )

    return NextResponse.json({
      success: true,
      data: updatedToy,
      message: "Toy updated successfully",
    })
  } catch (error: any) {
    console.error("Error updating toy:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ success: false, message: error.message || "Failed to update toy" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Find the toy to get product code and images before deletion
    const toy = await ToyModel.findById(params.id)
    if (!toy) {
      return NextResponse.json({ success: false, message: "Toy not found" }, { status: 404 })
    }

    // Delete images from Cloudinary
    if (toy.images && toy.images.length > 0) {
      await deleteCloudinaryImages(toy.images)
    }

    // Delete toy from database
    await ToyModel.findByIdAndDelete(params.id)

    // Delete from stock manager
    await deleteFromStockManager(toy.productCode)

    return NextResponse.json({
      success: true,
      message: "Toy and associated images deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting toy:", error)
    return NextResponse.json({ success: false, message: error.message || "Failed to delete toy" }, { status: 500 })
  }
}

// Helper function to delete images from Cloudinary
async function deleteCloudinaryImages(imageUrls: string[]) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("Cloudinary credentials not found. Images will not be deleted from Cloudinary.")
      // console.log("Available env vars:", { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret })
      return
    }

    const deletePromises = imageUrls.map(async (imageUrl) => {
      try {
        // Extract public_id from Cloudinary URL
        const publicId = extractPublicIdFromUrl(imageUrl)
        if (!publicId) {
          console.warn(`Could not extract public_id from URL: ${imageUrl}`)
          return
        }

        // Create signature for authentication
        const timestamp = Math.round(new Date().getTime() / 1000)
        const signature = await createSignature(publicId, timestamp, apiSecret)

        // Delete from Cloudinary
        const formData = new FormData()
        formData.append("public_id", publicId)
        formData.append("signature", signature)
        formData.append("api_key", apiKey)
        formData.append("timestamp", timestamp.toString())

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (result.result === "ok") {
          // console.log(`Successfully deleted image: ${publicId}`)
        } else if (result.result === "not found") {
          // console.log(`Image already deleted or not found: ${publicId}`)
        } else {
          // console.warn(`Failed to delete image ${publicId}:`, result)
        }
      } catch (error) {
        console.error(`Error deleting image ${imageUrl}:`, error)
      }
    })

    await Promise.allSettled(deletePromises)
  } catch (error) {
    console.error("Error in deleteCloudinaryImages:", error)
  }
}

// Extract public_id from Cloudinary URL
function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Handle different Cloudinary URL formats
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg -> sample
    // Example: https://res.cloudinary.com/demo/image/upload/sample.jpg -> sample
    const urlParts = url.split("/")
    const uploadIndex = urlParts.findIndex((part) => part === "upload")

    if (uploadIndex === -1) return null

    // Get the part after 'upload' (skip version if present)
    let publicIdPart = urlParts[uploadIndex + 1]
    if (publicIdPart && publicIdPart.startsWith("v")) {
      // Skip version, get next part
      publicIdPart = urlParts[uploadIndex + 2]
    }

    if (!publicIdPart) return null

    // Remove file extension
    return publicIdPart.split(".")[0]
  } catch (error) {
    console.error("Error extracting public_id:", error)
    return null
  }
}

// Create signature for Cloudinary API authentication
async function createSignature(publicId: string, timestamp: number, apiSecret: string): Promise<string> {
  const crypto = await import("crypto")
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  return crypto.createHash("sha1").update(stringToSign).digest("hex")
}
