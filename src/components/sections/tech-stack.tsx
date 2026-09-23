'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { stack } from '@/data/site'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap'

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = reverse ? [...stack].reverse() : stack
  // Two copies side by side so the loop is seamless at -50%
  return (
    <div data-row data-reverse={reverse || undefined} className="flex w-max">
      {[0, 1].map((copy) => (
        <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0">
          {items.map((tech) => (
            <li
              key={tech}
              className="flex items-center gap-8 pr-8 text-[clamp(2.5rem,7vw,6rem)] font-semibold tracking-[-0.04em] whitespace-nowrap"
            >
              <span
                className={reverse ? 'font-display text-muted-foreground font-normal italic' : ''}
              >
                {tech}
              </span>
              <span className="text-accent text-[0.4em]" aria-hidden>
                ✦
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

export function TechStack() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]')
        const loops = rows.map((row) =>
          row.dataset.reverse
            ? gsap.fromTo(
                row,
                { xPercent: -50 },
                { xPercent: 0, duration: 40, ease: 'none', repeat: -1 },
              )
            : gsap.to(row, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 }),
        )
        // Start deep into the infinite loop so scrolling up (negative timeScale) never hits time 0
        loops.forEach((loop) => loop.totalTime(loop.duration() * 1000))

        // Scroll speed boosts the marquee and skews the text; direction follows scroll direction
        const skew = gsap.quickTo(rows, 'skewX', { duration: 0.5, ease: 'power3' })
        ScrollTrigger.create({
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const velocity = self.getVelocity()
            const boost = 1 + Math.min(Math.abs(velocity) / 250, 6)
            loops.forEach((loop) =>
              gsap.to(loop, { timeScale: boost * self.direction, duration: 0.2, overwrite: true }),
            )
            skew(gsap.utils.clamp(-12, 12, velocity / -150))
          },
        })

        // Ease back to cruising speed once scrolling stops
        const settle = () => {
          loops.forEach((loop) =>
            gsap.to(loop, {
              timeScale: Math.sign(loop.timeScale()) || 1,
              duration: 1,
              overwrite: true,
            }),
          )
          skew(0)
        }
        ScrollTrigger.addEventListener('scrollEnd', settle)
        return () => ScrollTrigger.removeEventListener('scrollEnd', settle)
      })
    },
    { scope: ref },
  )

  return (
    <section id="stack" ref={ref} className="overflow-hidden py-32 md:py-48">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading index="05" eyebrow="Tech stack" title="Tools I reach for" />
      </div>

      {/* Animated marquee, or a static list when reduced motion is preferred */}
      <div className="flex flex-col gap-4 motion-reduce:hidden" aria-hidden>
        <Row />
        <Row reverse />
      </div>
      <ul aria-hidden className="mx-auto hidden max-w-6xl flex-wrap gap-3 px-6 motion-reduce:flex">
        {stack.map((tech) => (
          <li key={tech} className="border-border rounded-full border px-4 py-2">
            {tech}
          </li>
        ))}
      </ul>
      <ul className="sr-only">
        {stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </section>
  )
}
