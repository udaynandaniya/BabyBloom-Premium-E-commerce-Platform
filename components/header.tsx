


//C:\Users\UDAYN\Downloads\Projects\mahadev-baby - Copy\components\header.tsx

"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  ShoppingCart,
  Heart,
  User,
  Search,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Package,
  Settings,
  Baby,
} from "lucide-react"
import { useAuth } from "@/app/contexts/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load cart and wishlist counts from localStorage
    const loadCounts = () => {
      try {
        const savedCart = localStorage.getItem("cart")
        const savedWishlist = localStorage.getItem("wishlist")

        if (savedCart) {
          const cart = JSON.parse(savedCart)
          setCartCount(Array.isArray(cart) ? cart.length : 0)
        }

        if (savedWishlist) {
          const wishlist = JSON.parse(savedWishlist)
          setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0)
        }
      } catch (error) {
        console.error("Error loading cart/wishlist counts:", error)
      }
    }

    loadCounts()
  }, [])

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Clothes", href: "/products/clothes" },
    { name: "Toys", href: "/products/toy" },
    { name: "Newborn", href: "/products/newborn" },
    { name: "Bath Items", href: "/products/bath" },
    { name: "Video Items", href: "/video" },


    { name: "Contact", href: "/query" },
  ]

  const handleLogout = useCallback(async () => {
    await logout()
    setIsOpen(false)
  }, [logout])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pink-200/30 dark:border-purple-800/30 bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl">
      {/* Top Bar */}
      {/* <div className="hidden md:block bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@mahadevbaby.com</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Free shipping on orders above ₹999</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl md:text-2xl">
            <div className="relative">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Baby className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Mahadev Baby
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

           

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-pink-500 hover:bg-pink-600">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/myorders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center gap-2 pb-4 border-b">
                    <div className="h-8 w-8 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Baby className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Mahadev Baby
                    </span>
                  </div>

                  {/* User Info */}
                  {isAuthenticated && (
                    <div className="flex items-center gap-3 py-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex-1 py-4">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>

                  
                    {/* Mobile Cart & Wishlist */}
                    <div className="mt-4 px-3 space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                        <Link href="/cart" onClick={() => setIsOpen(false)}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Cart ({cartCount})
                        </Link>
                      </Button>
                   
                    </div>
                  </nav>

                  {/* Mobile Auth */}
                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                          <Link href="/profile" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                          <Link href="/myorders" onClick={() => setIsOpen(false)}>
                            <Package className="h-4 w-4 mr-2" />
                            My Orders
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-red-600 dark:text-red-400 bg-transparent"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                          <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                            Login
                          </Link>
                        </Button>
                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          asChild
                        >
                          <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
