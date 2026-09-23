import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Cursor } from '@/components/cursor'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { SpaceBackground } from '@/components/space-background'
import { site } from '@/data/site'
import { themeScript } from '@/lib/theme'
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} dark h-full antialiased`}
      // The theme script below may flip the dark class before React hydrates
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain flex min-h-full flex-col">
        <SpaceBackground />
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  )
}
