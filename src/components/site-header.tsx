'use client'

import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { GitHubIcon } from '@/components/icons'
import { nav, site } from '@/data/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        scrolled && 'border-border bg-background/70 border-b backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          aria-label={`${site.name}, back to top`}
          className="font-display text-2xl tracking-tight"
        >
          {site.initials}
          <span className="text-accent">.</span>
        </a>

        <nav className="flex items-center gap-2 text-sm">
          <ul className="mr-4 hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full px-3 py-1.5 transition-colors outline-none focus-visible:ring-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full p-2 transition-colors outline-none focus-visible:ring-2"
          >
            <GitHubIcon className="size-5" />
          </a>
          <a
            href="#contact"
            className="border-border hover:border-accent hover:text-accent focus-visible:ring-ring rounded-full border px-4 py-1.5 transition-colors outline-none focus-visible:ring-2"
          >
            Contact
          </a>
        </nav>
      </div>
    </motion.header>
  )
}
