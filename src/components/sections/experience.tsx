'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { experience } from '@/data/site'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

export function Experience() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // The timeline rail draws itself as you scroll through the list
        gsap.fromTo(
          '[data-rail]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-timeline]',
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: true,
            },
          },
        )

        gsap.utils.toArray<HTMLElement>('[data-entry]').forEach((entry) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: entry, start: 'top 72%' },
          })
          tl.from(entry.querySelector('[data-dot]'), {
            scale: 0,
            duration: 0.5,
            ease: 'back.out(3)',
          }).from(
            entry.querySelectorAll('[data-entry-part]'),
            { opacity: 0, x: -40, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
            '<',
          )
        })
      })
    },
    { scope: ref },
  )

  return (
    <section id="experience" ref={ref} className="mx-auto max-w-6xl px-6 py-32 md:py-48">
      <SectionHeading index="03" eyebrow="Experience" title="Where I have been" />

      <ol data-timeline className="relative ml-2 md:ml-4">
        <span aria-hidden className="bg-border absolute top-0 bottom-0 left-0 w-px" />
        <span
          data-rail
          aria-hidden
          className="from-accent to-accent/0 absolute top-0 bottom-0 left-0 w-px origin-top bg-gradient-to-b"
        />

        {experience.map((item) => (
          <li key={item.role} data-entry className="relative pb-20 pl-10 last:pb-0 md:pl-16">
            <span
              data-dot
              aria-hidden
              className="bg-accent ring-background absolute top-2 -left-[5px] size-[11px] rounded-full ring-4"
            />
            <div className="grid gap-4 md:grid-cols-[12rem_1fr] md:gap-12">
              <p data-entry-part className="text-muted-foreground pt-1 font-mono text-sm">
                {item.period}
              </p>
              <div>
                <h3 data-entry-part className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {item.role}
                </h3>
                <p data-entry-part className="text-accent mt-1 mb-4">
                  {item.place}
                </p>
                <p data-entry-part className="text-muted-foreground max-w-xl leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
