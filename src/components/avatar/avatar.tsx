'use client'

import { useEffect, useId, useRef } from 'react'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap'

const SIZE = 440 // rendered size in px; the corner companion is this box scaled down
const INSET = 20
const CORNER_SCALE = 0.45
const ABOUT_SCALE = 1.4 // extra zoom while he works at his desk in the About section
const REACH = 450 // px scale for the head turn (it eases toward full turn, never snaps)
const PUPIL_RANGE = { x: 7.5, y: 3.8 } // how far a pupil can travel inside the eye, in SVG units

// Flat illustration palette
const SKIN = '#6a3d22'
const SHADE = '#522d18'
const HAIR = '#261c2b'
const INK = '#1c1418'

const EYES = [
  { side: 'l', x: 168, y: 188 },
  { side: 'r', x: 232, y: 188 },
] as const

// Afro silhouette: soft tufts around the top of an ellipse, closed by a shape-up hairline
const HAIR_PATH = (() => {
  const cx = 200
  const cy = 150
  const rx = 112
  const ry = 104
  const tufts = 19
  const start = (-25 * Math.PI) / 180
  const end = (205 * Math.PI) / 180
  const at = (theta: number, r: number) =>
    `${(cx + rx * r * Math.cos(theta)).toFixed(1)} ${(cy - ry * r * Math.sin(theta)).toFixed(1)}`

  let d = `M ${at(start, 1)}`
  for (let i = 0; i < tufts; i++) {
    const a = start + ((end - start) * i) / tufts
    const b = start + ((end - start) * (i + 1)) / tufts
    d += ` Q ${at((a + b) / 2, 1.14)} ${at(b, 1)}`
  }
  return `${d} Q 114 200 131 180 Q 134 122 200 122 Q 266 122 269 180 Q 286 200 ${at(start, 1)} Z`
})()

