'use client'

import { Moon, Sun } from 'lucide-react'
import { MOTION_OK } from '@/lib/gsap'

export function ThemeToggle() {
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement
    const next = !root.classList.contains('dark')
    const apply = () => {
      root.classList.toggle('dark', next)
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light')
      } catch {}
    }

    // Circular reveal from the button where supported; plain swap otherwise
    if (!document.startViewTransition || !window.matchMedia(MOTION_OK).matches) {
      apply()
      return
    }
    const { clientX: x, clientY: y } = e
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    document.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 600,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full p-2 transition-colors outline-none focus-visible:ring-2"
    >
      {/* Both icons render; CSS picks one, so server and client markup always match */}
      <Sun className="hidden size-5 dark:block" aria-hidden />
      <Moon className="size-5 dark:hidden" aria-hidden />
    </button>
  )
}
