

//C:\Users\UDAYN\Downloads\Projects\mahadev-baby - Copy\app\checkout\page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  User,
  MapPin,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  Plus,
  Minus,
  Trash2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { AnimatedBackground } from "@/components/animated-background"
import LocationSelector from "@/components/location-selector"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CheckoutItem {
  _id: string
  name: string
  sellingPrice: number
  actualPrice?: number
  images: string[]
  quantity: number
  weightInGrams: number
  inStock: number
  categoryTypemodel: string
  category?: string[]
  size?: string
  color?: string
  type?: string
  sizeInMl?: number
  productCode?: string
}

interface AddressData {
  street: string
  area: string
  state: string
  district: string
  subDistrict: string
  village: string
  pincode: string
}

interface ValidationState {
  [key: string]: {
    isValid: boolean
    message: string
  }
}

interface UpdatedProductData {
  _id: string
  name: string
  sellingPrice: number
  actualPrice?: number
  inStock: number
  weightInGrams: number
  images: string[]
  productCode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdatingProducts, setIsUpdatingProducts] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showFinalConfirmDialog, setShowFinalConfirmDialog] = useState(false)

  // Form data
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
    street: "",
    area: "",
    state: "",
    district: "",
    subDistrict: "",
    village: "",
    pincode: "",
  })

  // Real-time validation
  const [validationState, setValidationState] = useState<ValidationState>({})

  useEffect(() => {
    loadCheckoutItems()
  }, [])

  // Block page navigation during submission
  useEffect(() => {
    if (isSubmitting) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = "Order is being processed. Are you sure you want to leave?"
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isSubmitting])

  // Real-time validation functions
  const validateField = (fieldName: string, value: any) => {
    let isValid = false
    let message = ""

    switch (fieldName) {
      case "customerName":
        isValid = value.length >= 2
        message = isValid ? "Valid name" : "Name must be at least 2 characters"
        break
      case "customerPhone":
        isValid = /^\d{10}$/.test(value)
        message = isValid ? "Valid phone number" : "Phone number must be exactly 10 digits"
        break
      case "customerEmail":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        message = isValid ? "Valid email address" : "Please enter a valid email address"
        break
      case "street":
        isValid = value.length >= 1
        message = isValid ? "Valid street address" : "Street address must be at least 5 characters"
        break
      case "area":
        isValid = value.length >= 2
        message = isValid ? "Valid area" : "Area must be at least 2 characters"
        break
      case "state":
        isValid = value.length > 0
        message = isValid ? "State selected" : "Please select a state"
        break
      case "district":
        isValid = value.length > 0
        message = isValid ? "District selected" : "Please select a district"
        break
      case "subDistrict":
        isValid = value.length > 0
        message = isValid ? "Sub-district selected" : "Please select a sub-district"
        break
      case "village":
        isValid = value.length > 0
        message = isValid ? "Village/City selected" : "Please select a village/city"
        break
      case "pincode":
        isValid = /^\d{6}$/.test(value)
        message = isValid ? "Valid pincode" : "Pincode must be exactly 6 digits"
        break
    }

    setValidationState((prev) => ({
      ...prev,
      [fieldName]: { isValid, message },
    }))

    return isValid
  }

  const handleInputChange = (fieldName: string, value: string) => {
    if (isSubmitting) return // Block input during submission

    switch (fieldName) {
      case "customerName":
        setCustomerName(value)
        break
      case "customerPhone":
        setCustomerPhone(value)
        break
      case "customerEmail":
        setCustomerEmail(value)
        break
    }
    validateField(fieldName, value)
  }

  const handleAddressChange = (address: AddressData) => {
    if (isSubmitting) return // Block input during submission

    setDeliveryAddress(address)
    Object.keys(address).forEach((key) => {
      validateField(key, address[key as keyof AddressData])
    })
  }

  const loadCheckoutItems = () => {
    try {
      setIsLoading(true)
      const savedItems = localStorage.getItem("checkoutItems")
      if (savedItems) {
        const items = JSON.parse(savedItems)
        setCheckoutItems(Array.isArray(items) ? items : [])
      } else {
        router.push("/cart")
      }
    } catch (error) {
      console.error("Error loading checkout items:", error)
      toast.error("Failed to load checkout items")
      router.push("/cart")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUpdatedProductDetails = async () => {
    if (checkoutItems.length === 0 || isSubmitting) return

    setIsUpdatingProducts(true)
    try {
      const productRequests = checkoutItems.map((item) => ({
        _id: item._id,
        categoryTypemodel: item.categoryTypemodel,
      }))

      const response = await fetch("/api/products/batch-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: productRequests }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch updated product details")
      }

      const { data: updatedProducts } = await response.json()

      // Update checkout items with latest data
      const updatedCheckoutItems = checkoutItems
        .map((item) => {
          const updatedProduct = updatedProducts.find((p: UpdatedProductData) => p._id === item._id)
          if (updatedProduct) {
            return {
              ...item,
              name: updatedProduct.name,
              sellingPrice: updatedProduct.sellingPrice,
              actualPrice: updatedProduct.actualPrice,
              inStock: updatedProduct.inStock,
              weightInGrams: updatedProduct.weightInGrams,
              images: updatedProduct.images,
              productCode: updatedProduct.productCode,
              // Adjust quantity if it exceeds current stock
              quantity: Math.min(item.quantity, updatedProduct.inStock),
            }
          }
          return item
        })
        .filter((item) => item.inStock > 0) // Remove out of stock items

      setCheckoutItems(updatedCheckoutItems)
      localStorage.setItem("checkoutItems", JSON.stringify(updatedCheckoutItems))
      toast.success("Product details updated successfully")
    } catch (error) {
      console.error("Error fetching updated product details:", error)
      toast.error("Failed to update product details")
    } finally {
      setIsUpdatingProducts(false)
    }
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (isSubmitting) return // Block changes during submission

    const updatedItems = checkoutItems
      .map((item) => {
        if (item._id === itemId) {
          if (newQuantity <= 0) return null
          if (newQuantity > item.inStock) {
            toast.error("Cannot add more items than available stock")
            return item
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      .filter(Boolean) as CheckoutItem[]

    setCheckoutItems(updatedItems)
    localStorage.setItem("checkoutItems", JSON.stringify(updatedItems))
  }

  const removeItem = (itemId: string) => {
    if (isSubmitting) return // Block changes during submission

    const updatedItems = checkoutItems.filter((item) => item._id !== itemId)
    setCheckoutItems(updatedItems)
    localStorage.setItem("checkoutItems", JSON.stringify(updatedItems))
    toast.success("Item removed from checkout")

    if (updatedItems.length === 0) {
      router.push("/cart")
    }
  }

  const calculateTotals = () => {
    const subtotal = checkoutItems.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0)
    const totalWeight = checkoutItems.reduce((sum, item) => sum + item.weightInGrams * item.quantity, 0)
    const weightInKg = Math.ceil(totalWeight / 1000)
    const isGujarat = deliveryAddress.state.toLowerCase() === "gujarat"
    const deliveryCharge = isGujarat ? weightInKg * 30 : weightInKg * 90
    const totalAmount = subtotal + deliveryCharge

    return {
      subtotal,
      totalWeight,
      weightInKg,
      deliveryCharge,
      totalAmount,
      isGujarat,
    }
  }

  const isFormValid = () => {
    const requiredFields = [
      "customerName",
      "customerPhone",
      "customerEmail",
      "street",
      "area",
      "state",
      "district",
      "subDistrict",
      "village",
      "pincode",
    ]

    return requiredFields.every((field) => {
      const validation = validationState[field]
      return validation && validation.isValid
    })
  }

  const handleProceedToOrder = () => {
    if (!isFormValid() || isSubmitting) {
      toast.error("Please fill all required fields correctly")
      return
    }
    setShowConfirmDialog(true)
  }

  const handleConfirmOrder = () => {
    setShowConfirmDialog(false)
    setShowFinalConfirmDialog(true)
  }

  const handleFinalConfirmOrder = async () => {
    setIsSubmitting(true)

    try {
      const orderData = {
        userEmail: customerEmail,
        customerInfo: {
          fullName: customerName,
          mobile: customerPhone,
          alternatePhone: "",
        },
        deliveryAddress,
        selectedItems: checkoutItems.map((item) => ({
          _id: item._id,
          categoryTypemodel: item.categoryTypemodel,
          quantity: item.quantity,
        })),
      }

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError)
        throw new Error("Server response was invalid. Please try again.")
      }

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`)
      }

      // Remove items from localStorage
      localStorage.removeItem("checkoutItems")
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const cartData = JSON.parse(savedCart)
        const remainingCart = cartData.filter(
          (cartItem: any) => !checkoutItems.some((checkoutItem) => checkoutItem._id === cartItem._id),
        )
        localStorage.setItem("cart", JSON.stringify(remainingCart))
        window.dispatchEvent(new Event("cartUpdated"))
      }

      setShowFinalConfirmDialog(false)
      toast.success(`🎉 Order placed successfully! Order #${result.orderNumber}`)

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error placing order:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to place order. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInputClassName = (fieldName: string) => {
    const validation = validationState[fieldName]
    if (!validation) return "border-gray-200"
    return validation.isValid ? "border-green-500 focus:border-green-600" : "border-red-500 focus:border-red-600"
  }

  const getValidationIcon = (fieldName: string) => {
    const validation = validationState[fieldName]
    if (!validation) return null
    return validation.isValid ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  const totals = calculateTotals()

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No items to checkout</h2>
            <Button onClick={() => router.push("/cart")}>Back to Cart</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl text-center max-w-sm mx-4">
            <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Your Order</h3>
            <p className="text-sm text-muted-foreground">Please don't close this page...</p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-2 md:gap-3">
              <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-pink-500" />
              Secure Checkout
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Complete your order securely</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName" className="text-sm md:text-base">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="customerName"
                          value={customerName}
                          onChange={(e) => handleInputChange("customerName", e.target.value)}
                          placeholder="Enter your full name"
                          className={getInputClassName("customerName")}
                          disabled={isSubmitting}
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {getValidationIcon("customerName")}
                        </div>
                      </div>
                      {validationState.customerName && (
                        <p
                          className={`text-xs ${validationState.customerName.isValid ? "text-green-600" : "text-red-600"}`}
                        >
                          {validationState.customerName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone" className="text-sm md:text-base">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="customerPhone"
                          value={customerPhone}
                          onChange={(e) => handleInputChange("customerPhone", e.target.value.replace(/\D/g, ""))}
                          placeholder="Enter 10-digit phone number"
                          maxLength={10}
                          className={getInputClassName("customerPhone")}
                          disabled={isSubmitting}
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {getValidationIcon("customerPhone")}
                        </div>
                      </div>
                      {validationState.customerPhone && (
                        <p
                          className={`text-xs ${validationState.customerPhone.isValid ? "text-green-600" : "text-red-600"}`}
                        >
                          {validationState.customerPhone.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail" className="text-sm md:text-base">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="customerEmail"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                        placeholder="Enter your email address"
                        className={getInputClassName("customerEmail")}
                        disabled={isSubmitting}
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {getValidationIcon("customerEmail")}
                      </div>
                    </div>
                    {validationState.customerEmail && (
                      <p
                        className={`text-xs ${validationState.customerEmail.isValid ? "text-green-600" : "text-red-600"}`}
                      >
                        {validationState.customerEmail.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LocationSelector
                    value={deliveryAddress}
                    onChange={handleAddressChange}
                    required={true}
                    disabled={isSubmitting}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg sticky top-6">
                <CardHeader className="pb-3 md:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Package className="h-4 w-4 md:h-5 md:w-5" />
                      Order Summary
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={fetchUpdatedProductDetails}
                      disabled={isUpdatingProducts || isSubmitting}
                      className="text-pink-600 hover:text-pink-700"
                    >
                      {isUpdatingProducts ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {checkoutItems.map((item) => (
                      <div key={item._id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Image
                            src={item.images[0] || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2 mb-1">{item.name}</p>
                            {item.productCode && (
                              <p className="text-xs text-muted-foreground mb-1">Code: {item.productCode}</p>
                            )}
                            {/* Product attributes */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.size && (
                                <Badge variant="secondary" className="text-xs">
                                  Size: {item.size}
                                </Badge>
                              )}
                              {item.color && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.color}
                                </Badge>
                              )}
                              {item.type && (
                                <Badge variant="outline" className="text-xs">
                                  {item.type}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-green-600">₹{item.sellingPrice}</span>
                              <Badge
                                variant={item.inStock > 10 ? "default" : item.inStock > 0 ? "secondary" : "destructive"}
                                className="text-xs"
                              >
                                {item.inStock > 10
                                  ? "In Stock"
                                  : item.inStock > 0
                                    ? `${item.inStock} left`
                                    : "Out of Stock"}
                              </Badge>
                            </div>
                            {/* Quantity controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border rounded">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || isSubmitting}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  disabled={item.quantity >= item.inStock || isSubmitting}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">₹{item.sellingPrice * item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item._id)}
                                  disabled={isSubmitting}
                                  className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({checkoutItems.length} items)</span>
                      <span>₹{totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Weight</span>
                      <span>{totals.weightInKg}kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Charge</span>
                      <span>₹{totals.deliveryCharge}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {totals.isGujarat ? "Within Gujarat: ₹30/kg" : "Outside Gujarat: ₹90/kg"}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{totals.totalAmount}</span>
                  </div>

                  <Button
                    onClick={handleProceedToOrder}
                    disabled={!isFormValid() || isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Review Order
                      </>
                    )}
                  </Button>

                  {!isFormValid() && !isSubmitting && (
                    <p className="text-sm text-muted-foreground text-center">
                      Please fill all required fields to proceed
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* First Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={!isSubmitting ? setShowConfirmDialog : undefined}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Review Your Order
            </DialogTitle>
            <DialogDescription className="text-left">
              Please review your order details before final confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Customer:</strong> {customerName}
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> {customerPhone}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {customerEmail}
              </p>
              <p className="text-sm">
                <strong>Delivery:</strong> {deliveryAddress.village}, {deliveryAddress.district},{" "}
                {deliveryAddress.state}
              </p>
              <p className="text-sm">
                <strong>Total Amount:</strong> ₹{totals.totalAmount}
              </p>
              <p className="text-sm">
                <strong>Items:</strong> {checkoutItems.length}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Edit Details
              </Button>
              <Button
                onClick={handleConfirmOrder}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                disabled={isSubmitting}
              >
                Looks Good
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Final Confirmation Dialog */}
      <Dialog open={showFinalConfirmDialog} onOpenChange={!isSubmitting ? setShowFinalConfirmDialog : undefined}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Final Confirmation
            </DialogTitle>
            <DialogDescription className="text-left">
              <strong>Important:</strong> Once confirmed, this order cannot be modified. Admin will contact you with
              confirmation details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                Your order will be processed securely. You'll receive an order number and admin will contact you soon.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFinalConfirmDialog(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFinalConfirmOrder}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Confirm & Place Order"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
