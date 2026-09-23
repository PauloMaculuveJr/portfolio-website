'use client'

import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'framer-motion'
import 'lenis/dist/lenis.css'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  // Respect the OS setting: fall back to native scrolling
  if (reduceMotion) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
      {children}
    </ReactLenis>
  )
}
