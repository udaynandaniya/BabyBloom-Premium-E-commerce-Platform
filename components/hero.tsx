"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Shield, Truck, Heart, Gift, Sparkles, Crown, Baby, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Hero Background Icons - Mobile Responsive */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 md:top-20 left-4 md:left-10 text-pink-200/25 dark:text-pink-300/30 animate-float">
          <Baby className="h-8 w-8 md:h-12 md:w-12" />
        </div>
        <div className="absolute top-24 md:top-32 right-8 md:right-16 text-purple-200/25 dark:text-purple-300/30 animate-float-delayed">
          <Crown className="h-6 w-6 md:h-10 md:w-10" />
        </div>
        <div className="absolute bottom-24 md:bottom-32 left-8 md:left-20 text-blue-200/25 dark:text-blue-300/30 animate-bounce">
          <Gift className="h-8 w-8 md:h-14 md:w-14" />
        </div>
        <div className="absolute bottom-16 md:bottom-20 right-6 md:right-12 text-yellow-200/25 dark:text-yellow-300/30 animate-pulse">
          <Sparkles className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <div className="absolute top-1/2 left-4 md:left-8 text-green-200/25 dark:text-green-300/30 animate-float">
          <Heart className="h-4 w-4 md:h-6 md:w-6" />
        </div>
        <div className="absolute top-1/3 right-4 md:right-8 text-indigo-200/25 dark:text-indigo-300/30 animate-bounce">
          <Star className="h-5 w-5 md:h-7 md:w-7" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-rose-200/25 dark:text-rose-300/30 animate-float-delayed">
          <Zap className="h-6 w-6 md:h-9 md:w-9" />
        </div>
      </div>

      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 via-purple-100/40 to-blue-100/60 dark:from-pink-950/30 dark:via-purple-950/20 dark:to-blue-950/30" />

      <div className="container relative z-10 py-8 md:py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Text Content - Mobile Optimized */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-blue-500/15 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-pink-500 dark:text-pink-400" />
                <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Premium Baby Products
                </span>
                <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
              </div>
            </div>

            {/* Main Heading - Responsive Typography */}
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-none">
                <span className="block">Premium</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x">
                  Baby Clothes
                </span>
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground mt-2">
                  in Mangrol
                </span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
                Discover the finest collection of baby clothes, accessories, and essentials. Quality products for your
                little ones with love from{" "}
                <span className="font-semibold text-pink-600 dark:text-pink-400">Mahadev Baby Shop</span>.
              </p>
            </div>

            {/* Premium Features - Mobile Responsive */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 px-4 lg:px-0">
              {[
                { icon: Star, text: "Premium Quality", color: "from-yellow-400 to-orange-500" },
                { icon: Shield, text: "Safe Materials", color: "from-green-400 to-emerald-500" },
                { icon: Truck, text: "Fast Delivery", color: "from-blue-400 to-cyan-500" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 md:gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-2.5 md:px-4 py-1.5 md:py-2.5 rounded-xl md:rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <div className={`p-1 md:p-1.5 rounded-md md:rounded-lg bg-gradient-to-r ${feature.color} shadow-md`}>
                    <feature.icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start px-4 lg:px-0">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white shadow-2xl hover:shadow-pink-500/25 dark:hover:shadow-pink-500/40 transition-all duration-500 rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold"
                asChild
              >
                <Link href="/products/clothes">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              {/* <Button
                variant="outline"
                size="lg"
                className="group border-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 rounded-xl md:rounded-2xl px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold hover:shadow-lg"
                asChild
              >
                <Link href="/user/categories">
                  Browse Categories
                  <Sparkles className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </Button> */}
            </div>

            {/* Premium Stats - Mobile Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 pt-6 md:pt-8 px-4 lg:px-0">
              {[
                { number: "500+", label: "Happy Customers", icon: Heart, color: "from-pink-500 to-rose-500" },
                { number: "1000+", label: "Products", icon: Gift, color: "from-purple-500 to-violet-500" },
                { number: "5★", label: "Rating", icon: Star, color: "from-yellow-500 to-orange-500" },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="group p-3 md:p-4 lg:p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 rounded-xl md:rounded-2xl"
                >
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-xl md:rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-gray-900 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Hero Image - Mobile Responsive */}
          <div className="relative order-first lg:order-last mt-8 lg:mt-0">
            <div className="relative">
              {/* Floating Elements - Responsive */}
              <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 lg:-top-8 lg:-left-8 z-20">
                <Card className="p-2 md:p-3 lg:p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl rounded-xl md:rounded-2xl animate-float border-0">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <Crown className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm md:text-base lg:text-lg font-bold">Premium</div>
                      <div className="text-xs md:text-sm text-muted-foreground">Quality Assured</div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 lg:-bottom-8 lg:-right-8 z-20">
                <Card className="p-2 md:p-3 lg:p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl rounded-xl md:rounded-2xl animate-float-delayed border-0">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-400 to-green-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm md:text-base lg:text-lg font-bold">100% Safe</div>
                      <div className="text-xs md:text-sm text-muted-foreground">Baby Materials</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Image Container - Responsive */}
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-blue-900/30 p-4 md:p-6 lg:p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/15 via-purple-500/15 to-blue-500/15 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20" />
                <Image
                  src="/banner/Baby shop.png"
                  alt="Premium baby clothes collection"
                  width={600}
                  height={700}
                  priority
                  className="w-full h-auto rounded-xl md:rounded-2xl object-cover shadow-xl relative z-10"
                />

                {/* Decorative Elements - Responsive */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 3s;
        }
        @media (max-width: 768px) {
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1deg); }
          }
        }
      `}</style>
    </section>
  )
}
