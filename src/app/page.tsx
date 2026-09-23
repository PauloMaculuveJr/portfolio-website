import { About } from '@/components/sections/about'
import { Contact } from '@/components/sections/contact'
import { Experience } from '@/components/sections/experience'
import { Hero } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { TechStack } from '@/components/sections/tech-stack'
import { SiteHeader } from '@/components/site-header'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Experience />
        <Projects />
        <TechStack />
        <Contact />
      </main>
    </>
  )
}
