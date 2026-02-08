export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import { ClothesModel } from "@/lib/models/clothes"
import  ToyModel  from "@/lib/models/toy"
import { BathItemModel } from "@/lib/models/bath"
import { NewbornItemModel } from "@/lib/models/newborn"
import { StockManagerModel } from "@/lib/models/stockManager"
import User from "@/lib/models/User"

export async function GET() {
  try {
    await dbConnect()

    // Get total products from all categories
    const [clothesCount, toysCount, bathCount, newbornCount] = await Promise.all([
      ClothesModel.countDocuments(),
      ToyModel.countDocuments(),
      BathItemModel.countDocuments(),
      NewbornItemModel.countDocuments(),
    ])

    const totalProducts = clothesCount + toysCount + bathCount + newbornCount

    // Get total users
    const totalUsers = await User.countDocuments()

    // Get low stock items (less than 5 items)
    const lowStockItems = await StockManagerModel.countDocuments({
      currentStock: { $lt: 5 },
    })

    // Get low stock products details
    const lowStockProducts = await StockManagerModel.find({
      currentStock: { $lt: 5 },
    }).limit(10)

    // Mock data for orders and revenue (replace with actual Order model when implemented)
    const mockStats = {
      totalProducts,
      totalOrders: 156, // Replace with actual order count
      totalUsers,
      totalRevenue: 45000, // Replace with actual revenue calculation
      pendingOrders: 12, // Replace with actual pending orders count
      lowStockItems,
      recentOrders: [], // Replace with actual recent orders
      lowStockProducts: lowStockProducts.map((product) => ({
        name: product.productName,
        productCode: product.productCode,
        currentStock: product.currentStock,
        productType: product.productType,
      })),
    }

    return NextResponse.json(mockStats)
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
