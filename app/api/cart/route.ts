export const dynamic = 'force-dynamic';
import { type NextRequest, NextResponse } from "next/server"
import CartModel from "@/lib/models/cart"
import ClothesModel from "@/lib/models/clothes"
import { dbConnect } from "@/lib/mongodb"
import ToyModel from "@/lib/models/toy"
import BathModel from "@/lib/models/bath"
import NewbornModel from "@/lib/models/newborn"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    const cartItems = await CartModel.find({ userEmail }).sort({ addedAt: -1 })

    // Fetch product details for each cart item
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        let product = null

        switch (item.categoryTypeModel) {
          case "clothes":
            product = await ClothesModel.findOne({ productCode: item.productCode })
            break
          case "toy":
            product = await ToyModel.findOne({ productCode: item.productCode })
            break
          case "bath":
            product = await BathModel.findOne({ productCode: item.productCode })
            break
          case "newborn":
            product = await NewbornModel.findOne({ productCode: item.productCode })
            break
        }

        return {
          ...item.toObject(),
          product: product
            ? {
                name: product.name,
                images: product.images,
                sellingPrice: product.sellingPrice,
                actualPrice: product.actualPrice,
                inStock: product.inStock,
              }
            : null,
        }
      }),
    )

    return NextResponse.json({ success: true, data: itemsWithDetails })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { userEmail, productCode, categoryTypeModel, quantity = 1 } = await request.json()

    if (!userEmail || !productCode || !categoryTypeModel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch product details
    let product = null
    switch (categoryTypeModel) {
      case "clothes":
        product = await ClothesModel.findOne({ productCode })
        break
      // Add other cases as needed
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.inStock < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    // Check if item already exists in cart
    const existingItem = await CartModel.findOne({ userEmail, productCode })

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity > product.inStock) {
        return NextResponse.json({ error: "Cannot add more than available stock" }, { status: 400 })
      }

      existingItem.quantity = newQuantity
      await existingItem.save()

      return NextResponse.json({ success: true, data: existingItem })
    } else {
      const cartItem = await CartModel.create({
        userEmail,
        productCode,
        categoryTypeModel,
        quantity,
        weightInGrams: product.weightInGrams,
        priceAtAdd: product.sellingPrice,
      })

      return NextResponse.json({ success: true, data: cartItem })
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const { userEmail, productCode, quantity } = await request.json()

    if (!userEmail || !productCode || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cartItem = await CartModel.findOne({ userEmail, productCode })
    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Fetch product to check stock
    let product = null
    switch (cartItem.categoryTypeModel) {
      case "clothes":
        product = await ClothesModel.findOne({ productCode })
        break
      // Add other cases as needed
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (quantity > product.inStock) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 })
    }

    if (quantity <= 0) {
      await CartModel.deleteOne({ userEmail, productCode })
      return NextResponse.json({ success: true, message: "Item removed from cart" })
    }

    cartItem.quantity = quantity
    await cartItem.save()

    return NextResponse.json({ success: true, data: cartItem })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")
    const productCode = searchParams.get("productCode")

    if (!userEmail || !productCode) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    await CartModel.deleteOne({ userEmail, productCode })

    return NextResponse.json({ success: true, message: "Item removed from cart" })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
