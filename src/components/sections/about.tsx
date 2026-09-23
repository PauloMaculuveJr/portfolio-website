'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { about } from '@/data/site'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

export function About() {
  const ref = useRef<HTMLElement>(null)

  // Words light up one by one, scrubbed to scroll position
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-reveal-word]',
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-reveal-text]',
              start: 'top 80%',
              end: 'bottom 45%',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: ref },
  )

  return (
    <section id="about" ref={ref} className="mx-auto max-w-6xl px-6 py-32 md:py-48">
      <SectionHeading index="01" eyebrow="About" title="A little about me" />
      <p
        data-reveal-text
        className="max-w-5xl text-[clamp(1.6rem,3.6vw,3.25rem)] leading-[1.2] font-medium tracking-[-0.02em]"
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
