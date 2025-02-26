"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Clock, FileText, Home, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/tasks", label: "Tasks", icon: <CheckCircle className="h-4 w-4 mr-2" /> },
    { href: "/timer", label: "Timer", icon: <Clock className="h-4 w-4 mr-2" /> },
    { href: "/notes", label: "Notes", icon: <FileText className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/10 dark:bg-gray-900/20 backdrop-blur-lg shadow-md" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 relative z-10">
            <div className="relative w-8 h-8">
              <motion.div
                className="absolute inset-0 bg-blue-500/80 rounded-md"
                animate={{
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
              <motion.div
                className="absolute inset-0 bg-indigo-500/80 rounded-md"
                animate={{
                  rotate: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 0.2,
                }}
                style={{ opacity: 0.7 }}
              />
            </div>
            <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              FocusKaro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "text-blue-500 dark:text-blue-400 bg-white/10 dark:bg-gray-800/30 backdrop-blur-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white/5 dark:hover:bg-gray-800/20 hover:backdrop-blur-md"
                }`}
              >
                <span className="flex items-center">
                  {item.icon}
                  {item.label}
                </span>
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative z-10 text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800/30 hover:backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Light Grey Bottom Line - Always Visible */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200/30 dark:bg-gray-700/30"></div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/10 dark:bg-gray-900/30 backdrop-blur-lg border-t border-gray-200/20 dark:border-gray-700/20"
        >
          <nav className="container mx-auto px-4 py-3 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 my-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-white/10 dark:bg-gray-800/40 text-blue-500 dark:text-blue-400 backdrop-blur-md"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white/5 dark:hover:bg-gray-800/20"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  )
}