"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Clock, FileText, Home, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/tasks", label: "Tasks", icon: <CheckCircle className="h-5 w-5" /> },
    { href: "/timer", label: "Timer", icon: <Clock className="h-5 w-5" /> },
    { href: "/notes", label: "Notes", icon: <FileText className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar backdrop for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-40 w-72 bg-card border-r shadow-lg md:shadow-none md:translate-x-0"
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 mt-2">
            <Link href="/" className="flex items-center gap-2" onClick={closeSidebar}>
              <div className="font-bold text-xl">Productivity</div>
            </Link>
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t">
            <ThemeToggle />
          </div>
        </div>
      </motion.aside>
    </>
  )
}

