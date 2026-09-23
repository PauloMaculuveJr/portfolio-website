import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { site } from '@/data/site'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: `${site.name} | ${site.role}`,
  description: `Portfolio of ${site.name}, a ${site.role.toLowerCase()} based in ${site.location}, showcasing projects, skills, and experience.`,
}

export const viewport: Viewport = {
  themeColor: '#0f0d0b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} dark h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
