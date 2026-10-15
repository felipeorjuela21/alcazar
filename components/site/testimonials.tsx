'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { testimonials } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Eyebrow, Reveal } from './reveal'

export function Testimonials() {
  const [active, setActive] = useState(0)
  const total = testimonials.length
  const item = testimonials[active]
  const go = (index: number) => setActive((index + total) % total)

  return (
    <section id="testimonios" className="bg-sand py-28 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <Eyebrow>Historias reales</Eyebrow>
        </Reveal>

        <div className="mt-14 grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="relative aspect-square overflow-hidden bg-linen lg:col-span-5">
            {testimonials.map((entry, index) => (
              <img
                key={entry.name}
                src={entry.image}
                alt={index === active ? `Testimonio de ${entry.name}` : ''}
                loading="lazy"
                className={cn('absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-(--ease-luxe)', index === active ? 'scale-100 opacity-100' : 'scale-105 opacity-0')}
              />
            ))}
          </div>

          <div className="lg:col-span-7" aria-live="polite">
            <span className="block font-serif text-8xl leading-none text-bronze/40" aria-hidden="true">“</span>
            <blockquote key={item.name} className="-mt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <p className="font-serif text-[clamp(1.9rem,3.4vw,3.1rem)] leading-[1.18] font-light italic">{item.quote}</p>
              <footer className="mt-10 flex items-center gap-5">
                <span className="h-px w-12 bg-bronze" />
                <span>
                  <span className="block text-sm tracking-[0.12em] uppercase">{item.name}</span>
                  <span className="mt-1 block text-sm text-taupe">{item.procedure}</span>
                </span>
              </footer>
            </blockquote>

            <div className="mt-14 flex items-center gap-6">
              <button onClick={() => go(active - 1)} aria-label="Testimonio anterior" className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 hover:border-ink hover:bg-ink hover:text-ivory">
                <ArrowLeft size={18} strokeWidth={1.25} />
              </button>
              <button onClick={() => go(active + 1)} aria-label="Siguiente testimonio" className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 hover:border-ink hover:bg-ink hover:text-ivory">
                <ArrowRight size={18} strokeWidth={1.25} />
              </button>
              <div className="ml-4 flex gap-2">
                {testimonials.map((entry, index) => (
                  <button key={entry.name} onClick={() => go(index)} aria-label={`Ver testimonio de ${entry.name}`} className="py-3">
                    <span className={cn('block h-px transition-all duration-700 ease-(--ease-luxe)', index === active ? 'w-12 bg-bronze' : 'w-6 bg-ink/25')} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
