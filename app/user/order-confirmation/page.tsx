"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, Clock, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    if (orderId) {
      // Mock order details - replace with actual API call
      setOrderDetails({
        id: orderId,
        status: "confirmed",
        estimatedDelivery: "2-3 business days",
        items: [
          { name: "Cute Baby Romper Set", quantity: 2, price: 899 },
          { name: "Soft Cotton Onesie", quantity: 1, price: 599 },
        ],
        total: 2397,
        customerInfo: {
          name: "Customer Name",
          email: "customer@example.com",
          phone: "+91-9876543210",
          address: "123 Main St, Mangrol, Gujarat",
        },
      })
    }
  }, [orderId])

  if (!orderDetails) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-16">
          <div className="text-center">Loading order details...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="mb-8">
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Thank you for your order. We'll send you updates via email.
              </p>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Order #{orderDetails.id}
              </Badge>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">Confirmed</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="text-sm">Processing</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    <Truck className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="text-sm">Shipped</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="text-sm">Delivered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{orderDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-gray-600 dark:text-gray-300">{orderDetails.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-gray-600 dark:text-gray-300">{orderDetails.customerInfo.address}</p>
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-gray-600 dark:text-gray-300">{orderDetails.customerInfo.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" asChild>
              <Link href="/dashboard">View Order History</Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share Order
            </Button>
          </div>

          {/* Contact Support */}
          <Card className="mt-8">
            <CardContent className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Need help with your order? We're here to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/query">Ask a Question</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
