'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/data/site'
import { useTilt } from '@/hooks/use-tilt'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

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
  useTilt(ref, 2)

  const art = (
    <>
      <div
        data-art
        aria-hidden
        className="absolute -inset-[15%] bg-zinc-900 bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklch,var(--project),transparent_72%),transparent_60%)]"
      />
      <div data-depth="3" className="absolute inset-0 flex items-center justify-center p-10">
        <div
          className={cn(
            'transition-transform duration-500 group-hover/card:scale-105',
            project.logo.plate === 'light' && 'rounded-3xl bg-white p-4 shadow-2xl shadow-black/40',
          )}
        >
          <Image
            src={project.logo.src}
            alt={`${project.title} logo`}
            width={project.logo.width}
            height={project.logo.height}
            sizes="(min-width: 768px) 320px, 60vw"
            className={cn(
              'h-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]',
              // Wide wordmarks get more width; square marks stay compact
              project.logo.width > project.logo.height * 2
                ? 'w-48 md:w-72'
                : project.logo.plate
                  ? 'w-36 md:w-48'
                  : 'w-32 md:w-56',
            )}
          />
        </div>
      </div>
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
          <h3 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
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
              className="group hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
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

      {/* Brand panel: the project's logo over its color (a banner on mobile) */}
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden
          data-cursor="View"
          className="relative h-48 overflow-hidden md:h-auto"
        >
          {art}
        </a>
      ) : (
        <div data-cursor="Soon" className="relative h-48 overflow-hidden md:h-auto">
          {art}
        </div>
      )}
    </article>
  )
}
