'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { clinic, navigation } from '@/lib/content'
import { cn } from '@/lib/utils'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const solid = scrolled && !open

  return (
    <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-(--ease-luxe)', solid ? 'border-b border-ink/8 bg-ivory/88 py-3 backdrop-blur-xl' : 'py-6')}>
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12" aria-label="Principal">
        <a href="#inicio" className="relative z-10" aria-label={`${clinic.name}, inicio`}>
          <img src={clinic.logo} alt={clinic.name} className={cn('h-9 w-auto object-contain transition-[filter] duration-700 lg:h-10', solid ? 'brightness-0' : 'brightness-0 invert')} />
        </a>

        <ul className={cn('hidden items-center gap-10 text-[13px] tracking-[0.08em] lg:flex', solid ? 'text-ink' : 'text-ivory')}>
          {navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="link-luxe pb-1">{item.label}</a>
            </li>
          ))}
        </ul>

        <div className="relative z-10 flex items-center gap-4">
          <a
            href="#agenda"
            className={cn(
              'hidden items-center gap-2 border px-6 py-3 text-[11px] tracking-[0.24em] uppercase transition-all duration-500 sm:inline-flex',
              solid ? 'border-ink bg-ink text-ivory hover:bg-transparent hover:text-ink' : 'border-ivory/50 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink',
            )}
          >
            Agenda tu valoración <ArrowUpRight size={14} strokeWidth={1.25} />
          </a>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} className={cn('p-2 lg:hidden', open || !solid ? 'text-ivory' : 'text-ink')}>
            {open ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
          </button>
        </div>
      </nav>

      <div className={cn('fixed inset-0 flex flex-col justify-between bg-ink px-6 pt-28 pb-10 text-ivory transition-[opacity,visibility] duration-700 lg:hidden', open ? 'visible opacity-100' : 'invisible opacity-0')}>
        <ul className="space-y-2">
          {navigation.map((item, index) => (
            <li key={item.href} className={cn('transition-all duration-700 ease-(--ease-luxe)', open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')} style={{ transitionDelay: open ? `${120 + index * 70}ms` : '0ms' }}>
              <a href={item.href} onClick={() => setOpen(false)} className="font-serif text-5xl font-light">{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="space-y-3 text-sm text-ivory/60">
          <p>{clinic.address} · {clinic.city}</p>
          <a href="#agenda" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 border border-champagne px-6 py-4 text-[11px] tracking-[0.24em] text-champagne uppercase">
            Agenda tu valoración <ArrowUpRight size={14} strokeWidth={1.25} />
          </a>
        </div>
      </div>
    </header>
  )
}
