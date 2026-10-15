'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { heroVideos, procedureGroups, whatsappLink } from '@/lib/content'
import { Reveal } from './reveal'

const clip = heroVideos[2]
const fieldClass = 'peer w-full border-b border-ivory/25 bg-transparent pt-6 pb-3 text-[15px] text-ivory outline-none transition-colors duration-500 placeholder:text-transparent focus:border-champagne'
const labelClass = 'pointer-events-none absolute top-6 left-0 text-[15px] text-ivory/50 transition-all duration-500 peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.24em] peer-focus:text-champagne peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.24em] peer-[:not(:placeholder-shown)]:uppercase'

export function Booking() {
  const [sent, setSent] = useState(false)
  const video = useRef<HTMLVideoElement>(null)

  // El video de fondo solo se reproduce cuando la sección está en pantalla.
  useEffect(() => {
    const node = video.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? node.play().catch(() => {}) : node.pause()), { threshold: 0.2 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = [
      'Hola, quiero agendar una valoración en Clínica Alcázar.',
      `Nombre: ${data.get('nombre')}`,
      `Teléfono: ${data.get('telefono')}`,
      `Procedimiento de interés: ${data.get('procedimiento')}`,
      data.get('mensaje') ? `Comentarios: ${data.get('mensaje')}` : '',
    ].filter(Boolean).join('\n')
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <section id="agenda" className="relative overflow-hidden bg-ink py-28 text-ivory lg:py-40">
      <video ref={video} className="absolute inset-0 h-full w-full object-cover opacity-45" muted loop playsInline preload="none" poster={clip.poster} aria-hidden="true">
        <source src={clip.sd} type="video/mp4" media="(max-width: 768px)" />
        <source src={clip.hd} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(21_18_15/0.92)_0%,rgb(21_18_15/0.7)_55%,rgb(21_18_15/0.5)_100%)]" />

      <div className="relative mx-auto grid max-w-[1440px] gap-16 px-6 lg:grid-cols-12 lg:gap-20 lg:px-12">
        <Reveal className="lg:col-span-6">
          <p className="flex items-center gap-4 text-[11px] tracking-[0.32em] text-champagne uppercase"><span className="h-px w-10 bg-champagne/60" />El primer paso</p>
          <h2 className="mt-8 font-serif text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.9] font-light tracking-[-0.02em]">
            Hablemos<br /><em className="text-champagne">de ti.</em>
          </h2>
          <p className="mt-10 max-w-md text-[17px] leading-8 font-light text-ivory/70">
            Agenda tu valoración. Conoceremos tus objetivos y diseñaremos contigo el plan que mejor se adapta a ti.
          </p>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-6">
          <form onSubmit={onSubmit} className="border border-ivory/15 bg-ink/40 p-8 backdrop-blur-md lg:p-12">
            <p className="font-serif text-3xl font-light">Agenda tu valoración</p>
            <div className="mt-8 space-y-7">
              <div className="relative">
                <input id="nombre" name="nombre" required autoComplete="name" placeholder="Nombre completo" className={fieldClass} />
                <label htmlFor="nombre" className={labelClass}>Nombre completo</label>
              </div>
              <div className="relative">
                <input id="telefono" name="telefono" type="tel" required autoComplete="tel" placeholder="Teléfono o WhatsApp" className={fieldClass} />
                <label htmlFor="telefono" className={labelClass}>Teléfono o WhatsApp</label>
              </div>
              <div className="relative">
                <label htmlFor="procedimiento" className="block text-[10px] tracking-[0.24em] text-champagne uppercase">Procedimiento de interés</label>
                <select id="procedimiento" name="procedimiento" required defaultValue="" className="mt-2 w-full appearance-none border-b border-ivory/25 bg-transparent pb-3 text-[15px] text-ivory outline-none transition-colors duration-500 focus:border-champagne">
                  <option value="" disabled className="text-ink">Selecciona una opción</option>
                  {procedureGroups.map((group) => (
                    <optgroup key={group.id} label={group.eyebrow} className="text-ink">
                      {group.items.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                    </optgroup>
                  ))}
                  <option value="Valoración general" className="text-ink">Valoración general</option>
                </select>
              </div>
              <div className="relative">
                <textarea id="mensaje" name="mensaje" rows={2} placeholder="Cuéntanos qué te gustaría lograr" className={`${fieldClass} resize-none`} />
                <label htmlFor="mensaje" className={labelClass}>Cuéntanos qué te gustaría lograr (opcional)</label>
              </div>
            </div>
            <button type="submit" className="group mt-10 flex w-full items-center justify-center gap-3 bg-champagne px-8 py-5 text-[11px] tracking-[0.28em] text-ink uppercase transition-colors duration-500 hover:bg-ivory">
              Solicitar valoración <ArrowUpRight size={15} strokeWidth={1.25} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <p className="mt-5 flex items-center gap-2 text-xs text-ivory/50" aria-live="polite">
              <Check size={13} strokeWidth={1.5} className="text-champagne" />
              {sent ? 'Abrimos WhatsApp con tu solicitud. ¡Gracias por confiar en nosotros!' : 'Tus datos se tratan con total confidencialidad.'}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
