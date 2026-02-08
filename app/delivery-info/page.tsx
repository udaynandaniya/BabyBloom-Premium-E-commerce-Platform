import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Truck,
  Clock,
  MapPin,
  Phone,
  IndianRupee,
  Package,
} from "lucide-react"

export default function DeliveryInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Delivery Information
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to know about our delivery services and charges
            </p>
          </div>

          {/* Delivery Charges Based on State */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Delivery Charges
              </CardTitle>
              <CardDescription>
                Shipping charges depend on your state and order weight.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-300">
                      Within Gujarat
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ₹30 per kg
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Local Courier
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-orange-800 dark:text-orange-300">
                      Other States (India)
                    </h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      ₹90 per kg
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    National Courier
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Timings */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                Delivery Timings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Standard Delivery</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-1">1-2 Days</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Within Mangrol & nearby areas
                  </p>
                </div>

                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Express Delivery</h3>
                  <p className="text-2xl font-bold text-green-600 mb-1">Same Day</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order before 2 PM
                  </p>
                </div>

                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Extended Areas</h3>
                  <p className="text-2xl font-bold text-orange-600 mb-1">2-3 Days</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Distant locations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Delivery Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                How Delivery Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Order Confirmation</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Once you place an order, we'll confirm it within 30 minutes and start preparing your items.
                    </p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Packaging & Dispatch</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your items are carefully packed and dispatched with tracking information sent to your phone.
                    </p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Delivery & Payment</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                       Delivery by Courier No cash on delivery option available. You can pay via UPI, card, or cash.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-500" />
                Delivery Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">For Delivery Queries:</h3>
                  <div className="space-y-2">
                    <a
                      href="tel:9913737023"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      +91 99137 37023
                    </a>
                    <a
                      href="tel:9898893380"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      +91 98988 93380
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">WhatsApp Support:</h3>
                  <a
                    href="https://wa.me/919913737023"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Charges are calculated based on weight and location (Gujarat or other states)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  ₹30/kg within Gujarat, ₹90/kg for other states
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Same day delivery available for orders placed before 2:00 PM
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  We deliver Monday to Saturday (10 AM - 7 PM), Sunday delivery on request
                </li>
               
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
