'use client'

import { useState } from 'react'
import { ArrowUpRight, Plus, Sparkles } from 'lucide-react'
import { faqs, whatsappLink } from '@/lib/content'
import { cn } from '@/lib/utils'
import { openAssistant } from './assistant'
import { Eyebrow, Reveal } from './reveal'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="preguntas" className="mx-auto max-w-[1440px] px-6 py-28 lg:px-12 lg:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-4">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="mt-8 font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.98] font-light tracking-[-0.02em]">
            Todo lo que <em className="text-bronze">quieres saber.</em>
          </h2>
          <p className="mt-8 max-w-sm text-[15px] leading-7 text-taupe">¿Tienes otra pregunta? Nuestro asistente virtual te responde al instante y puede agendar tu valoración.</p>
          <button onClick={() => openAssistant()} className="group mt-8 inline-flex items-center gap-3 bg-ink px-7 py-4 text-[11px] tracking-[0.24em] text-ivory uppercase transition-colors duration-500 hover:bg-bronze">
            <Sparkles size={14} strokeWidth={1.25} /> Pregúntale al asistente
          </button>
          <br />
          <a href={whatsappLink('Hola, tengo una pregunta sobre un procedimiento.')} target="_blank" rel="noopener noreferrer" className="link-luxe mt-8 inline-flex items-center gap-2 pb-1 text-[11px] tracking-[0.26em] text-bronze uppercase">
            Escríbenos por WhatsApp <ArrowUpRight size={14} strokeWidth={1.25} />
          </a>
        </Reveal>

        <div className="border-t border-ink/12 lg:col-span-8">
          {faqs.map((faq, index) => {
            const isOpen = open === index
            return (
              <Reveal key={faq.question} delay={index * 50} className="border-b border-ink/12">
                <h3>
                  <button onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`faq-${index}`} className="group flex w-full items-center justify-between gap-8 py-7 text-left">
                    <span className={cn('font-serif text-2xl transition-colors duration-500 lg:text-[1.75rem]', isOpen ? 'text-ink' : 'text-ink/70 group-hover:text-ink')}>{faq.question}</span>
                    <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-700 ease-(--ease-luxe)', isOpen ? 'rotate-45 border-bronze bg-bronze text-ivory' : 'border-ink/20 group-hover:border-ink')}>
                      <Plus size={16} strokeWidth={1.25} />
                    </span>
                  </button>
                </h3>
                <div id={`faq-${index}`} className={cn('grid transition-all duration-700 ease-(--ease-luxe)', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                  <p className="overflow-hidden pr-16 text-[15px] leading-7 text-taupe">
                    <span className="block pb-8">{faq.answer}</span>
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
