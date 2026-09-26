import type { Metadata } from 'next'
import { Briefcase, MapPin } from 'lucide-react'
import { GitHubIcon } from '@/components/icons'
import { SiteHeader } from '@/components/site-header'
import { experience, site } from '@/data/site'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: `Contact | ${site.name}`,
  description: `Get in touch with ${site.name} about a project, a role, or just to say hi.`,
}

const current = experience[0]

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="bg-accent/10 pointer-events-none absolute top-0 left-1/4 -z-10 size-[40rem] -translate-x-1/2 rounded-full blur-[160px]"
        />
        <div
          aria-hidden
          className="bg-accent/5 pointer-events-none absolute right-0 bottom-0 -z-10 size-[32rem] rounded-full blur-[140px]"
        />

        <div className="mx-auto grid max-w-6xl gap-16 px-6 pt-36 pb-24 md:pt-44 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <p className="text-muted-foreground mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.25em] uppercase">
              <span className="text-accent">↗</span>
              <span className="bg-border h-px w-10" aria-hidden />
              Contact
            </p>
            <h1 className="text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
              Got something{' '}
              <span className="font-display text-muted-foreground inline-block pr-[0.1em] pb-[0.1em] font-normal italic">
                in mind?
              </span>
            </h1>
            <p className="text-muted-foreground mt-8 max-w-md text-lg leading-relaxed">
              I&apos;m Paulo. A site that needs building, a team that needs a developer, or you just
              want to talk code: write me a note. It lands in my own inbox, not a support queue.
            </p>

            <ul className="mt-12 flex flex-col gap-5">
              <li className="flex items-center gap-4">
                <span className="border-border bg-card/60 flex size-11 items-center justify-center rounded-full border backdrop-blur-sm">
                  <Briefcase className="text-accent size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-medium">{current.role}</span>
                  <span className="text-muted-foreground text-sm">{current.place}</span>
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="border-border bg-card/60 flex size-11 items-center justify-center rounded-full border backdrop-blur-sm">
                  <MapPin className="text-accent size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-medium">Based in {site.location}</span>
                  <span className="text-muted-foreground text-sm">{site.availability}</span>
                </span>
              </li>
              <li>
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4"
                >
                  <span className="border-border bg-card/60 group-hover:border-accent flex size-11 items-center justify-center rounded-full border backdrop-blur-sm transition-colors">
                    <GitHubIcon className="size-5" />
                  </span>
                  <span>
                    <span className="group-hover:text-accent block font-medium transition-colors">
                      GitHub
                    </span>
                    <span className="text-muted-foreground text-sm">@PauloMaculuveJr</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-backwards delay-150 duration-700">
            <div className="border-border bg-card/70 rounded-3xl border p-6 shadow-[0_30px_80px_-30px_var(--shadow)] backdrop-blur-md sm:p-10">
              <ContactForm />
            </div>
          </div>
        </div>

        <footer className="border-border text-muted-foreground mx-auto flex max-w-6xl flex-col gap-4 border-t px-6 py-8 text-sm md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>Designed & built in {site.location}</span>
        </footer>
      </main>
    </>
  )
}
