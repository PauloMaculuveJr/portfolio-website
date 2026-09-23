'use client'

import type { RefObject } from 'react'
import { FINE_POINTER, gsap, useGSAP } from '@/lib/gsap'

// 3D tilt toward the cursor. Also exposes --gx/--gy (pointer position in %) for a glare
// layer, and shifts children marked [data-depth="n"] for a parallax sense of depth.
export function useTilt<T extends HTMLElement>(ref: RefObject<T | null>, maxDeg = 6) {
  useGSAP(() => {
    gsap.matchMedia().add(FINE_POINTER, () => {
      const el = ref.current
      if (!el) return

      gsap.set(el, { transformPerspective: 1000 })
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' })
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' })
      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', el).map((layer) => ({
        depth: Number(layer.dataset.depth) || 1,
        x: gsap.quickTo(layer, 'x', { duration: 0.6, ease: 'power3' }),
        y: gsap.quickTo(layer, 'y', { duration: 0.6, ease: 'power3' }),
      }))

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        ry((px - 0.5) * maxDeg * 2)
        rx(-(py - 0.5) * maxDeg * 2)
        el.style.setProperty('--gx', `${px * 100}%`)
        el.style.setProperty('--gy', `${py * 100}%`)
        layers.forEach((l) => {
          l.x((px - 0.5) * l.depth * 12)
          l.y((py - 0.5) * l.depth * 12)
        })
      }
      const onLeave = () => {
        rx(0)
        ry(0)
        layers.forEach((l) => {
          l.x(0)
          l.y(0)
        })
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
