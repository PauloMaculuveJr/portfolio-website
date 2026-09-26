'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'
import { ArrowDown, MapPin } from 'lucide-react'
import { site } from '@/data/site'
import { Magnetic } from '@/components/magnetic'

const ease = [0.22, 1, 0.36, 1] as const

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
}

// Each line rises out of a clipped mask, like a title card
const line: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.1, ease } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // Content drifts up and dims as the hero scrolls away
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.4])

  const [firstName, ...rest] = site.name.split(' ')
  const lastName = rest.join(' ')

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-svh items-center overflow-hidden"
    >
      {/* Backdrop: one soft glow + faint grid (light mode), masked toward the edges */}
      <motion.div
        aria-hidden
        style={{ scale: glowScale }}
        className="bg-accent/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[56rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-[size:72px_72px] dark:hidden"
      />

      <motion.div
        style={{ y, opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-6 pt-24 pb-16"
      >
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        >
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            {site.availability}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden />
            Based in {site.location}
          </span>
        </motion.p>

        <h1 className="text-[clamp(2.75rem,8.5vw,7.25rem)] leading-[0.95] font-semibold tracking-[-0.035em]">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={line} className="block">
              {firstName}
            </motion.span>
          </span>
          <span className="-mb-[0.14em] block overflow-hidden pb-[0.22em]">
            <motion.span
              variants={line}
              className="font-display text-muted-foreground -mb-[0.2em] block pr-[0.12em] pb-[0.2em] font-normal tracking-[-0.01em] italic"
            >
              {lastName}
            </motion.span>
          </span>
        </h1>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed text-balance">
            <span className="text-foreground">{site.role}.</span> {site.tagline}
          </p>

          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group bg-foreground text-background hover:bg-foreground/85 focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                View my work
                <ArrowDown
                  className="size-4 transition-transform group-hover:translate-y-0.5"
                  aria-hidden
                />
              </a>
            </Magnetic>
            <Magnetic>
              <Link
                href="/contact"
                className="border-border hover:border-foreground/40 focus-visible:ring-ring inline-flex h-12 items-center rounded-full border px-6 font-medium transition-colors outline-none focus-visible:ring-2"
              >
                Get in touch
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="text-muted-foreground hover:text-foreground absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] tracking-[0.3em] uppercase transition-colors"
      >
        Scroll
        {/* A thin line with a light sliding down it, instead of a bouncing arrow */}
        <span className="bg-border relative h-10 w-px overflow-hidden" aria-hidden>
          <span className="bg-foreground/70 absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_ease-in-out_infinite] motion-reduce:animate-none" />
        </span>
      </motion.a>
    </section>
  )
}
