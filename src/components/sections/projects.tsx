'use client'

import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/data/site'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

export function Projects() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-project]')

        cards.forEach((card, i) => {
          // As the next card slides over, the current one recedes into the background
          const next = cards[i + 1]
          if (next) {
            gsap.to(card.firstElementChild, {
              scale: 0.9,
              opacity: 0.35,
              filter: 'blur(3px)',
              ease: 'none',
              scrollTrigger: {
                trigger: next,
                // Only recede once the next card starts to overlap this one
                start: 'top 75%',
                end: 'top top+=96',
                scrub: true,
              },
            })
          }

          // Parallax on the preview art inside each card
          gsap.fromTo(
            card.querySelector('[data-art]'),
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
    },
    { scope: ref },
  )

  return (
    <section id="work" ref={ref} className="mx-auto max-w-6xl px-6 py-32 md:py-48">
      <SectionHeading index="04" eyebrow="Selected work" title="Things I have built" />

      <div className="flex flex-col gap-10">
        {projects.map((project, i) => (
          <div key={project.title} data-project className="sticky top-24">
            <article
              style={{ '--project': project.color } as React.CSSProperties}
              className="border-border bg-card grid origin-top overflow-hidden rounded-3xl border will-change-transform md:h-[70vh] md:max-h-[38rem] md:grid-cols-2"
            >
              <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
                <div>
                  <p className="text-muted-foreground mb-6 font-mono text-sm">
                    {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </p>
                  <h3 className="mb-4 text-3xl font-semibold tracking-tight md:text-5xl">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground max-w-md leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <ul className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border-border text-muted-foreground rounded-full border px-3 py-1 text-xs"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  {project.href && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--project)]"
                    >
                      View project
                      <ArrowUpRight
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </a>
                  )}
                </div>
              </div>

              {/* Preview art: swap for a real screenshot with next/image when available */}
              <div className="relative hidden overflow-hidden md:block">
                <div
                  data-art
                  aria-hidden
                  className="absolute -inset-[15%] bg-[radial-gradient(circle_at_30%_30%,var(--project),transparent_60%),radial-gradient(circle_at_80%_80%,color-mix(in_oklch,var(--project),black_50%),transparent_55%)] opacity-80"
                />
                <span
                  aria-hidden
                  className="font-display text-background/80 absolute inset-0 flex items-center justify-center text-[12rem] italic"
                >
                  {project.title.charAt(0)}
                </span>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
