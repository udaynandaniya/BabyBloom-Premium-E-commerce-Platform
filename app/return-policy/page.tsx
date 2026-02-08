import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Clock, CheckCircle, XCircle, Phone, AlertTriangle } from 'lucide-react'

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Return Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We want you to be completely satisfied with your purchase. Here's our return policy.
            </p>
          </div>

          {/* Return Window */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Return Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">7 Days</div>
                <p className="text-gray-600 dark:text-gray-400">
                  You can return items within 7 days of delivery with a valid reason
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Return Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Return Conditions
              </CardTitle>
              <CardDescription>
                Items must meet these conditions to be eligible for return
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-600 dark:text-green-400">✓ Acceptable Conditions</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Items in original packaging
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Unused and unwashed items
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      All tags and labels intact
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Original bill/invoice available
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Valid reason for return
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">✗ Not Acceptable</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Used or washed items
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Damaged packaging
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Missing tags or labels
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      Items after 7 days
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      No valid reason provided
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valid Return Reasons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Valid Return Reasons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Product Issues:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Defective or damaged product</li>
                    <li>• Wrong size received</li>
                    <li>• Wrong color received</li>
                    <li>• Product doesn't match description</li>
                    <li>• Manufacturing defects</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Customer Reasons:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Size doesn't fit properly</li>
                    <li>• Color not as expected</li>
                    <li>• Quality not satisfactory</li>
                    <li>• Changed mind (within 24 hours)</li>
                    <li>• Ordered by mistake</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-purple-500" />
                How to Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Contact Us</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Call us at +91 99137 37023 or +91 98988 93380 within 7 days of delivery to initiate return.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Provide Details</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Share your order number, reason for return, and photos if there's a product issue.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Return Pickup</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      We'll arrange pickup from your address or you can drop it at our Mangrol store.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Refund Processing</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      After inspection, refund will be processed within 2-3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-500" />
                Return Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Numbers:</h3>
                  <div className="space-y-2">
                    <a 
                      href="tel:9913737023"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      +91 99137 37023 (Divyesh)
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
                  <h3 className="font-semibold">Store Address:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Mahadev Baby Shop</p>
                    <p>Vithalani Complex</p>
                    <p>Mangrol, Gujarat</p>
                    <a 
                      href="https://maps.app.goo.gl/HfPkkBRqkwAh1JVR9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors inline-block mt-2"
                    >
                      View on Map →
                    </a>
                  </div>
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
                  Return window starts from the date of delivery, not order date
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Refunds will be processed to the original payment method
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Return shipping charges may apply for customer convenience returns
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Free return pickup for defective or wrong items
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Exchange is subject to availability of the requested item
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
