'use client'

import type { RefObject } from 'react'
import { FINE_POINTER, gsap, useGSAP } from '@/lib/gsap'

// Element leans toward the cursor while hovered, then springs back
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.35) {
  useGSAP(() => {
    gsap.matchMedia().add(FINE_POINTER, () => {
      const el = ref.current
      if (!el) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength)
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength)
      }
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    })
  })
}
