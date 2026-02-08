"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-provider"

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  inStock: number
  isOnSale?: boolean
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    fetchWishlist()
  }, [user, router])

  const fetchWishlist = async () => {
    try {
      // Mock data - replace with actual API call
      const mockWishlist: WishlistItem[] = [
        {
          id: "1",
          name: "Newborn Sleep Suit",
          price: 799,
          image: "/placeholder.svg?height=300&width=300",
          rating: 4.7,
          reviews: 203,
          category: "Sleep Suits",
          inStock: 31,
        },
        {
          id: "2",
          name: "Baby Boy Shorts Set",
          price: 699,
          originalPrice: 999,
          image: "/placeholder.svg?height=300&width=300",
          rating: 4.5,
          reviews: 67,
          category: "Sets",
          inStock: 19,
          isOnSale: true,
        },
        {
          id: "3",
          name: "Organic Cotton Bodysuit",
          price: 549,
          image: "/placeholder.svg?height=300&width=300",
          rating: 4.8,
          reviews: 145,
          category: "Bodysuits",
          inStock: 27,
        },
        {
          id: "4",
          name: "Baby Girl Dress Set",
          price: 1299,
          originalPrice: 1799,
          image: "/placeholder.svg?height=300&width=300",
          rating: 4.9,
          reviews: 156,
          category: "Dresses",
          inStock: 8,
          isOnSale: true,
        },
      ]
      setWishlistItems(mockWishlist)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    })
  }

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    })
  }

  const moveAllToCart = () => {
    wishlistItems.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    })

    setWishlistItems([])
    toast({
      title: "All items added to cart",
      description: "All wishlist items have been moved to your cart",
    })
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-16">
          <div className="text-center">
            <Heart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Save items you love to your wishlist and shop them later.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Browse Products</Link>
            </Button>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <Button onClick={moveAllToCart} size="lg">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add All to Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.isOnSale && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({item.reviews})</span>
                </div>

                <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-lg">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{item.category}</span>
                  <span>{item.inStock} in stock</span>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => addToCart(item)} disabled={item.inStock === 0}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/products/${item.id}`}>
                      <span className="sr-only">View product</span>
                      👁️
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-gray-500 mb-4">Discover more products you'll love</p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
