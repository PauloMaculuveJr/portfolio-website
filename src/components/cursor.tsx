'use client'

import { useRef } from 'react'
import { FINE_POINTER, gsap, useGSAP } from '@/lib/gsap'

const INTERACTIVE = 'a, button, [data-cursor]'

// Dot tracks the pointer exactly; the ring trails behind and reacts to what is hovered.
// Add data-cursor="Label" to any element to show a label inside the ring.
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    gsap.matchMedia().add(FINE_POINTER, () => {
      const dot = dotRef.current!
      const ring = ringRef.current!
      const label = labelRef.current!
      const root = document.documentElement

      root.classList.add('has-custom-cursor')
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' })
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' })
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })

      let visible = false
      const onMove = (e: PointerEvent) => {
        if (!visible) {
          // Jump into place on first move instead of flying in from the corner
          gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
          visible = true
        }
        dotX(e.clientX)
        dotY(e.clientY)
        ringX(e.clientX)
        ringY(e.clientY)
      }

      const onOver = (e: PointerEvent) => {
        const target = (e.target as Element).closest<HTMLElement>(INTERACTIVE)
        const text = target?.dataset.cursor
        label.textContent = text ?? ''
        gsap.to(ring, {
          scale: text ? 2.4 : target ? 1.6 : 1,
          backgroundColor: text ? 'var(--accent)' : 'rgba(0,0,0,0)',
          borderColor: text ? 'var(--accent)' : 'var(--foreground)',
          duration: 0.35,
          ease: 'power3.out',
        })
        gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.2 })
        gsap.to(dot, { scale: target ? 0 : 1, duration: 0.25 })
      }

      const onLeaveWindow = () => {
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 })
        visible = false
      }
      const onDown = () => gsap.to(ring, { scale: '*=0.8', duration: 0.15 })
      const onUp = (e: PointerEvent) => onOver(e)

      window.addEventListener('pointermove', onMove)
      document.addEventListener('pointerover', onOver)
      document.documentElement.addEventListener('pointerleave', onLeaveWindow)
      window.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)

      return () => {
        root.classList.remove('has-custom-cursor')
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
      }
    })
  })

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className="border-foreground invisible absolute top-0 left-0 flex size-9 items-center justify-center rounded-full border opacity-0"
      >
        <span
          ref={labelRef}
          className="text-accent-foreground invisible text-[5px] font-semibold tracking-wider uppercase opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="bg-foreground invisible absolute top-0 left-0 size-1.5 rounded-full opacity-0"
      />
    </div>
  )
}
