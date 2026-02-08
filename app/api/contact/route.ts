export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { CartModel } from "@/lib/models/cart"
import { ClothesModel } from "@/lib/models/clothes"
// Import other models as needed

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")

    if (!userEmail) {
      return NextResponse.json({ success: false, error: "User email is required" }, { status: 400 })
    }

    await dbConnect()

    const cartItems = await CartModel.find({ userEmail }).sort({ addedAt: -1 })

    // Fetch full product details for each cart item
    const cartWithDetails = await Promise.all(
      cartItems.map(async (cartItem) => {
        let product = null

        switch (cartItem.categoryTypeModel) {
          case "clothes":
            product = await ClothesModel.findOne({ productCode: cartItem.productCode })
            break
          // Add other cases for toy, bath, newborn models
        }

        return {
          ...cartItem.toObject(),
          product,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: cartWithDetails,
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userEmail, productCode, categoryTypeModel, quantity = 1 } = await request.json()

    if (!userEmail || !productCode || !categoryTypeModel) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Fetch product details
    let product = null
    switch (categoryTypeModel) {
      case "clothes":
        product = await ClothesModel.findOne({ productCode })
        break
      // Add other cases
    }

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    if (product.inStock < quantity) {
      return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 })
    }

    // Check if item already exists in cart
    const existingCartItem = await CartModel.findOne({ userEmail, productCode })

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity
      if (newQuantity > product.inStock) {
        return NextResponse.json({ success: false, error: "Cannot add more than available stock" }, { status: 400 })
      }

      existingCartItem.quantity = newQuantity
      await existingCartItem.save()

      return NextResponse.json({
        success: true,
        message: "Cart updated successfully",
        data: existingCartItem,
      })
    } else {
      const cartItem = await CartModel.create({
        userEmail,
        productCode,
        categoryTypeModel,
        quantity,
        weightInGrams: product.weightInGrams,
        priceAtAdd: product.sellingPrice,
      })

      return NextResponse.json({
        success: true,
        message: "Item added to cart successfully",
        data: cartItem,
      })
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ success: false, error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { userEmail, productCode, quantity } = await request.json()

    if (!userEmail || !productCode || quantity < 1) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
    }

    await dbConnect()

    const cartItem = await CartModel.findOne({ userEmail, productCode })
    if (!cartItem) {
      return NextResponse.json({ success: false, error: "Cart item not found" }, { status: 404 })
    }

    // Fetch product to check stock
    let product = null
    switch (cartItem.categoryTypeModel) {
      case "clothes":
        product = await ClothesModel.findOne({ productCode })
        break
      // Add other cases
    }

    if (!product || quantity > product.inStock) {
      return NextResponse.json({ success: false, error: "Insufficient stock" }, { status: 400 })
    }

    cartItem.quantity = quantity
    await cartItem.save()

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
      data: cartItem,
    })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")
    const productCode = searchParams.get("productCode")

    if (!userEmail || !productCode) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    await dbConnect()

    await CartModel.deleteOne({ userEmail, productCode })

    return NextResponse.json({
      success: true,
      message: "Item removed from cart successfully",
    })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ success: false, error: "Failed to remove from cart" }, { status: 500 })
  }
}
