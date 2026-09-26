'use client'

import { useRef } from 'react'
import {
  siClaude,
  siDocker,
  siExpo,
  siExpress,
  siFramer,
  siGit,
  siGithubactions,
  siGreensock,
  siJavascript,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRender,
  siShadcnui,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVercel,
  siVite,
  type SimpleIcon,
} from 'simple-icons'
import { SectionHeading } from '@/components/section-heading'
import { stack } from '@/data/site'
import { FINE_POINTER, gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

// Official brand marks (simple-icons, CC0). React Native's official mark is the React logo.
const ICONS: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Python: siPython,
  React: siReact,
  'React Native': siReact,
  Expo: siExpo,
  Express: siExpress,
  'Claude API': siClaude,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Supabase: siSupabase,
  'Three.js': siThreedotjs,
  Render: siRender,
  Docker: siDocker,
  'Next.js': siNextdotjs,
  Vite: siVite,
  'Tailwind CSS': siTailwindcss,
  'shadcn/ui': siShadcnui,
  GSAP: siGreensock,
  'Framer Motion': siFramer,
  'Node.js': siNodedotjs,
  Git: siGit,
  'GitHub Actions': siGithubactions,
  Vercel: siVercel,
}
// Near-black brand colors would vanish in dark mode, so those follow the text color instead
const brandColor = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return r + g + b < 120 ? 'var(--foreground)' : `#${hex}`
}

const tools = stack.flatMap(({ group, items }) => items.map((name) => ({ name, group })))
const fillSm = (3 - (tools.length % 3)) % 3
const fillLg = (5 - (tools.length % 5)) % 5

function ToolIcon({ name }: { name: string }) {
  const icon = ICONS[name]
  if (!icon) return null
  return (
    <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
      <path d={icon.path} />
    </svg>
  )
}

export function TechStack() {
  const ref = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Tiles rise in, sweeping across the grid from the top-left
      mm.add(MOTION_OK, () => {
        gsap.from('[data-tool]', {
          opacity: 0,
          y: 24,
          scale: 0.96,
          duration: 0.7,
          ease: 'power3.out',
          stagger: { each: 0.05, grid: 'auto', from: 'start' },
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
        })
      })

      // A soft spotlight follows the cursor and lights up the grid lines around it
      mm.add(FINE_POINTER, () => {
        const grid = gridRef.current!
        const onMove = (e: PointerEvent) => {
          const r = grid.getBoundingClientRect()
          grid.style.setProperty('--x', `${e.clientX - r.left}px`)
          grid.style.setProperty('--y', `${e.clientY - r.top}px`)
        }
        grid.addEventListener('pointermove', onMove)
        return () => grid.removeEventListener('pointermove', onMove)
      })
    },
    { scope: ref },
  )

  return (
    <section id="stack" ref={ref} className="mx-auto max-w-6xl px-6 py-32 md:py-44">
      <SectionHeading index="05" eyebrow="Tech stack" title="Tools I use" />

      {/* 1px gaps over a lit background form the grid lines; the spotlight brightens them */}
      <div
        ref={gridRef}
        className="group/grid bg-border relative grid grid-cols-2 gap-px overflow-hidden rounded-3xl border sm:grid-cols-3 lg:grid-cols-5"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(360px_circle_at_var(--x,50%)_var(--y,50%),color-mix(in_oklch,var(--accent),transparent_35%),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover/grid:opacity-100"
        />
        {tools.map(({ name, group }) => {
          const icon = ICONS[name]
          const color = icon ? brandColor(icon.hex) : 'var(--foreground)'
          return (
            <div
              key={name}
              data-tool
              style={{ '--brand': color } as React.CSSProperties}
              className="group bg-background relative flex min-h-36 flex-col justify-between gap-6 p-5 sm:min-h-44 sm:p-6"
            >
              {/* Brand-tinted glow on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--brand),transparent_88%),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="text-muted-foreground relative transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-[var(--brand)]">
                <ToolIcon name={name} />
              </span>
              <span className="relative">
                <span className="block font-medium tracking-tight">{name}</span>
                <span className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.15em] uppercase">
                  {group}
                </span>
              </span>
            </div>
          )
        })}
        {/* Complete the last row on 3- and 5-column layouts so no gap shows through */}
        {Array.from({ length: Math.max(fillSm, fillLg) }, (_, i) => (
          <div
            key={i}
            aria-hidden
            className={cn(
              'bg-background text-muted-foreground/50 hidden items-end p-6 font-mono text-[0.65rem] tracking-[0.15em] uppercase',
              i < fillSm ? 'sm:flex' : 'sm:hidden',
              i < fillLg ? 'lg:flex' : 'lg:hidden',
            )}
          >
            {i === 0 && '+ always learning'}
          </div>
        ))}
      </div>
    </section>
  )
}
