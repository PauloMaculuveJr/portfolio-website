'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Wrap scroll animations in this so users who prefer reduced motion see static content
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

// Pointer effects (cursor, tilt, magnetic) only make sense with a mouse
export const FINE_POINTER = `(pointer: fine) and ${MOTION_OK}`

export { gsap, ScrollTrigger, useGSAP }
