

import { type NextRequest, NextResponse } from "next/server"
import OrderModel from "@/lib/models/order"
import ClothesModel from "@/lib/models/clothes"
import { dbConnect } from "@/lib/mongodb"
import { BathItemModel, NewbornItemModel, ToyModel } from "@/lib/models"
import StockManagerModel from "@/lib/models/stockManager"
import mongoose from "mongoose"

function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD${timestamp.slice(-6)}${random}`
}

export async function POST(request: NextRequest) {
  let session: mongoose.ClientSession | null = null

  try {
    await dbConnect()

    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB not connected, readyState:", mongoose.connection.readyState)
      return NextResponse.json({ error: "Database connection failed. Please try again." }, { status: 503 })
    }

    const { userEmail, customerInfo, deliveryAddress, selectedItems } = await request.json()

    if (!userEmail || !customerInfo || !deliveryAddress || !selectedItems || !Array.isArray(selectedItems)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (selectedItems.length === 0) {
      return NextResponse.json({ error: "No items selected for order" }, { status: 400 })
    }

    session = await mongoose.startSession()
    await session.startTransaction()

    const orderItems = []
    let subtotal = 0

    for (const item of selectedItems) {
      const { _id, categoryTypemodel, quantity } = item

      if (!_id || !categoryTypemodel || !quantity || quantity <= 0) {
        throw new Error(`Invalid item data: ${JSON.stringify(item)}`)
      }

      let product = null

      switch (categoryTypemodel) {
        case "clothes":
          product = await ClothesModel.findById(_id).session(session)
          break
        case "toy":
          product = await ToyModel.findById(_id).session(session)
          break
        case "bath":
          product = await BathItemModel.findById(_id).session(session)
          break
        case "newborn":
          product = await NewbornItemModel.findById(_id).session(session)
          break
        default:
          throw new Error(`Invalid category type: ${categoryTypemodel}`)
      }

      if (!product) {
        throw new Error(`Product not found: ${_id}`)
      }

      if (product.inStock < quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.inStock}, Requested: ${quantity}`)
      }

      // Decrease stock
      product.inStock -= quantity
      await product.save({ session })

      // ✅ Update Stock Manager
      await StockManagerModel.updateOne(
        { productId: _id, productType: categoryTypemodel },
        {
          $set: {
            currentStock: product.inStock,
            lastUpdated: new Date(),
          },
          $setOnInsert: {
            productCode: product.productCode || `${categoryTypemodel.toUpperCase()}-${product._id.toString().slice(-6)}`,
            productName: product.name,
            source: "online",
          },
        },
        { upsert: true, session }
      )

      // Add item to order
      const itemTotal = product.sellingPrice * quantity
      subtotal += itemTotal

      orderItems.push({
        productCode: product.productCode || `${categoryTypemodel.toUpperCase()}-${product._id.toString().slice(-6)}`,
        categoryTypeModel: categoryTypemodel,
        name: product.name,
        quantity: quantity,
        priceAtOrder: product.sellingPrice,
        weightInGrams: product.weightInGrams || 100,
      })
    }

    // Delivery charge calculation
    const totalWeight = orderItems.reduce((sum, item) => sum + item.weightInGrams * item.quantity, 0)
    const weightInKg = Math.ceil(totalWeight / 1000)
    const isGujarat = deliveryAddress.state.toLowerCase() === "gujarat"
    const deliveryCharge = isGujarat ? weightInKg * 30 : weightInKg * 90
    const totalAmount = subtotal + deliveryCharge

    // Save Order
    const orderNumber = generateOrderNumber()
    const newOrder = new OrderModel({
      orderNumber,
      userEmail,
      customerName: customerInfo.fullName,
      customerPhone: customerInfo.mobile,
      deliveryAddress,
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      status: "pending",
      orderDate: new Date(),
    })

    await newOrder.save({ session })
    await session.commitTransaction()

    console.log(`Order created successfully: ${orderNumber}`)

    return NextResponse.json({
      success: true,
      orderNumber,
      totalAmount,
      message: "Order placed successfully! Admin will contact you soon.",
    })

  } catch (error) {
    console.error("Error creating order:", error)

    if (session) {
      try {
        await session.abortTransaction()
      } catch (abortError) {
        console.error("Error aborting transaction:", abortError)
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to create order"

    return NextResponse.json(
      {
        error: errorMessage,
        details: "Please check your internet connection and try again.",
      },
      { status: 500 }
    )
  } finally {
    if (session) {
      try {
        await session.endSession()
      } catch (endError) {
        console.error("Error ending session:", endError)
      }
    }
  }
}





