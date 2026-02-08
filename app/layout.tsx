


// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
// import { AuthProvider } from "@/app/contexts/auth-provider"
// import { Toaster } from "react-hot-toast"
// import { ConditionalHeader } from "@/components/conditional-header"
// import { Footer } from "@/components/footer"


// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Mahadev Baby Shop",
//   description: "Premium quality baby products for your little ones",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//           <AuthProvider>
//             <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-purple-950/30 dark:to-blue-950/30">
//               <ConditionalHeader />
//               <main>{children}</main>
//             </div>
//             <Footer />
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 4000,
//                 style: {
//                   background: "hsl(var(--background))",
//                   color: "hsl(var(--foreground))",
//                   border: "1px solid hsl(var(--border))",
//                 },
//               }}
//             />
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }


import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/app/contexts/auth-provider"
import { Toaster } from "react-hot-toast"
import { ConditionalHeader } from "@/components/conditional-header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mahadev Baby Shop",
  description: "Premium quality baby products for your little ones",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              {/* Background wrapper for header and main content */}
              <div className="flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-purple-950/30 dark:to-blue-950/30">
                <ConditionalHeader />
                <main>{children}</main>
              </div>
              {/* Footer outside the gradient background */}
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
