'use client'

import { useRef } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { services } from '@/data/site'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

export function Services() {
  const ref = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Desktop: pin the section and scroll the cards sideways
      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        const track = trackRef.current!
        const distance = () => track.scrollWidth - viewportRef.current!.clientWidth

        gsap.set(viewportRef.current, { overflow: 'hidden' })
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        // Each card's number drifts against the scroll for depth
        gsap.utils.toArray<HTMLElement>('[data-card-num]').forEach((num) => {
          gsap.fromTo(
            num,
            { xPercent: 40 },
            {
              xPercent: -40,
              ease: 'none',
              scrollTrigger: {
                trigger: num.parentElement,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
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
      className="flex min-h-svh flex-col justify-center overflow-hidden py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          index="02"
          eyebrow="What I do"
          title="Crafting the web, end to end"
          className="md:mb-16"
        />
      </div>

      <div ref={viewportRef} className="md:overflow-x-auto">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-6 md:w-max md:flex-row md:pr-[20vw] md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
        >
          {services.map((service, i) => (
            <article
              key={service.title}
              data-card
              className="group border-border bg-card/60 hover:border-accent/50 relative flex flex-col justify-between overflow-hidden rounded-3xl border p-8 backdrop-blur-sm transition-colors md:h-[26rem] md:w-[28rem] md:p-10"
            >
              <span
                data-card-num
                aria-hidden
                className="font-display text-foreground/[0.06] group-hover:text-accent/15 pointer-events-none absolute -top-6 -right-4 text-[10rem] leading-none transition-colors md:text-[14rem]"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-accent font-mono text-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative mt-16 md:mt-0">
                <h3 className="mb-4 text-2xl font-semibold tracking-tight md:text-3xl">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
