import { GitHubIcon } from '@/components/icons'
import { Hero } from '@/components/sections/hero'
import { SiteHeader } from '@/components/site-header'
import { site } from '@/data/site'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
      </main>

      {/* Minimal contact footer until the full Contact section lands */}
      <footer id="contact" className="border-border border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-3xl md:text-4xl">
            Let&apos;s build something <span className="text-accent italic">together</span>.
          </p>
          <div className="text-muted-foreground flex items-center gap-6 text-sm">
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground inline-flex items-center gap-2 transition-colors"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
