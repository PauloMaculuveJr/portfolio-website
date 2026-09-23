'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { about } from '@/data/site'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

const DIM = 0.12
const WINDOW = 3 // how many words are mid-fade at once as the reveal sweeps through

export function About() {
  const ref = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Words light up one by one, scrubbed to scroll position. The words are re-read on every
  // update, so edited copy (or a hot reload) can never leave some words out of the reveal.
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const words = () =>
          textRef.current?.querySelectorAll<HTMLElement>('[data-reveal-word]') ?? []
        const apply = (progress: number) => {
          const all = words()
          const head = progress * (all.length + WINDOW)
          all.forEach((word, i) => {
            const t = gsap.utils.clamp(0, 1, (head - i) / WINDOW)
            word.style.opacity = String(DIM + (1 - DIM) * t)
          })
        }

        const sweep = { progress: 0 }
        apply(0)
        gsap.to(sweep, {
          progress: 1,
          ease: 'none',
          onUpdate: () => apply(sweep.progress),
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: true,
          },
        })
        return () => words().forEach((word) => (word.style.opacity = ''))
      })
    },
    { scope: ref },
  )

  return (
    <section id="about" ref={ref} className="mx-auto max-w-6xl px-6 py-32 md:py-48">
      <SectionHeading index="01" eyebrow="About" title="A little about me" />
      <p
        ref={textRef}
        className="max-w-4xl text-[clamp(1.6rem,3.6vw,3.25rem)] leading-[1.2] font-medium tracking-[-0.02em]"
      >
        {about.split(' ').map((word, i) => (
          <span key={i} data-reveal-word>
            {word}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
