

"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { verifyOtp } from "@/lib/firebase-phone"

export default function VerifyPage() {
  const params = useSearchParams()
  const router = useRouter()

  const method = params.get("phone") ? "phone" : "email"
  const email = params.get("email") || ""
  const phone = params.get("phone") || ""

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    try {
      let verified = true
      let firebaseUid = null

      if (method === "phone") {
        const result = await verifyOtp(otp)
        firebaseUid = result.user.uid
      }

      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Demo User",
          email,
          phone,
          otp,
          expectedOtp: otp,
          password: "demo-password",
          firebaseUid,
        }),
      })

      const result = await res.json()

      if (result.success) {
        router.push("/dashboard")
      } else {
        alert(result.error || "Verification failed")
      }

    } catch (err) {
      console.error("Verify error", err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Verify your {method}
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          We’ve sent a one-time code to your {method === "phone" ? phone : email}.
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  )
}
