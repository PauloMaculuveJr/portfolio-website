# Personal Portfolio Website

[![CI](https://github.com/PauloMaculuveJr/portfolio-website/actions/workflows/ci.yml/badge.svg)](https://github.com/PauloMaculuveJr/portfolio-website/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://portfolio-website-nu-sooty-23.vercel.app/)

My personal portfolio site, built to showcase my projects, skills, and experience.

🔗 **Live site:** [portfolio-website-nu-sooty-23.vercel.app](https://portfolio-website-nu-sooty-23.vercel.app/)

## Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Adding UI Components](#adding-ui-components)
- [Roadmap](#roadmap)
- [License](#license)

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) — React framework with built-in routing, SSR/SSG, and image optimization for strong SEO
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [shadcn/ui](https://ui.shadcn.com/) — accessible, customizable UI components
- [Framer Motion](https://motion.dev/) — animations and transitions
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) — linting and formatting

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+

### Installation

```bash
git clone https://github.com/PauloMaculuveJr/portfolio-website.git
cd portfolio-website
npm install
```

### Development

```bash
npm run dev
```

Starts the dev server with hot reload at `http://localhost:3000`.

## Available Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start the local development server |
| `npm run build`  | Build for production               |
| `npm run start`  | Run the production build locally   |
| `npm run lint`   | Lint the codebase with ESLint      |
| `npm run format` | Format the codebase with Prettier  |

## Adding UI Components

This project uses shadcn/ui. To add a new component:

```bash
npx shadcn@latest add <component-name>
```

## Roadmap

The site currently ships as a clean, deployed Next.js scaffold. In progress next:

- [ ] Dark, cinematic visual redesign
- [ ] Scroll-driven storytelling (GSAP + ScrollTrigger + Lenis smooth scroll)
- [ ] Custom cursor and 3D tilt/depth micro-interactions
- [ ] Persistent 3D avatar with cursor-tracking eyes
- [ ] Sections: Hero, About, What I Do, Experience, Projects, Tech Stack, Contact

## License

This project is for personal use. All rights reserved.
