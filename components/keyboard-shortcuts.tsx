"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"

export default function KeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger shortcuts when not in an input, textarea, or contentEditable element
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }

      // Ctrl/Cmd + key shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "h":
            e.preventDefault()
            router.push("/")
            toast.info("Navigated to Home")
            break
          case "t":
            e.preventDefault()
            router.push("/tasks")
            toast.info("Navigated to Tasks")
            break
          case "p":
            e.preventDefault()
            router.push("/timer")
            toast.info("Navigated to Timer")
            break
          case "n":
            e.preventDefault()
            router.push("/notes")
            toast.info("Navigated to Notes")
            break
        }
      } else {
        // Single key shortcuts
        switch (e.key) {
          case " ":
            // Toggle timer play/pause when on timer page
            if (pathname === "/timer") {
              e.preventDefault()
              const timerButton = document.querySelector(
                'button:has(svg[data-lucide="play"]), button:has(svg[data-lucide="pause"])',
              ) as HTMLButtonElement
              if (timerButton) {
                timerButton.click()
              }
            }
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, pathname])

  return null
}

