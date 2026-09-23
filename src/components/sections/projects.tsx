'use client'

import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/data/site'
import { useTilt } from '@/hooks/use-tilt'
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
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  useTilt(ref, 3)

  const art = (
    <>
      <div
        data-art
        aria-hidden
        className="absolute -inset-[15%] bg-[radial-gradient(circle_at_30%_30%,var(--project),transparent_60%),radial-gradient(circle_at_80%_80%,color-mix(in_oklch,var(--project),black_50%),transparent_55%)] opacity-80"
      />
      <span
        data-depth="3"
        aria-hidden
        className="font-display text-background/80 absolute inset-0 flex items-center justify-center text-[12rem] italic"
      >
        {project.title.charAt(0)}
      </span>
    </>
  )

  return (
    <article
      ref={ref}
      style={{ '--project': project.color } as React.CSSProperties}
      className="group/card border-border bg-card relative grid origin-top overflow-hidden rounded-3xl border will-change-transform md:h-[70vh] md:max-h-[38rem] md:grid-cols-2"
    >
      {/* Soft light that follows the pointer (position set by useTilt) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.07),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
      />

      <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
        <div>
          <p className="text-muted-foreground mb-6 font-mono text-sm">
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </p>
          <h3 className="mb-4 text-3xl font-semibold tracking-tight md:text-5xl">
            {project.title}
          </h3>
          <p className="text-muted-foreground max-w-md leading-relaxed">{project.description}</p>
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
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden
          data-cursor="View"
          className="relative hidden overflow-hidden md:block"
        >
          {art}
        </a>
      ) : (
        <div data-cursor="Soon" className="relative hidden overflow-hidden md:block">
          {art}
        </div>
      )}
    </article>
  )
}
