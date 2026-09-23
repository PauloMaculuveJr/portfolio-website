'use client'

import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { useReducedMotion } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import 'lenis/dist/lenis.css'

// Drive Lenis from GSAP's ticker so ScrollTrigger and smooth scroll share one frame loop
function GsapSync() {
  const lenis = useLenis(ScrollTrigger.update)

  useEffect(() => {
    if (!lenis) return
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [lenis])

  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  // Respect the OS setting: fall back to native scrolling
  if (reduceMotion) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true, autoRaf: false }}>
      <GsapSync />
      {children}
    </ReactLenis>
  )
}
