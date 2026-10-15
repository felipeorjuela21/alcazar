import { ArrowUpRight, MapPin, Navigation, Phone } from 'lucide-react'
import { clinic, map } from '@/lib/content'
import { InstagramIcon, WhatsappIcon } from './icons'
import { Eyebrow, Reveal } from './reveal'

export function Location() {
  return (
    <section id="ubicacion" className="bg-ivory py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-6 lg:grid-cols-12 lg:gap-20 lg:px-12">
        <Reveal className="flex flex-col lg:col-span-4">
          <Eyebrow>Visítanos</Eyebrow>
          <h2 className="mt-8 font-serif text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.98] font-light tracking-[-0.02em]">
            Muy cerca de <em className="text-bronze">Unicentro.</em>
          </h2>
          <p className="mt-8 max-w-sm text-[15px] leading-7 text-taupe">
            Te mostramos la ruta desde {map.origin} hasta la clínica, en el norte de Armenia.
          </p>

          <dl className="mt-12 border-t border-ink/12 text-[15px]">
            <div className="flex gap-5 border-b border-ink/12 py-6">
              <dt><MapPin size={18} strokeWidth={1.25} className="mt-0.5 text-bronze" aria-label="Dirección" /></dt>
              <dd>{clinic.address}<span className="block text-taupe">{clinic.city}</span></dd>
            </div>
            <div className="flex gap-5 border-b border-ink/12 py-6">
              <dt><Phone size={18} strokeWidth={1.25} className="mt-0.5 text-bronze" aria-label="Teléfonos" /></dt>
              <dd className="space-y-1">
                {clinic.phones.map((phone) => <a key={phone.href} href={phone.href} className="link-luxe block w-fit">{phone.label}</a>)}
              </dd>
            </div>
            <div className="flex gap-5 border-b border-ink/12 py-6">
              <dt><InstagramIcon className="mt-0.5 text-bronze" /></dt>
              <dd><a href={clinic.instagram.href} target="_blank" rel="noopener noreferrer" className="link-luxe">{clinic.instagram.label}</a></dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href={map.directions} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 bg-ink px-7 py-4 text-[11px] tracking-[0.24em] text-ivory uppercase transition-colors duration-500 hover:bg-bronze">
              <Navigation size={14} strokeWidth={1.25} /> Cómo llegar
            </a>
            <a href={clinic.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border border-ink/25 px-7 py-4 text-[11px] tracking-[0.24em] uppercase transition-colors duration-500 hover:border-ink">
              <WhatsappIcon size={15} /> WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-8">
          <div className="relative h-[480px] overflow-hidden bg-linen lg:h-full lg:min-h-[640px]">
            <iframe
              title={`Ruta desde ${map.origin} hasta ${clinic.name}`}
              src={map.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_sepia(0.22)_contrast(1.05)_brightness(1.02)] transition-[filter] duration-1000 hover:[filter:none]"
            />
            <div className="pointer-events-none absolute inset-4 border border-ink/10" />
            <a href={map.directions} target="_blank" rel="noopener noreferrer" className="group absolute right-6 bottom-6 left-6 flex items-center justify-between gap-6 bg-ivory/95 p-6 shadow-[0_30px_60px_-30px_rgb(21_18_15/0.45)] backdrop-blur-md sm:right-auto sm:w-[360px]">
              <span>
                <span className="block text-[10px] tracking-[0.28em] text-bronze uppercase">Desde {map.origin}</span>
                <span className="mt-2 block font-serif text-2xl">{clinic.name}</span>
                <span className="mt-1 block text-sm text-taupe">{clinic.address}</span>
              </span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-ivory transition-colors duration-500 group-hover:bg-bronze">
                <ArrowUpRight size={16} strokeWidth={1.25} />
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
