'use client'

import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { GitHubIcon } from '@/components/icons'
import { site } from '@/data/site'
import { useMagnetic } from '@/hooks/use-magnetic'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  useMagnetic(buttonRef)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Giant headline letters rise and settle as the section scrolls in
        gsap.from('[data-char]', {
          yPercent: 120,
          rotate: 8,
          opacity: 0,
          stagger: 0.03,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 25%', scrub: 1 },
        })
        gsap.from('[data-contact-fade]', {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-contact-fade]', start: 'top 90%' },
        })
      })
    },
    { scope: ref },
  )

  const headline = ["Let's", 'talk']
  const GRADIENT = 'from-accent to-accent-2 bg-linear-to-r bg-clip-text text-transparent'

  return (
    <section id="contact" ref={ref} className="border-border relative overflow-hidden border-t">
      <div
        aria-hidden
        className="bg-accent/20 pointer-events-none absolute -bottom-1/2 left-1/2 -z-10 size-[50rem] -translate-x-1/2 rounded-full blur-[160px]"
      />
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-12 md:pt-48">
        <p className="text-muted-foreground mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.25em] uppercase">
          <span className="text-accent">06</span>
          <span className="bg-border h-px w-10" aria-hidden />
          Contact
        </p>

        <h2
          aria-label="Let's talk"
          className="text-[clamp(4.5rem,18vw,16rem)] leading-[0.85] font-semibold tracking-[-0.05em]"
        >
          {headline.map((word, w) => (
            <span
              key={word}
              aria-hidden
              className={`block overflow-hidden pb-[0.05em] ${w === 1 ? 'font-display font-normal italic' : ''}`}
            >
              {word.split('').map((char, i, all) => (
                <span
                  key={i}
                  data-char
                  // Each letter shows its slice of one gradient spanning the whole word
                  style={
                    w === 1
                      ? {
                          backgroundSize: `${all.length * 100}% 100%`,
                          backgroundPosition: `${(i / (all.length - 1)) * 100}% 0`,
                        }
                      : undefined
                  }
                  className={`inline-block ${w === 1 ? `${GRADIENT} pr-[0.04em]` : ''}`}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="mt-16 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p data-contact-fade className="text-muted-foreground max-w-md text-lg leading-relaxed">
            Have a project in mind, a role to fill, or just want to say hi? My inbox is always open.
          </p>
          <a
            ref={buttonRef}
            data-contact-fade
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-foreground text-background hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex size-40 shrink-0 flex-col items-center justify-center gap-2 self-start rounded-full font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-4 md:size-48 md:self-auto"
          >
            <GitHubIcon className="size-6" />
            <span className="inline-flex items-center gap-1">
              Say hello
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
          </a>
        </div>

        <footer className="border-border text-muted-foreground mt-32 flex flex-col gap-4 border-t pt-8 pr-28 text-sm md:flex-row md:items-center md:justify-between md:pr-36">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>Designed & built in {site.location}</span>
        </footer>
      </div>
    </section>
  )
}
