'use client'

import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type Props = {
  index: string
  eyebrow: string
  title: string
  className?: string
}

// Numbered eyebrow + title whose words rise out of a mask when scrolled into view
export function SectionHeading({ index, eyebrow, title, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        })
        tl.from('[data-eyebrow]', { opacity: 0, x: -20, duration: 0.8, ease: 'power3.out' }).from(
          '[data-word]',
          { yPercent: 110, duration: 1.1, stagger: 0.06, ease: 'expo.out' },
          '<0.1',
        )
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={cn('mb-16 md:mb-24', className)}>
      <p
        data-eyebrow
        className="text-muted-foreground mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.25em] uppercase"
      >
        <span className="text-accent">{index}</span>
        <span className="bg-border h-px w-10" aria-hidden />
        {eyebrow}
      </p>
      <h2 className="max-w-4xl text-[clamp(2.25rem,6vw,5rem)] leading-[0.95] font-semibold tracking-[-0.035em]">
        {title.split(' ').map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-top">
            <span data-word className="inline-block">
              {word}&nbsp;
            </span>
          </span>
        ))}
      </h2>
    </div>
  )
}
