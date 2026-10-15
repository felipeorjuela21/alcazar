'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { doctors, whatsappLink } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Eyebrow, Reveal } from './reveal'

const AUTOPLAY_MS = 7000

export function Doctors() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [autoplay, setAutoplay] = useState(false)
  const dragStart = useRef<number | null>(null)
  const doctor = doctors[active]
  const total = doctors.length

  // Sin autoplay cuando el usuario prefiere reducir el movimiento.
  useEffect(() => {
    setAutoplay(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const go = (index: number) => setActive((index + total) % total)
  const next = () => go(active + 1)
  const prev = () => go(active - 1)

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') next()
    if (event.key === 'ArrowLeft') prev()
  }

  function onPointerDown(event: PointerEvent) {
    dragStart.current = event.clientX
  }

  function onPointerUp(event: PointerEvent) {
    if (dragStart.current === null) return
    const delta = event.clientX - dragStart.current
    if (Math.abs(delta) > 50) (delta < 0 ? next : prev)()
    dragStart.current = null
  }

  return (
    <section
      id="especialistas"
      aria-roledescription="carrusel"
      aria-label="Especialistas de Clínica Alcázar"
      className="overflow-hidden bg-espresso py-28 text-ivory lg:py-40"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
          <Reveal>
            <Eyebrow tone="dark">Nuestros especialistas</Eyebrow>
            <h2 className="mt-8 font-serif text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.95] font-light tracking-[-0.02em]">
              Manos expertas,<br />
              <em className="text-champagne">mirada humana.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="flex items-center gap-6">
            <p className="font-serif text-2xl tabular-nums">
              <span className="text-champagne">{String(active + 1).padStart(2, '0')}</span>
              <span className="text-ivory/35"> / {String(total).padStart(2, '0')}</span>
            </p>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Especialista anterior" className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/20 transition-all duration-500 hover:border-champagne hover:bg-champagne hover:text-ink">
                <ArrowLeft size={18} strokeWidth={1.25} />
              </button>
              <button onClick={next} aria-label="Siguiente especialista" className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/20 transition-all duration-500 hover:border-champagne hover:bg-champagne hover:text-ink">
                <ArrowRight size={18} strokeWidth={1.25} />
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-20">
          <div
            className="relative aspect-[4/5] touch-pan-y overflow-hidden bg-ink select-none lg:col-span-6 xl:col-span-5"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (dragStart.current = null)}
          >
            {doctors.map((entry, index) => (
              <img
                key={entry.name}
                src={entry.image}
                alt={index === active ? `${entry.name}, ${entry.role}` : ''}
                draggable={false}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform,clip-path] duration-[1400ms] ease-(--ease-luxe)',
                  index === active ? 'scale-100 opacity-100 [clip-path:inset(0_0_0_0)]' : 'scale-110 opacity-0 [clip-path:inset(0_0_0_100%)]',
                )}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="absolute inset-4 border border-champagne/25" />
          </div>

          <div className="flex flex-col justify-between lg:col-span-6 xl:col-span-7" aria-live="polite">
            <div key={doctor.name}>
              <p className="text-[11px] tracking-[0.3em] text-champagne uppercase animate-in fade-in slide-in-from-bottom-2 duration-700">{doctor.role}</p>
              <h3 className="mt-6 font-serif text-[clamp(2.6rem,5vw,4.75rem)] leading-[0.95] font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 fill-mode-both">{doctor.name}</h3>
              <p className="mt-8 max-w-lg text-[17px] leading-8 font-light text-ivory/70 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-both">{doctor.focus}</p>

              <dl className="mt-10 max-w-lg border-t border-ivory/12 animate-in fade-in duration-1000 delay-300 fill-mode-both">
                <div className="flex gap-6 border-b border-ivory/12 py-5">
                  <dt className="w-28 shrink-0 text-[11px] tracking-[0.24em] text-ivory/45 uppercase">Formación</dt>
                  <dd className="text-sm leading-6 text-ivory/85">{doctor.education.join(' · ')}</dd>
                </div>
                {doctor.highlight && (
                  <div className="flex gap-6 border-b border-ivory/12 py-5">
                    <dt className="w-28 shrink-0 text-[11px] tracking-[0.24em] text-ivory/45 uppercase">Trayectoria</dt>
                    <dd className="text-sm leading-6 text-champagne">{doctor.highlight}</dd>
                  </div>
                )}
              </dl>

              <a
                href={whatsappLink(`Hola, quiero agendar una valoración con ${doctor.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-3 border border-champagne px-8 py-4 text-[11px] tracking-[0.26em] text-champagne uppercase transition-all duration-500 hover:bg-champagne hover:text-ink animate-in fade-in duration-1000 delay-500 fill-mode-both"
              >
                Agendar con {doctor.name.split(' ').slice(0, 2).join(' ')}
                <ArrowUpRight size={15} strokeWidth={1.25} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {doctors.map((entry, index) => (
                <button key={entry.name} onClick={() => go(index)} aria-label={`Ver perfil de ${entry.name}`} aria-current={index === active} className="group text-left">
                  <span className={cn('block h-px overflow-hidden', index === active && !autoplay ? 'bg-champagne' : 'bg-ivory/15')}>
                    {index === active && autoplay && (
                      <span
                        key={active}
                        className="block h-full origin-left bg-champagne animate-progress"
                        style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                        onAnimationEnd={next}
                      />
                    )}
                  </span>
                  <span className="mt-3 block aspect-square overflow-hidden">
                    <img src={entry.image} alt="" loading="lazy" className={cn('h-full w-full object-cover object-top transition-all duration-700', index === active ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale group-hover:opacity-80')} />
                  </span>
                  <span className={cn('mt-3 block truncate text-[11px] tracking-[0.06em] transition-colors', index === active ? 'text-ivory' : 'text-ivory/45')}>{entry.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
