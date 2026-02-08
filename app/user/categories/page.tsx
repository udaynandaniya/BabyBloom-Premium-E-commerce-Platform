"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
  isPopular?: boolean
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCategories: Category[] = [
        {
          id: "1",
          name: "Rompers",
          description: "Comfortable and cute rompers for babies of all ages",
          image: "/placeholder.svg?height=300&width=300",
          productCount: 25,
          isPopular: true,
        },
        {
          id: "2",
          name: "Onesies",
          description: "Soft cotton onesies perfect for everyday wear",
          image: "/placeholder.svg?height=300&width=300",
          productCount: 18,
          isPopular: true,
        },
        {
          id: "3",
          name: "Dresses",
          description: "Beautiful dresses for special occasions and daily wear",
          image: "/placeholder.svg?height=300&width=300",
          productCount: 15,
          isPopular: false,
        },
        {
          id: "4",
          name: "Sleep Suits",
          description: "Cozy sleep suits for peaceful nights",
          image: "/placeholder.svg?height=300&width=300",
          productCount: 12,
          isPopular: false,
        },
        {
          id: "5",
          name: "Sets",
          description: "Matching sets for boys and girls",
          image: "/placeholder.svg?height=300&width=300",
          productCount: 20,
          isPopular: true,
        },
        {
          id: "6",
          name: "Bodysuits",
          description: "Essential bodysuits in various colors and patterns",
          image: "/placeholder.svg?height=300&width=300",
          productCount: 22,
          isPopular: false,
        },
        {
          id: "7",
          name: "Accessories",
          description: "Hats, bibs, socks and other baby essentials",
          image: "/placeholder.svg?height=300&width=300",
          productCount: 30,
          isPopular: false,
        },
        {
          id: "8",
          name: "Newborn",
          description: "Special collection for newborns (0-3 months)",
          image: "/placeholder.svg?height=300&width=300",
          productCount: 16,
          isPopular: true,
        },
      ]
      setCategories(mockCategories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Product Categories</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Browse our complete range of baby clothes organized by category
          </p>
        </div>

        {/* Popular Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories
              .filter((category) => category.isPopular)
              .map((category) => (
                <Link key={category.id} href={`/products?category=${category.name}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-orange-500 hover:bg-orange-600">Popular</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{category.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package className="h-4 w-4" />
                        {category.productCount} products
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.name}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {category.isPopular && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-orange-500 hover:bg-orange-600">Popular</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{category.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Package className="h-4 w-4" />
                      {category.productCount} products
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Stats */}
        <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Why Choose Our Categories?</h2>
            <p className="text-gray-600 dark:text-gray-300">Carefully curated collections for every baby's needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold mb-2">Quality Products</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Every item is carefully selected for quality and comfort
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👶</span>
              </div>
              <h3 className="font-semibold mb-2">Age Appropriate</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Products organized by age groups and developmental stages
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="font-semibold mb-2">Affordable Prices</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Best prices in Mangrol without compromising on quality
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
