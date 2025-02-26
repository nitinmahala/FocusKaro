"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { usePathname } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Toaster } from "sonner"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageTransition from "@/components/page-transition"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>FocusKaro | Boost Your Productivity</title>
        <meta name="description" content="A digital productivity dashboard" />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95`}
      >
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
          <AnimatePresence mode="wait">
            <PageTransition key={pathname}>{children}</PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  )
}
