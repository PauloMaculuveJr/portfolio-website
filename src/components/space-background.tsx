'use client'

import { useEffect, useRef } from 'react'
import { MOTION_OK } from '@/lib/gsap'

// Deep-space backdrop for dark mode: parallax starfield, slowly spinning particle galaxies,
// a nebula, and the occasional shooting star. Stopped entirely in light mode.

type Rgb = [number, number, number]

const hex = (h: string): Rgb => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb
const mix = (a: Rgb, b: Rgb, t: number): Rgb => a.map((v, i) => v + (b[i] - v) * t) as Rgb
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r | 0},${g | 0},${b | 0},${a})`

// Small deterministic PRNG so the sky is identical on every visit
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type GalaxySpec = {
  seed: number
  arms: number
  twist: number
  particles: number
  core: string
  outer: string
}

// Spiral galaxy rendered once into an offscreen sprite (face-on); tilted and spun at draw time
function makeGalaxy({ seed, arms, twist, particles, core, outer }: GalaxySpec) {
  const size = 512
  const R = size * 0.46
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rand = mulberry32(seed)
  const c0 = hex(core)
  const c1 = hex(outer)
  ctx.translate(size / 2, size / 2)
  ctx.globalCompositeOperation = 'lighter'

  for (let i = 0; i < particles; i++) {
    const r = rand() ** 1.7 * R
    const branch = ((i % arms) / arms) * Math.PI * 2
    const angle = branch + (r / R) * twist
    // Scatter grows toward the rim, biased to the arm's center line
    const spread = (0.08 + (r / R) * 0.35) * R
    const sx = (rand() - 0.5) ** 3 * 8 * spread
    const sy = (rand() - 0.5) ** 3 * 8 * spread
    const x = Math.cos(angle) * r + sx
    const y = Math.sin(angle) * r + sy
    ctx.fillStyle = rgba(mix(c0, c1, Math.min(1, (r / R) * 1.4)), 0.7)
    const s = rand() < 0.04 ? 2.2 : 1.1
    ctx.fillRect(x, y, s, s)
  }

  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.35)
  glow.addColorStop(0, rgba(c0, 0.9))
  glow.addColorStop(0.4, rgba(c0, 0.25))
  glow.addColorStop(1, rgba(c0, 0))
  ctx.fillStyle = glow
  ctx.fillRect(-R, -R, R * 2, R * 2)
  return canvas
}

// Soft ring nebula built from overlapping colored glows
function makeNebula(seed: number) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rand = mulberry32(seed)
  const palette = ['#f59e0b', '#22d3ee', '#a78bfa', '#f472b6'].map(hex)
  ctx.translate(size / 2, size / 2)
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 90; i++) {
    const a = rand() * Math.PI * 2
    const r = size * (0.2 + rand() * 0.12)
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    const blob = size * (0.05 + rand() * 0.08)
    const color = palette[(rand() * palette.length) | 0]
    const g = ctx.createRadialGradient(x, y, 0, x, y, blob)
    g.addColorStop(0, rgba(color, 0.22))
    g.addColorStop(1, rgba(color, 0))
    ctx.fillStyle = g
    ctx.fillRect(x - blob, y - blob, blob * 2, blob * 2)
  }
  return canvas
}

type Body = {
  sprite: HTMLCanvasElement
  x: number // fraction of viewport width
  y: number // position down the page, in viewport heights
  size: number // fraction of viewport width
  depth: number // parallax factor: lower is farther away
  tilt: number
  squash: number
  spin: number
  alpha: number
}

type Star = {
  x: number
  y: number
  r: number
  depth: number
  phase: number
  speed: number
  tint: Rgb
}

export function SpaceBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const root = document.documentElement
    const rand = mulberry32(42)
    const motion = window.matchMedia(MOTION_OK)

    const G = (spec: Partial<GalaxySpec> & { seed: number }) =>
      makeGalaxy({
        arms: 3,
        twist: 5,
        particles: 16000,
        core: '#ffe6c7',
        outer: '#8b5cf6',
        ...spec,
      })

    // Scattered down the page so new galaxies drift into view as you scroll
    const bodies: Body[] = [
      {
        sprite: G({ seed: 1, outer: '#a855f7' }),
        x: 0.55,
        y: 0.28,
        size: 0.52,
        depth: 0.25,
        tilt: -0.08,
        squash: 0.38,
        spin: 0.012,
        alpha: 0.85,
      },
      {
        sprite: makeNebula(7),
        x: 0.4,
        y: 0.1,
        size: 0.22,
        depth: 0.3,
        tilt: 0.3,
        squash: 0.85,
        spin: 0.02,
        alpha: 0.9,
      },
      {
        sprite: G({ seed: 2, arms: 2, twist: 6, outer: '#ec4899' }),
        x: 0.1,
        y: 0.95,
        size: 0.43,
        depth: 0.35,
        tilt: -0.35,
        squash: 0.35,
        spin: -0.015,
        alpha: 0.8,
      },
      {
        sprite: G({ seed: 3, arms: 4, twist: 4, outer: '#22d3ee' }),
        x: 0.85,
        y: 1.6,
        size: 0.41,
        depth: 0.3,
        tilt: 0.4,
        squash: 0.42,
        spin: 0.018,
        alpha: 0.75,
      },
      {
        sprite: G({ seed: 4, outer: '#6366f1', particles: 12000 }),
        x: 0.2,
        y: 2.4,
        size: 0.35,
        depth: 0.28,
        tilt: 0.15,
        squash: 0.55,
        spin: -0.02,
        alpha: 0.75,
      },
      {
        sprite: makeNebula(11),
        x: 0.75,
        y: 3.0,
        size: 0.26,
        depth: 0.32,
        tilt: -0.2,
        squash: 0.8,
        spin: -0.015,
        alpha: 0.8,
      },
      {
        sprite: G({ seed: 5, arms: 2, twist: 7, outer: '#f472b6' }),
        x: 0.65,
        y: 3.7,
        size: 0.46,
        depth: 0.3,
        tilt: -0.3,
        squash: 0.36,
        spin: 0.014,
        alpha: 0.8,
      },
      {
        sprite: G({ seed: 6, arms: 3, outer: '#a78bfa' }),
        x: 0.15,
        y: 4.4,
        size: 0.38,
        depth: 0.3,
        tilt: 0.35,
        squash: 0.45,
        spin: 0.016,
        alpha: 0.75,
      },
    ]

    const tints = ['#ffffff', '#ffffff', '#cfe0ff', '#ffe9c7', '#e9d5ff'].map(hex)
    const stars: Star[] = Array.from({ length: 420 }, (_, i) => {
      const layer = i % 3 // 0 far, 1 mid, 2 near
      return {
        x: rand(),
        y: rand(),
        r: [0.5, 0.8, 1.3][layer] * (0.7 + rand() * 0.6),
        depth: [0.05, 0.12, 0.22][layer],
        phase: rand() * Math.PI * 2,
        speed: 0.6 + rand() * 1.8,
        tint: tints[(rand() * tints.length) | 0],
      }
    })

    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
    }
    resize()

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / w - 0.5
      mouse.ty = e.clientY / h - 0.5
    }

    let meteor: { x: number; y: number; vx: number; vy: number; life: number } | null = null
    let nextMeteor = 3

    let frame = 0
    let last = performance.now()
    let t = 0
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const animate = motion.matches
      if (animate) t += dt
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      const scroll = window.scrollY

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      // Stars: wrap vertically, drift with scroll and mouse by depth, twinkle
      for (const s of stars) {
        const x = (((s.x * w - mouse.x * s.depth * 120) % w) + w) % w
        const y = (((s.y * h - scroll * s.depth - mouse.y * s.depth * 120) % h) + h) % h
        const twinkle = animate ? 0.55 + 0.45 * Math.sin(t * s.speed + s.phase) : 0.8
        ctx.fillStyle = rgba(s.tint, twinkle)
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Galaxies and nebulae, with additive glow
      ctx.globalCompositeOperation = 'lighter'
      for (const b of bodies) {
        const size = b.size * Math.max(w, 900)
        const x = b.x * w - mouse.x * b.depth * 60
        const y = b.y * h - scroll * b.depth - mouse.y * b.depth * 60
        if (y < -size || y > h + size) continue
        ctx.save()
        ctx.globalAlpha = b.alpha
        ctx.translate(x, y)
        ctx.rotate(b.tilt)
        ctx.scale(1, b.squash)
        ctx.rotate(t * b.spin)
        ctx.drawImage(b.sprite, -size / 2, -size / 2, size, size)
        ctx.restore()
      }

      // Shooting star every few seconds
      if (animate) {
        nextMeteor -= dt
        if (!meteor && nextMeteor <= 0) {
          meteor = {
            x: rand() * w * 0.8 + w * 0.2,
            y: rand() * h * 0.4,
            vx: -900,
            vy: 420,
            life: 1,
          }
          nextMeteor = 5 + rand() * 7
        }
        if (meteor) {
          meteor.x += meteor.vx * dt
          meteor.y += meteor.vy * dt
          meteor.life -= dt * 1.1
          const tail = ctx.createLinearGradient(
            meteor.x,
            meteor.y,
            meteor.x - meteor.vx * 0.12,
            meteor.y - meteor.vy * 0.12,
          )
          tail.addColorStop(0, `rgba(255,255,255,${Math.max(0, meteor.life)})`)
          tail.addColorStop(1, 'rgba(167,139,250,0)')
          ctx.strokeStyle = tail
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(meteor.x, meteor.y)
          ctx.lineTo(meteor.x - meteor.vx * 0.12, meteor.y - meteor.vy * 0.12)
          ctx.stroke()
          if (meteor.life <= 0) meteor = null
        }
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    // Only run in dark mode; watch the theme class for switches
    const sync = () => {
      const dark = root.classList.contains('dark')
      if (dark && !frame) {
        last = performance.now()
        frame = requestAnimationFrame(draw)
      } else if (!dark && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    sync()

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden size-full dark:block"
    />
  )
}
