'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

// Aparece con un desvanecido suave la primera vez que entra en pantalla.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} data-visible={visible} className={cn('reveal', className)} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  )
}

export function Eyebrow({ children, tone = 'light', className }: { children: ReactNode; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <p className={cn('flex items-center gap-4 text-[11px] font-normal tracking-[0.32em] uppercase', tone === 'light' ? 'text-bronze' : 'text-champagne', className)}>
      <span className={cn('h-px w-10', tone === 'light' ? 'bg-bronze/60' : 'bg-champagne/60')} />
      {children}
    </p>
  )
}
