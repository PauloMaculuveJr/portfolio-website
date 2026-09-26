'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { stack } from '@/data/site'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

export function TechStack() {
  const ref = useRef<HTMLElement>(null)

  // Rows fade up one after another as the list scrolls into view
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from('[data-stack-row]', {
          opacity: 0,
          y: 24,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-stack-list]', start: 'top 80%' },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section id="stack" ref={ref} className="mx-auto max-w-6xl px-6 py-32 md:py-44">
      <SectionHeading index="05" eyebrow="Tech stack" title="Tools I reach for" />

      <dl data-stack-list className="border-border border-t">
        {stack.map(({ group, items }) => (
          <div
            key={group}
            data-stack-row
            className="border-border grid gap-3 border-b py-6 md:grid-cols-[16rem_1fr] md:items-baseline md:gap-10"
          >
            <dt className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
              {group}
            </dt>
            <dd className="flex flex-wrap gap-x-8 gap-y-2 text-xl font-medium tracking-tight md:text-2xl">
              {items.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
