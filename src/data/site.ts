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
