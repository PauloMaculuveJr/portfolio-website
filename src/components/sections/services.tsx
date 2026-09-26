'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { services } from '@/data/site'
import { useTilt } from '@/hooks/use-tilt'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

export function Services() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Desktop: pin the section while the cards slide in from the right, one after another,
      // and land side by side in a row that fits the screen, so every service ends up visible
      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-card]')
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: '+=110%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        cards.forEach((card, i) => {
          const at = i * 0.22
          tl.fromTo(
            card,
            {
              // Start just past the right edge of the screen. Measure the card's resting spot
              // (its on-screen position minus any x it already has from this animation).
              x: () =>
                window.innerWidth -
                (card.getBoundingClientRect().left - Number(gsap.getProperty(card, 'x'))) +
                40,
            },
            { x: 0, duration: 0.55 },
            at,
          )
        })
        // Hold the finished row on screen for a beat before the page moves on
        tl.to({}, { duration: 0.35 })
      })

      // Mobile: simple staggered fade-up
      mm.add(`(max-width: 767px) and ${MOTION_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          })
        })
      })
    },
    { scope: ref },
  )

  return (
    <section
      id="services"
      ref={ref}
      className="flex min-h-svh flex-col overflow-hidden py-24 md:justify-center md:pt-24 md:pb-10"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          index="02"
          eyebrow="What I do"
          title="What I can build for you"
          className="md:mb-12"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ service, index }: { service: (typeof services)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  useTilt(ref)

  return (
    <article
      ref={ref}
      data-card
      className="group border-border bg-card/60 hover:border-accent/50 relative flex flex-col justify-between overflow-hidden rounded-3xl border p-8 backdrop-blur-sm transition-colors md:h-[clamp(16rem,44svh,24rem)] md:p-8 lg:p-10"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),color-mix(in_oklch,var(--accent),transparent_85%),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="text-accent font-mono text-sm">{String(index + 1).padStart(2, '0')}</span>
      <div className="relative mt-16 md:mt-0">
        <h3 className="mb-4 text-2xl font-semibold tracking-tight md:text-3xl">{service.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
      </div>
    </article>
  )
}
