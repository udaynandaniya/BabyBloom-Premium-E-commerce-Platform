
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Instagram, ExternalLink, Store, Clock } from 'lucide-react'

export default function OtherBranchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <Header /> */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <Store className="h-8 w-8 text-blue-500" />
              Our Other Branch
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Visit our other branch for premium footwear and accessories
            </p>
          </div>

          {/* Main Branch Info */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <CardTitle className="text-2xl">Mahadev Shoes Plaza</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Premium footwear and accessories for the whole family
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Location</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Mahadev Shoes Plaza<br />
                    Near State Bank of India<br />
                    Mangrol, Gujarat 362225
                  </p>
                  <a
                    href="https://maps.app.goo.gl/o46dv41RoVDuATKG6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Google Maps
                    </Button>
                  </a>
                </div>
              </div>

              {/* Contact & Social */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-green-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">Store Contact</p>
                        <a 
                          href="tel:9913737023"
                          className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                        >
                          +91 99137 37023
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      <div>
                        <p className="font-medium">Follow Us</p>
                        <a 
                          href="https://www.instagram.com/mahadev__shoe__plaza?igsh=MWtvc2J5N3ludXR4aQ=="
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-800 transition-colors text-sm"
                        >
                          @mahadev__shoe__plaza
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Store Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Monday - Saturday:</span>
                      <span className="font-medium">9:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sunday:</span>
                      <span className="font-medium">10:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products & Services */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">What We Offer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-600 dark:text-blue-400">Footwear Collection:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Men's formal and casual shoes</li>
                      <li>• Women's heels, flats, and sandals</li>
                      <li>• Kids' shoes and sandals</li>
                      <li>• Sports and running shoes</li>
                      <li>• Traditional footwear</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-purple-600 dark:text-purple-400">Accessories:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Leather belts and wallets</li>
                      <li>• Shoe care products</li>
                      <li>• Socks and shoe accessories</li>
                      <li>• Bags and purses</li>
                      <li>• Gift items</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Special Features */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Why Choose Mahadev Shoes Plaza?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-1">
                    <li>✓ Premium quality footwear</li>
                    <li>✓ Latest fashion trends</li>
                    <li>✓ Competitive prices</li>
                    <li>✓ Expert fitting service</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>✓ Wide size range available</li>
                    <li>✓ Trusted brands</li>
                    <li>✓ Excellent customer service</li>
                    <li>✓ Easy exchange policy</li>
                  </ul>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center space-y-4 pt-4 border-t">
                <p className="text-gray-600 dark:text-gray-400">
                  Visit our shoes plaza for the latest collection of premium footwear!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://maps.app.goo.gl/o46dv41RoVDuATKG6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full sm:w-auto">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </a>
                  <a
                    href="https://www.instagram.com/mahadev__shoe__plaza?igsh=MWtvc2J5N3ludXR4aQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Instagram className="h-4 w-4 mr-2" />
                      Follow on Instagram
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Both Branches Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Our Two Branches</CardTitle>
              <CardDescription>
                Both branches are owned and operated by Divyesh Nanadaniya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <h3 className="font-semibold text-pink-800 dark:text-pink-300 mb-2">
                    Mahadev Baby Shop
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Vithalani Complex, Mangrol
                  </p>
                  <p className="text-sm">
                    Specializing in premium baby clothes, accessories, toys, and newborn essentials.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Mahadev Shoes Plaza
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Near State Bank, Mangrol
                  </p>
                  <p className="text-sm">
                    Premium footwear collection for men, women, and children with accessories.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
