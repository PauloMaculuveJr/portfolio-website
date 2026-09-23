'use client'

import { useRef } from 'react'
import { useMagnetic } from '@/hooks/use-magnetic'
import { cn } from '@/lib/utils'

// Wrap any button or link to make it lean toward the cursor
export function Magnetic({
  children,
  strength,
  className,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useMagnetic(ref, strength)
  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {children}
    </span>
  )
}
