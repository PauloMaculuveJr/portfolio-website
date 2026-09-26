'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { GitHubIcon } from '@/components/icons'
import { Magnetic } from '@/components/magnetic'
import { ThemeToggle } from '@/components/theme-toggle'
import { nav, site } from '@/data/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  // Section anchors live on the home page; from any other page, link back to them
  const onHome = usePathname() === '/'
  const section = (hash: string) => (onHome ? hash : `/${hash}`)

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
        <Link
          href={section('#top')}
          aria-label={onHome ? `${site.name}, back to top` : `${site.name}, home`}
          className="font-display text-2xl tracking-tight"
        >
          {site.initials}
          <span className="text-accent">.</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <ul className="mr-4 hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={section(item.href)}
                  className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-full px-3 py-1.5 transition-colors outline-none focus-visible:ring-2"
                >
                  {item.label}
                </Link>
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
          <ThemeToggle />
          <Magnetic>
            <Link
              href="/contact"
              aria-current={onHome ? undefined : 'page'}
              className="border-border hover:border-accent hover:text-accent aria-[current=page]:border-accent aria-[current=page]:text-accent focus-visible:ring-ring rounded-full border px-4 py-1.5 transition-colors outline-none focus-visible:ring-2"
            >
              Contact
            </Link>
          </Magnetic>
        </nav>
      </div>
    </motion.header>
  )
}
