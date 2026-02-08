"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  X,
  Heart,
  ShoppingCart,
  Bath,
  RefreshCw,
  Star,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { SliderDisplay } from "@/components/slider-display"
import { AnimatedBackground } from "@/components/animated-background"

interface BathItem {
  _id: string
  name: string
  type?: string
  sellingPrice: number
  productCode: string
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

interface FilterState {
  search: string
  type: string[]
  priceRange: {
    min: number | null
    max: number | null
  }
  sortBy: "name" | "sellingPrice" | "createdAt"
  sortOrder: "asc" | "desc"
}

const typeOptions = ["soap", "shampoo", "diaper", "towel", "lotion", "powder", "oil"]

export default function BathPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bathItems, setBathItems] = useState<BathItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    type: searchParams.get("type")?.split(",") || [],
    priceRange: {
      min: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
      max: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
    },
    sortBy: (searchParams.get("sortBy") as any) || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as any) || "desc",
  })

  // Load wishlist from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        const wishlistData = JSON.parse(savedWishlist)
        setWishlist(Array.isArray(wishlistData) ? wishlistData.map((item: any) => item._id) : [])
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    }
  }, [])

  const fetchBathItems = useCallback(
    async (page = 1, reset = false) => {
      try {
        if (page === 1) setIsLoading(true)
        else setIsLoadingMore(true)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        })

        if (filters.search) params.append("search", filters.search)
        if (filters.type.length > 0) params.append("type", filters.type.join(","))
        if (filters.priceRange.min) params.append("minPrice", filters.priceRange.min.toString())
        if (filters.priceRange.max) params.append("maxPrice", filters.priceRange.max.toString())

        const response = await fetch(`/api/products/bath?${params}`)


        if (!response.ok) throw new Error("Failed to fetch")

        const data = await response.json()
        // console.log("📦 Fetched bath items:", data)

        if (reset || page === 1) {
          setBathItems(data.data || [])
        } else {
          setBathItems((prev) => [...prev, ...(data.data || [])])
        }

        setHasMore(data.pagination?.hasNext || false)
        setCurrentPage(page)
      } catch (error) {
        console.error("Error fetching bath items:", error)
        toast.error("Failed to load bath items")
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [filters],
  )

  useEffect(() => {
    fetchBathItems(1, true)
  }, [fetchBathItems])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      type: [],
      priceRange: { min: null, max: null },
      sortBy: "createdAt",
      sortOrder: "desc",
    })
  }

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchBathItems(currentPage + 1)
    }
  }

  const toggleWishlist = (item: BathItem) => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      const wishlistData = savedWishlist ? JSON.parse(savedWishlist) : []
      const existingIndex = wishlistData.findIndex((w: any) => w._id === item._id)

      if (existingIndex >= 0) {
        wishlistData.splice(existingIndex, 1)
        setWishlist((prev) => prev.filter((id) => id !== item._id))
        toast.success("Removed from wishlist")
      } else {
        wishlistData.push(item)
        setWishlist((prev) => [...prev, item._id])
        toast.success("Added to wishlist")
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlistData))
      // Update header count
      window.dispatchEvent(new Event("wishlistUpdated"))
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Failed to update wishlist")
    }
  }


  const addToCart = (item: BathItem) => {
    // console.log("🛒 Adding to cart:", item  )
    try {
      const savedCart = localStorage.getItem("cart")
      const cartData = savedCart ? JSON.parse(savedCart) : []
      const existingIndex = cartData.findIndex((c: any) => c._id === item._id)

      if (existingIndex >= 0) {
        if (cartData[existingIndex].quantity < item.inStock) {
          cartData[existingIndex].quantity += 1
          toast.success("Added to cart")
        } else {
          toast.error("Cannot add more items than available stock")
          return
        }
      } else {
        cartData.push({ ...item, quantity: 1 })
        toast.success("Added to cart")
      }

      localStorage.setItem("cart", JSON.stringify(cartData))
      // Update header count
      window.dispatchEvent(new Event("cartUpdated"))
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    }
  }

  const buyNow = (item: BathItem) => {
    addToCart(item)
    router.push("/cart")
  }

  const hasActiveFilters = () => {
    return (
      filters.search || filters.type.length > 0 || filters.priceRange.min !== null || filters.priceRange.max !== null
    )
  }

  const getDiscountPercentage = (selling: number, actual: number) => {
    if (!actual || actual <= selling) return 0
    return Math.round(((actual - selling) / actual) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3 text-lg font-medium">
            <RefreshCw className="h-6 w-6 animate-spin text-pink-500" />
            Loading Bath Items...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10">
        {/* Hero Slider */}
        <div className="container mx-auto px-4 py-6">
          <SliderDisplay
            groupName="bath"
            autoPlay={true}
            autoPlayInterval={4000}
            showControls={true}
            showDots={true}
            className="rounded-2xl shadow-2xl"
          />
        </div>

        {/* Page Header */}
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Bath className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
              Baby Bath Collection
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Essential bath products for your baby's comfort and care
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-lg mb-8">
            <CardContent className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bath items by name, type, or description..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="pl-10 rounded-xl border-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-xl bg-transparent border-blue-200">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {hasActiveFilters() && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs bg-blue-500 text-white">
                            !
                          </Badge>
                        )}
                        {isFilterOpen ? (
                          <ChevronUp className="h-4 w-4 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
                        {/* Type Filter */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Type</label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {typeOptions.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`filter-type-${type}`}
                                  checked={filters.type.includes(type)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      updateFilter("type", [...filters.type, type])
                                    } else {
                                      updateFilter(
                                        "type",
                                        filters.type.filter((t) => t !== type),
                                      )
                                    }
                                  }}
                                />
                                <label htmlFor={`filter-type-${type}`} className="text-sm capitalize">
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Price Range (₹)</label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Min"
                              value={filters.priceRange.min || ""}
                              onChange={(e) =>
                                updateFilter("priceRange", {
                                  ...filters.priceRange,
                                  min: e.target.value ? Number(e.target.value) : null,
                                })
                              }
                              className="text-sm"
                            />
                            <Input
                              type="number"
                              placeholder="Max"
                              value={filters.priceRange.max || ""}
                              onChange={(e) =>
                                updateFilter("priceRange", {
                                  ...filters.priceRange,
                                  max: e.target.value ? Number(e.target.value) : null,
                                })
                              }
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Sort By */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Sort By</label>
                          <div className="flex gap-2">
                            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="createdAt">Newest First</SelectItem>
                                <SelectItem value="name">Name A-Z</SelectItem>
                                <SelectItem value="sellingPrice">Price Low-High</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
                              className="px-3"
                            >
                              {filters.sortOrder === "asc" ? (
                                <SortAsc className="h-4 w-4" />
                              ) : (
                                <SortDesc className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            disabled={!hasActiveFilters()}
                            className="w-full bg-transparent"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Clear Filters
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                {/* Results Count */}
                <div className="text-sm text-muted-foreground">Showing {bathItems.length} products</div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {bathItems.map((item) => {
              const discount = getDiscountPercentage(item.sellingPrice, item.actualPrice)
              const isInWishlist = wishlist.includes(item._id)

              // console.log("\n🛒 Rendering bath item:", item)

              return (
                <Card
                  key={item._id}
                  className="group overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Link href={`/products/bath/${item._id}`}>
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold">-{discount}%</Badge>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur-sm transition-colors ${
                        isInWishlist
                          ? "bg-red-500/90 text-white hover:bg-red-600/90"
                          : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                      }`}
                      onClick={() => toggleWishlist(item)}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
                    </Button>

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-white/90 text-gray-900 hover:bg-white"
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          onClick={() => buyNow(item)}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <Link href={`/products/bath/${item._id}`}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Type and Size */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.type && (
                        <Badge variant="outline" className="text-xs capitalize border-blue-200 text-blue-600">
                          {item.type}
                        </Badge>
                      )}
                      {item.sizeInMl && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-600">
                          {item.sizeInMl}ml
                        </Badge>
                      )}
                    </div>

                    {/* Dimensions */}
                    {(item.widthInCm || item.lengthInCm) && (
                      <div className="text-sm text-muted-foreground mb-3">
                        Size: {item.widthInCm}cm × {item.lengthInCm}cm
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-green-600">₹{item.sellingPrice}</span>
                      {item.actualPrice && item.actualPrice > item.sellingPrice && (
                        <span className="text-lg text-muted-foreground line-through">₹{item.actualPrice}</span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between">
                      <Badge variant={item.inStock > 10 ? "default" : item.inStock > 0 ? "secondary" : "destructive"}>
                        {item.inStock > 10
                          ? "In Stock"
                          : item.inStock > 0
                            ? `Only ${item.inStock} left`
                            : "Out of Stock"}
                      </Badge>
                      {/* Rating (placeholder) */}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">4.5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-8"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading More...
                  </>
                ) : (
                  "Load More Products"
                )}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {bathItems.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Bath className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bath items found</h3>
              <p className="text-gray-500 mb-4">
                {hasActiveFilters() ? "Try adjusting your filters" : "Check back later for new arrivals"}
              </p>
              {hasActiveFilters() && (
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
