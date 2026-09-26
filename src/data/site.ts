// Single source of truth for site content.
// Name, location, and links come from github.com/PauloMaculuveJr.
// Anything marked TODO is a placeholder to replace with real copy.

export const site = {
  name: 'Paulo Maculuve Junior',
  initials: 'PM',
  // TODO: confirm your title
  role: 'Software Developer',
  location: 'Mozambique',
  // TODO: replace with your own one-line pitch
  tagline:
    'I build fast, thoughtful web experiences with TypeScript, React, and Next.js, from first sketch to production.',
  availability: 'Open to new opportunities',
  links: {
    github: 'https://github.com/PauloMaculuveJr',
    // TODO: add your email and LinkedIn, then surface them in the header/contact section
    email: '',
    linkedin: '',
  },
} as const

// Section links on the home page; the header prefixes them with / on other pages
export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
] as const

// TODO: rewrite in your own voice
export const about =
  "I'm a teenage developer from Mozambique who loves turning ideas into interfaces that feel alive. I started young and haven't stopped building since. I care about the small details: smooth motion, clean code, fast load times, and products that people actually enjoy using."

export const services = [
  {
    title: 'Web Apps & Websites',
    description:
      'Fast, responsive websites and full-stack web apps, from landing pages and online stores to dashboards with payments, auth, and APIs.',
  },
  {
    title: 'Mobile Applications',
    description:
      'Cross-platform mobile apps for iOS and Android that feel native, work smoothly, and connect to the services your business runs on.',
  },
  {
    title: 'AI Automation',
    description:
      'AI-powered workflows and assistants that take repetitive work off your plate, from answering customers to processing data.',
  },
] as const

export const experience = [
  {
    period: '2025 – Present',
    role: 'Co-founder & Full-Stack Engineer',
    place: 'Techtroove',
    // TODO: add a line about what Techtroove builds and your biggest wins there
    description:
      'Co-founded Techtroove and lead its engineering end to end: product architecture, backend and APIs, and the polished frontends people actually use.',
  },
] as const

// Live sites for each project (the repos themselves are private)
export const projects = [
  {
    title: 'MozGate Technology',
    description:
      'Website for MozGate Technology, an enterprise IT solutions provider in Mozambique, with scroll-driven GSAP animation.',
    tags: ['React', 'TypeScript', 'Vite', 'GSAP'],
    href: 'https://www.mozgate.co.mz/',
    color: 'oklch(0.62 0.24 293)',
    // Plate 'light' puts logos designed for white backgrounds on a white tile
    logo: { src: '/projects/mozgate.jpg', width: 600, height: 600, plate: 'light' },
  },
  {
    title: 'MotoTorque',
    description:
      'Storefront for MotoTorque, a Mozambican retailer of premium motorcycle parts and accessories, with mobile checkout through the M‑Pesa API.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'M-Pesa API'],
    href: 'https://moto-torque-react-fork-psi.vercel.app',
    color: 'oklch(0.72 0.14 215)',
    logo: { src: '/projects/mototorque-wide.png', width: 480, height: 129, plate: 'light' },
  },
  {
    title: 'Faithful',
    description: 'Online store for Faithful | Armor of God, a faith-inspired brand.',
    tags: ['React', 'TypeScript', 'Vite', 'React Router'],
    href: 'https://www.faithfuljsv.store/store',
    color: 'oklch(0.68 0.22 354)',
    logo: { src: '/projects/faithful.png', width: 1024, height: 1024, plate: null },
  },
] as const

// Grouped for the Tech Stack section; add anything else you work with
export const stack = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'shadcn/ui'] },
  { group: 'Motion', items: ['GSAP', 'Framer Motion'] },
  { group: 'Backend & payments', items: ['Node.js', 'M-Pesa API'] },
  { group: 'Tooling', items: ['Git', 'GitHub Actions', 'Vercel'] },
] as const
