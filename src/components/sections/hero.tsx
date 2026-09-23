'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion'
import { ArrowDown, MapPin } from 'lucide-react'
import { site } from '@/data/site'

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
      {/* Backdrop: ember glow + faint grid, masked toward the edges */}
      <motion.div
        aria-hidden
        style={{ scale: glowScale }}
        className="bg-accent/25 pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] bg-[size:72px_72px]"
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
            <span className="relative flex size-2">
              <span className="bg-accent absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none" />
              <span className="bg-accent relative inline-flex size-2 rounded-full" />
            </span>
            {site.availability}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden />
            Based in {site.location}
          </span>
        </motion.p>

        <h1 className="text-[clamp(3rem,11vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.04em]">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span variants={line} className="block">
              {firstName}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              variants={line}
              className="font-display text-accent block font-normal tracking-[-0.02em] italic"
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
            <a
              href="#work"
              className="group bg-foreground text-background hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              View my work
              <ArrowDown
                className="size-4 transition-transform group-hover:translate-y-0.5"
                aria-hidden
              />
            </a>
            <a
              href="#contact"
              className="border-border hover:border-foreground/40 focus-visible:ring-ring inline-flex h-12 items-center rounded-full border px-6 font-medium transition-colors outline-none focus-visible:ring-2"
            >
              Get in touch
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="text-muted-foreground hover:text-foreground absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.3em] uppercase transition-colors"
      >
        Scroll
        <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" aria-hidden />
      </motion.a>
    </section>
  )
}
