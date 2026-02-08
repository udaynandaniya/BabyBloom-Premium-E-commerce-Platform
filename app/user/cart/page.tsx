"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Smartphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-provider"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to proceed with checkout",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first",
        variant: "destructive",
      })
      return
    }

    router.push("/checkout")
  }

  const generateQRCode = () => {
    // Generate QR code for Google Pay
    const upiId = "divyesh@paytm" // Replace with actual UPI ID
    const amount = total
    const upiUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Mahadev Baby Shop Payment`

    toast({
      title: "QR Code Generated",
      description: "Scan the QR code with any UPI app to pay",
    })

    // Here you would show the QR code modal
    console.log("UPI URL:", upiUrl)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Continue Shopping</Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">₹{item.price}</p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button variant="outline" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{Math.round(total * 0.18).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{Math.round(total * 1.18).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <Button onClick={generateQRCode} variant="outline" className="w-full" size="lg">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Pay with UPI/QR Code
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>Secure checkout powered by SSL encryption</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">We Accept</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Badge variant="outline" className="justify-center py-2">
                    💳 Credit Card
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    💰 Debit Card
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    📱 UPI/QR Code
                  </Badge>
                  <Badge variant="outline" className="justify-center py-2">
                    💵 Cash on Delivery
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
