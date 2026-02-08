
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "../contexts/auth-provider"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const localEmail = localStorage.getItem("admin-email")
      if (localEmail !== "admin@123") {
        router.replace("/")
      }
    }
  }, [user])

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-6">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card className="rounded-2xl shadow-md bg-white hover:shadow-lg transition">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
              <p className="text-2xl font-bold text-pink-500 mt-2">128</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md bg-white hover:shadow-lg transition">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-700">Users</h2>
              <p className="text-2xl font-bold text-pink-500 mt-2">58</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md bg-white hover:shadow-lg transition">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
              <p className="text-2xl font-bold text-pink-500 mt-2">₹ 23,000</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">Manage Products</Button>
        </div>
      </div>
    </main>
  )
}
