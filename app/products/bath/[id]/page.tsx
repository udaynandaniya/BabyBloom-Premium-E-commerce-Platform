"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Plus,
  Minus,
  ArrowLeft,
  Zap,
  Package,
  Droplets,
  Ruler,
} from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { AnimatedBackground } from "@/components/animated-background"

interface BathItem {
  _id: string
  name: string
  type?: string
  sellingPrice: number
  actualPrice: number
  sizeInMl?: number
  inStock: number
  weightInGrams: number
  widthInCm?: number
  lengthInCm?: number
  images: string[]
  description?: string
  createdAt: string
  updatedAt: string
}

export default function BathDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [item, setItem] = useState<BathItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [deliveryState, setDeliveryState] = useState("gujarat")

  useEffect(() => {
    if (id) {
      fetchBathItem()
      checkWishlistStatus()
    }
  }, [id])

  const fetchBathItem = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/bath/${id}`)
      // console.log("\n📦 Fetching bath item:", id)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setItem(data.data)
    } catch (error) {
      console.error("Error fetching bath item:", error)
      toast.error("Failed to load product details")
      router.push("/products/bath")
    } finally {
      setIsLoading(false)
    }
  }

  const checkWishlistStatus = () => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        const wishlistData = JSON.parse(savedWishlist)
        setIsInWishlist(wishlistData.some((w: any) => w._id === id))
      }
    } catch (error) {
      console.error("Error checking wishlist:", error)
    }
  }

  const calculateDeliveryCharge = () => {
    if (!item) return 0
    const weightInKg = Math.ceil((item.weightInGrams * quantity) / 1000)
    return deliveryState === "gujarat" ? weightInKg * 30 : weightInKg * 90
  }

  const getDiscountPercentage = () => {
    if (!item?.actualPrice || item.actualPrice <= item.sellingPrice) return 0
    return Math.round(((item.actualPrice - item.sellingPrice) / item.actualPrice) * 100)
  }

  const toggleWishlist = () => {
    if (!item) return

    try {
      const savedWishlist = localStorage.getItem("wishlist")
      const wishlistData = savedWishlist ? JSON.parse(savedWishlist) : []
      const existingIndex = wishlistData.findIndex((w: any) => w._id === item._id)

      if (existingIndex >= 0) {
        wishlistData.splice(existingIndex, 1)
        setIsInWishlist(false)
        toast.success("Removed from wishlist")
      } else {
        wishlistData.push(item)
        setIsInWishlist(true)
        toast.success("Added to wishlist")
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlistData))
      window.dispatchEvent(new Event("wishlistUpdated"))
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Failed to update wishlist")
    }
  }

  const addToCart = () => {
    if (!item) return

    try {
      const savedCart = localStorage.getItem("cart")
      const cartData = savedCart ? JSON.parse(savedCart) : []
      const existingIndex = cartData.findIndex((c: any) => c._id === item._id)

      if (existingIndex >= 0) {
        const newQuantity = cartData[existingIndex].quantity + quantity
        if (newQuantity <= item.inStock) {
          cartData[existingIndex].quantity = newQuantity
          toast.success(`Added ${quantity} more to cart`)
        } else {
          toast.error("Cannot add more items than available stock")
          return
        }
      } else {
        cartData.push({ ...item, quantity })
        toast.success(`Added ${quantity} item(s) to cart`)
      }

      localStorage.setItem("cart", JSON.stringify(cartData))
      window.dispatchEvent(new Event("cartUpdated"))
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    }
  }

  const buyNow = () => {
    addToCart()
    router.push("/cart")
  }

  const shareProduct = async () => {
    if (!item) return

    const shareData = {
      title: item.name,
      text: `Check out this amazing ${item.name} for just ₹${item.sellingPrice}!`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Product link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Failed to share product")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Product not found</h2>
            <Button onClick={() => router.push("/products/bath")}>Back to Bath Items</Button>
          </div>
        </div>
      </div>
    )
  }

  const discount = getDiscountPercentage()
  const deliveryCharge = calculateDeliveryCharge()
  const totalPrice = item.sellingPrice * quantity + deliveryCharge

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bath Items
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <Card className="overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                <div className="aspect-square relative">
                  <Image
                    src={item.images[currentImageIndex] || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-3 py-1">
                        -{discount}% OFF
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>

              {/* Thumbnail Images */}
              {item.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index ? "border-blue-500" : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${item.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{item.name}</h1>

                {/* Type and Size */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.type && (
                    <Badge variant="outline" className="capitalize border-blue-200 text-blue-600">
                      {item.type}
                    </Badge>
                  )}
                  {item.sizeInMl && (
                    <Badge variant="secondary" className="bg-green-100 text-green-600">
                      {item.sizeInMl}ml
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(4.5) • 89 reviews</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-green-600">₹{item.sellingPrice}</span>
                  {item.actualPrice && item.actualPrice > item.sellingPrice && (
                    <span className="text-2xl text-muted-foreground line-through">₹{item.actualPrice}</span>
                  )}
                  {discount > 0 && (
                    <Badge className="bg-green-100 text-green-800 text-lg px-2 py-1">
                      Save ₹{item.actualPrice - item.sellingPrice}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {item.type && (
                  <div>
                    <span className="text-sm text-muted-foreground">Type</span>
                    <p className="font-semibold capitalize">{item.type}</p>
                  </div>
                )}
                {item.sizeInMl && (
                  <div>
                    <span className="text-sm text-muted-foreground">Volume</span>
                    <p className="font-semibold flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      {item.sizeInMl}ml
                    </p>
                  </div>
                )}
                {(item.widthInCm || item.lengthInCm) && (
                  <div>
                    <span className="text-sm text-muted-foreground">Dimensions</span>
                    <p className="font-semibold flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-purple-500" />
                      {item.widthInCm}×{item.lengthInCm}cm
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-muted-foreground">Weight</span>
                  <p className="font-semibold">{item.weightInGrams}g</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <p
                    className={`font-semibold ${
                      item.inStock > 10 ? "text-green-600" : item.inStock > 0 ? "text-orange-600" : "text-red-600"
                    }`}
                  >
                    {item.inStock > 10 ? "In Stock" : item.inStock > 0 ? `Only ${item.inStock} left` : "Out of Stock"}
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(item.inStock, quantity + 1))}
                    disabled={quantity >= item.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">(Max: {item.inStock})</span>
              </div>

              {/* Delivery Calculator */}
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Delivery Information</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Product Total ({quantity} items)</span>
                    <span className="font-semibold">₹{item.sellingPrice * quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Delivery Charge ({Math.ceil((item.weightInGrams * quantity) / 1000)}kg)</span>
                    <span className="font-semibold">₹{deliveryCharge}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{totalPrice}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    * Delivery charges: ₹30/kg within Gujarat, ₹90/kg outside Gujarat
                  </p>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={addToCart}
                  disabled={item.inStock === 0}
                  size="lg"
                  className="flex-1 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={buyNow}
                  disabled={item.inStock === 0}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={toggleWishlist}
                  className={`flex-1 ${isInWishlist ? "bg-red-50 border-red-200 text-red-600" : ""}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-current" : ""}`} />
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </Button>
                <Button variant="outline" onClick={shareProduct} className="flex-1 bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Product Description & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2">
              <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description ||
                      "This premium baby bath product is specially formulated for your little one's delicate skin. Made with gentle, natural ingredients to ensure safety and comfort during bath time."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div>
              <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="text-sm">100% Safe for Babies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-5 w-5 text-purple-600" />
                      <span className="text-sm">Easy Returns</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-orange-600" />
                      <span className="text-sm">Secure Packaging</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
