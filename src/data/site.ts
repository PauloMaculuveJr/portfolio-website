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

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
] as const

// TODO: rewrite in your own voice
export const about =
  "I'm a teenage developer from Mozambique who loves turning ideas into interfaces that feel alive. I started young and haven't stopped building since. I care about the small details: smooth motion, clean code, fast load times, and products that people actually enjoy using."

// TODO: adjust to the work you actually want to be hired for
export const services = [
  {
    title: 'Frontend Development',
    description:
      'Responsive, accessible interfaces built with React, Next.js, and TypeScript that load fast on every device.',
  },
  {
    title: 'Motion & Interaction',
    description:
      'Scroll-driven storytelling and micro-interactions with GSAP and Framer Motion that make a site memorable.',
  },
  {
    title: 'Full-stack Web Apps',
    description:
      'From database to deployment: APIs, auth, and data flows wired into polished product experiences.',
  },
  {
    title: 'Performance & SEO',
    description:
      'Server rendering, image optimization, and clean markup so your site ranks well and feels instant.',
  },
] as const

// TODO: replace every entry with your real roles, studies, or projects
export const experience = [
  {
    period: '20XX – Present',
    role: 'Your current role',
    place: 'Company or organization',
    description: 'One or two lines about what you do there and the impact you have had.',
  },
  {
    period: '20XX – 20XX',
    role: 'A previous role',
    place: 'Company or organization',
    description: 'Highlight a project you shipped, a problem you solved, or a skill you grew.',
  },
  {
    period: '20XX – 20XX',
    role: 'Studies or certification',
    place: 'University, bootcamp, or course',
    description: 'What you studied and anything that stood out.',
  },
] as const

// The first project is real (from GitHub); the rest are TODO placeholders
export const projects = [
  {
    title: 'Portfolio Website',
    description:
      'This site: a dark, cinematic portfolio with scroll-driven animation, smooth scrolling, and a Next.js App Router foundation.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP'],
    href: 'https://github.com/PauloMaculuveJr/portfolio-website',
    color: 'oklch(0.62 0.24 293)',
  },
  {
    title: 'Project Two',
    description: 'TODO: a short description of another project you are proud of.',
    tags: ['React', 'Node.js'],
    href: '',
    color: 'oklch(0.72 0.14 215)',
  },
  {
    title: 'Project Three',
    description: 'TODO: a short description of a third project.',
    tags: ['TypeScript', 'API'],
    href: '',
    color: 'oklch(0.68 0.22 354)',
  },
] as const

// Based on what this repo uses; add anything else you work with
export const stack = [
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'Tailwind CSS',
  'GSAP',
  'Framer Motion',
  'shadcn/ui',
  'Git',
  'GitHub Actions',
  'Vercel',
] as const