// Persistent companion: sits large beside the Hero title, shrinks into the bottom-right
// corner as you scroll, watches your cursor, and sits down to type during the About section.
export function Avatar() {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const head = useRef<SVGGElement>(null)
  const features = useRef<SVGGElement>(null)
  const hair = useRef<SVGGElement>(null)
  const ears = useRef<SVGGElement>(null)
  const body = useRef<SVGGElement>(null)
  const pupils = useRef<SVGGElement[]>([])
  const eyes = useRef<SVGGElement[]>([])
  const whites = useRef<SVGRectElement[]>([])
  const chair = useRef<SVGGElement>(null)
  const desk = useRef<SVGGElement>(null)
  const lid = useRef<SVGGElement>(null)
  const arms = useRef<SVGGElement>(null)
  const hands = useRef<SVGGElement[]>([])
  const handGroup = useRef<SVGGElement>(null)
  const mug = useRef<SVGGElement>(null)
  const steam = useRef<SVGPathElement>(null)
  const pointer = useRef({ x: 0, y: 0, active: false })
  const working = useRef(false)
  const glancing = useRef(false)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current = { x: e.clientX, y: e.clientY, active: true }
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    const motionOk = () => window.matchMedia(MOTION_OK).matches

    // Desktop: start in the Hero's empty top-right area, travel to the corner while scrolling out
    mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
      const heroX = () => {
        const vw = document.documentElement.clientWidth
        const contentRight = (vw + Math.min(vw, 1152)) / 2 - 24
        return contentRight - SIZE + 90 - (vw - INSET - SIZE)
      }
      const heroY = () => window.innerHeight * 0.05 - (window.innerHeight - INSET - SIZE)

      gsap.fromTo(
        ref.current,
        { x: heroX, y: heroY, scale: 1 },
        {
          x: 0,
          y: 0,
          scale: CORNER_SCALE,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '#top',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    // Smaller screens or reduced motion: live in the corner from the start
    mm.add(`(max-width: 1023px), (prefers-reduced-motion: reduce)`, () => {
      gsap.set(ref.current, { x: 0, y: 0, scale: CORNER_SCALE * 0.8 })
    })

    // --- About section: chair rolls in, desk rises, laptop opens, and he starts typing ---
    // Pivots are set up front: changing svgOrigin mid-tween makes GSAP offset the element
    gsap.set(chair.current, { svgOrigin: '200 400' })
    gsap.set(lid.current, { svgOrigin: '200 360' })
    gsap.set(mug.current, { svgOrigin: '334 362' })
    const scene = gsap
      .timeline({ paused: true, defaults: { ease: 'power3.out' } })
      .to(inner.current, { scale: ABOUT_SCALE, duration: 0.9, ease: 'power2.inOut' }, 0)
      .fromTo(
        chair.current,
        { x: 280, rotation: 10, autoAlpha: 0 },
        { x: 0, rotation: 0, autoAlpha: 1, duration: 0.8 },
        0.1,
      )
      .fromTo(desk.current, { y: 150, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.35)
      .fromTo(
        [arms.current, handGroup.current],
        { y: 70, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5 },
        0.75,
      )
      .fromTo(
        lid.current,
        { scaleY: 0, autoAlpha: 0 },
        {
          scaleY: 1,
          autoAlpha: 1,
          duration: 0.55,
          ease: 'back.out(1.7)',
        },
        0.8,
      )
      .fromTo(
        mug.current,
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)' },
        1.05,
      )

    // Once seated: hands tap at their own rhythms, steam curls off the mug, and he keeps
    // his eyes on the screen with a glance at your cursor every few seconds
    const seated = [
      ...[0.09, 0.12].map((duration, i) =>
        gsap.to(hands.current[i], {
          y: -5,
          duration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          paused: true,
        }),
      ),
      gsap.fromTo(
        steam.current,
        { y: 4, opacity: 0 },
        { y: -8, opacity: 0.45, duration: 1.6, repeat: -1, ease: 'sine.out', paused: true },
      ),
      gsap
        .timeline({ repeat: -1, paused: true })
        .call(() => void (glancing.current = false))
        .call(() => void (glancing.current = true), [], 3.4)
        .call(() => void (glancing.current = false), [], 4.6)
        .to({}, { duration: 0.6 }),
    ]
    scene.eventCallback('onComplete', () => {
      if (motionOk()) seated.forEach((t) => t.play())
    })

    ScrollTrigger.create({
      trigger: '#about',
      start: 'top 55%',
      end: 'bottom 35%',
      onToggle: (self) => {
        working.current = self.isActive
        if (!self.isActive) {
          // pause(0) also rests the hands back on the keyboard
          seated.forEach((t) => t.pause(0))
          glancing.current = false
        }
        if (!motionOk()) scene.progress(self.isActive ? 1 : 0)
        else if (self.isActive) scene.play()
        else scene.reverse()
      },
    })

    // --- Looking around. Cursor-driven, so it stays on even with reduced motion. ---
    gsap.set(head.current, { svgOrigin: '200 300' })
    const to = (target: Element | Element[] | null, prop: string, duration: number) =>
      gsap.quickTo(target, prop, { duration, ease: 'power3' })
    const move = {
      featX: to(features.current, 'x', 0.6),
      featY: to(features.current, 'y', 0.6),
      hairX: to(hair.current, 'x', 0.7),
      earX: to(ears.current, 'x', 0.7),
      tilt: to(head.current, 'rotation', 0.7),
      headX: to(head.current, 'x', 0.7),
      headY: to(head.current, 'y', 0.7),
    }
    const pupilMoves = pupils.current.map((pupil) => ({
      x: to(pupil, 'x', 0.12),
      y: to(pupil, 'y', 0.12),
    }))

    const look = () => {
      const box = inner.current?.getBoundingClientRect()
      if (!box) return

      // Where to look: the laptop while working (with glances at the cursor), otherwise the
      // cursor, or on touch devices a point drifting around the face
      const faceX = box.left + box.width / 2
      const faceY = box.top + box.height * 0.47
      let target: { x: number; y: number } | null = null
      if (working.current && !(glancing.current && pointer.current.active)) {
        const r = lid.current!.getBoundingClientRect()
        target = { x: r.left + r.width / 2, y: r.top + r.height * 0.25 }
      } else if (pointer.current.active) {
        target = pointer.current
      } else if (motionOk()) {
        const t = gsap.ticker.time
        target = { x: faceX + Math.sin(t * 0.5) * 400, y: faceY + Math.sin(t * 0.37) * 200 }
      }
      if (!target) return

      // Head turn: smooth and never saturating, so it keeps responding across the whole page
      const dx = target.x - faceX
      const dy = target.y - faceY
      const nx = dx / Math.sqrt(dx * dx + REACH * REACH)
      const ny = dy / Math.sqrt(dy * dy + REACH * REACH)
      move.featX(nx * 12)
      move.featY(ny * 8)
      move.hairX(nx * 5)
      move.earX(nx * -7)
      move.tilt(nx * 6)
      move.headX(nx * 6)
      move.headY(ny * 4)

      // Pupils: aim each eye from its real on-screen position straight at the target.
      // The direction is exact (not clamped per axis), rotated into the tilted head's frame,
      // and eases toward center as the target gets close to that eye.
      const rot = ((gsap.getProperty(head.current, 'rotation') as number) * Math.PI) / 180
      const cos = Math.cos(rot)
      const sin = Math.sin(rot)
      whites.current.forEach((white, i) => {
        const r = white.getBoundingClientRect()
        const vx = target.x - (r.left + r.width / 2)
        const vy = target.y - (r.top + r.height / 2)
        const dist = Math.hypot(vx, vy)
        if (dist < 0.5) {
          pupilMoves[i].x(0)
          pupilMoves[i].y(0)
          return
        }
        const ux = vx / dist
        const uy = vy / dist
        const lx = ux * cos + uy * sin
        const ly = -ux * sin + uy * cos
        // Travel along the exact direction until the edge of the (elliptical) eye, so a
        // diagonal cursor gives a diagonal gaze instead of one bent toward the long axis
        const edge = 1 / Math.hypot(lx / PUPIL_RANGE.x, ly / PUPIL_RANGE.y)
        // r.width is the eye's on-screen width, so the falloff scales with the avatar size
        const reach = Math.min(1, dist / (r.width * 3))
        pupilMoves[i].x(lx * edge * reach)
        pupilMoves[i].y(ly * edge * reach)
      })
    }
    gsap.ticker.add(look)

    // Blinking and breathing only when motion is welcome
    mm.add(MOTION_OK, () => {
      gsap.set(eyes.current, { transformOrigin: '50% 50%' })
      let next: gsap.core.Tween | undefined
      const blink = () => {
        gsap
          .timeline({
            onComplete: () => void (next = gsap.delayedCall(2.5 + Math.random() * 3.5, blink)),
          })
          .to(eyes.current, { scaleY: 0.1, duration: 0.07, ease: 'power2.in' })
          .to(eyes.current, { scaleY: 1, duration: 0.1, ease: 'power2.out' })
      }
      next = gsap.delayedCall(2, blink)
      gsap.to(body.current, { y: 2.5, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      return () => next?.kill()
    })

    return () => gsap.ticker.remove(look)
  })

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ width: SIZE, height: SIZE, right: INSET, bottom: INSET }}
      className="avatar-shadow pointer-events-none fixed z-40 origin-bottom-right"
    >
      <div
        ref={inner}
        // No backdrop: fade the bottom edge out instead of cutting it off
        style={{ maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)' }}
        className="absolute inset-0 origin-bottom-right"
      >
        <svg viewBox="0 0 400 400" className="size-full">
          <defs>
            {EYES.map(({ side, x, y }) => (
              <clipPath key={side} id={`${id}-eye-${side}`}>
                <path
                  d={`M ${x - 14} ${y} Q ${x} ${y - 15} ${x + 14} ${y} Q ${x} ${y + 12} ${x - 14} ${y} Z`}
                />
              </clipPath>
            ))}
          </defs>

          {/* Desk chair (About section only), behind everything */}
          <g ref={chair}>
            <path
              d="M 90 420 L 90 262 Q 90 222 130 218 L 270 218 Q 310 222 310 262 L 310 420 Z"
              style={{ fill: 'var(--accent-2)' }}
            />
            <rect x="118" y="234" width="164" height="190" rx="22" fill="#000000" opacity="0.14" />
          </g>

          {/* Shirt and neck */}
          <g ref={body}>
            <path d="M 170 262 L 230 262 L 236 330 L 164 330 Z" fill={SKIN} />
            <path d="M 170 262 L 230 262 L 232 292 Q 200 306 168 292 Z" fill={SHADE} />
            <path
              d="M 52 410 C 62 344 116 320 166 312 Q 200 336 234 312 C 284 320 338 344 348 410 Z"
              style={{ fill: 'var(--accent)' }}
            />
            <path
              d="M 166 312 Q 200 340 234 312"
              fill="none"
              style={{ stroke: 'color-mix(in oklch, var(--accent), black 25%)' }}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>

          <g ref={head}>
            <g ref={ears}>
              <ellipse cx="127" cy="194" rx="14" ry="22" fill={SKIN} />
              <ellipse cx="129" cy="195" rx="6" ry="11" fill={SHADE} />
              <ellipse cx="273" cy="194" rx="14" ry="22" fill={SKIN} />
              <ellipse cx="271" cy="195" rx="6" ry="11" fill={SHADE} />
            </g>

            {/* Face with a flat shadow along the jaw */}
            <path
              d="M 130 172 C 130 124 162 100 200 100 C 238 100 270 124 270 172 C 270 228 254 262 228 280 C 214 290 186 290 172 280 C 146 262 130 228 130 172 Z"
              fill={SKIN}
            />
            <path
              d="M 270 172 C 270 228 254 262 228 280 C 216 288 204 290 196 289 C 236 268 258 230 262 176 Z"
              fill={SHADE}
              opacity="0.65"
            />

            <g ref={hair}>
              <path d={HAIR_PATH} fill={HAIR} />
            </g>

            <g ref={features}>
              {/* Eyebrows */}
              <path
                d="M 148 163 Q 167 156 187 160 M 213 160 Q 233 156 252 163"
                fill="none"
                stroke={HAIR}
                strokeWidth="8.5"
                strokeLinecap="round"
              />

              {/* Eyes: white, moving pupil clipped to the eye shape, and an upper lash line */}
              {EYES.map(({ side, x, y }, i) => (
                <g
                  key={side}
                  ref={(el) => {
                    if (el) eyes.current[i] = el
                  }}
                >
                  <g clipPath={`url(#${id}-eye-${side})`}>
                    <rect
                      ref={(el) => {
                        if (el) whites.current[i] = el
                      }}
                      x={x - 15}
                      y={y - 12}
                      width="30"
                      height="24"
                      fill="#f7f1ea"
                    />
                    <g
                      ref={(el) => {
                        if (el) pupils.current[i] = el
                      }}
                    >
                      <circle cx={x} cy={y} r="6.5" fill="#2a1a12" />
                      <circle cx={x + 2} cy={y - 2.2} r="1.8" fill="#ffffff" />
                    </g>
                  </g>
                  <path
                    d={`M ${x - 15} ${y + 1} Q ${x} ${y - 16} ${x + 15} ${y + 1}`}
                    fill="none"
                    stroke={INK}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </g>
              ))}

              {/* Nose: a single flat shadow shape, like the reference style */}
              <path
                d="M 203 196 C 207 208 213 218 211 226 C 207 232 196 232 189 227 C 194 226 200 224 203 219 Z"
                fill={SHADE}
              />

              {/* Lips with a relaxed smile */}
              <path
                d="M 181 248 Q 191 243 200 245 Q 209 243 219 248 Q 200 252 181 248 Z"
                fill="#3f2014"
              />
              <path d="M 183 249 Q 200 262 217 249 Q 200 253 183 249 Z" fill="#552c1c" />

              {/* Round glasses */}
              <g fill="#ffffff" fillOpacity="0.07" stroke={INK} strokeWidth="4.5">
                {EYES.map(({ side, x, y }) => (
                  <circle key={side} cx={x} cy={y} r="24" />
                ))}
              </g>
              <path
                d="M 192 185 Q 200 179 208 185 M 144 183 L 130 179 M 256 183 L 270 179"
                fill="none"
                stroke={INK}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Lens glints */}
              <path
                d="M 154 176 L 160 170 M 218 176 L 224 170"
                stroke="#ffffff"
                strokeOpacity="0.5"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Sleeves reaching forward to the keyboard, tucked behind the desk edge */}
          <g ref={arms}>
            <path
              d="M 72 386 Q 86 362 110 356"
              fill="none"
              style={{ stroke: 'var(--accent)' }}
              strokeWidth="26"
              strokeLinecap="round"
            />
            <path
              d="M 328 386 Q 314 362 290 356"
              fill="none"
              style={{ stroke: 'var(--accent)' }}
              strokeWidth="26"
              strokeLinecap="round"
            />
          </g>

          {/* Desk with the laptop base on top (About section only) */}
          <g ref={desk}>
            <rect x="6" y="366" width="388" height="44" fill="#3a2a22" />
            <rect x="6" y="360" width="388" height="10" rx="3" fill="#5b4033" />
            <rect x="6" y="360" width="388" height="3" rx="1.5" fill="#7a5a48" />
            <rect x="104" y="353" width="192" height="9" rx="3" fill="#a9b0b8" />
          </g>

          {/* Hands resting on the keyboard; they tap while typing */}
          <g ref={handGroup}>
            {[112, 288].map((x, i) => (
              <g
                key={x}
                ref={(el) => {
                  if (el) hands.current[i] = el
                }}
              >
                <ellipse cx={x} cy={352} rx="13" ry="9" fill={SKIN} />
              </g>
            ))}
          </g>

          {/* Back of the laptop lid with a glowing logo */}
          <g ref={lid}>
            <rect x="122" y="312" width="156" height="48" rx="7" fill="#d4d8dd" />
            <rect x="122" y="312" width="156" height="4" rx="2" fill="#eef0f2" />
            <circle cx="200" cy="336" r="14" style={{ fill: 'var(--accent)' }} opacity="0.22" />
            <path
              d="M 193 330 L 187 336 L 193 342 M 207 330 L 213 336 L 207 342"
              fill="none"
              style={{ stroke: 'var(--accent)' }}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Coffee mug with steam */}
          <g ref={mug}>
            <path
              ref={steam}
              d="M 334 338 q -5 -7 0 -14 q 5 -7 0 -14"
              fill="none"
              style={{ stroke: 'var(--muted-foreground)' }}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0"
            />
            <rect
              x="322"
              y="340"
              width="24"
              height="22"
              rx="4"
              style={{ fill: 'var(--foreground)' }}
            />
            <path
              d="M 346 344 q 9 0 9 7 q 0 7 -9 7"
              fill="none"
              style={{ stroke: 'var(--foreground)' }}
              strokeWidth="4"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
