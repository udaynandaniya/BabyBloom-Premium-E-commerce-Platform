"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Phone, Mail, MapPin } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/auth-provider"

export default function QueryPage() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to submit a query",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Subject and message are required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Here you would send the query to your API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Mock delay

      toast({
        title: "Query submitted successfully!",
        description: "We'll get back to you within 24 hours",
      })

      setFormData({ subject: "", message: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit query. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Ask a Question</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Have a question about our products or services? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Submit Your Query
              </CardTitle>
              <CardDescription>Fill out the form below and we'll respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's your question about?"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your question in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Submitting..." : "Submit Query"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Other ways to reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Contact Divyesh Nanadaniya directly</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">info@mahadevbabyshop.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Visit Our Shop</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Mangrol, Gujarat, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">What are your shop hours?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Monday-Saturday: 9:00 AM - 8:00 PM, Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Do you offer home delivery?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Yes, we offer free delivery within Mangrol and paid delivery to nearby cities.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">What's your return policy?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We accept returns within 7 days of purchase for unused items in original packaging.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Do you have size guides?</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Yes, each product page includes detailed size information and age recommendations.
                  </p>
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
