import { procedureGroups } from '@/lib/content'
import { Eyebrow, Reveal } from './reveal'

const pillars = [
  { value: '06', label: 'Especialistas en cirugía plástica, medicina estética y nutrición' },
  { value: '+2.000', label: 'Procedimientos realizados por el Dr. Francisco Daza' },
  { value: 'O₂', label: 'Cámara hiperbárica para una recuperación más rápida' },
]

export function Philosophy() {
  const names = procedureGroups.flatMap((group) => group.items.map((item) => item.name))

  return (
    <>
      <div className="overflow-hidden border-b border-ink/10 bg-ivory py-6" aria-hidden="true">
        <div className="flex w-max animate-marquee">
          {[...names, ...names].map((name, index) => (
            <span key={`${name}-${index}`} className="flex items-center gap-10 pr-10 font-serif text-2xl font-light text-ink/70 italic">
              {name}
              <span className="text-xs text-bronze not-italic">◆</span>
            </span>
          ))}
        </div>
      </div>

      <section id="filosofia" className="mx-auto max-w-[1440px] px-6 py-28 lg:px-12 lg:py-44">
        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>Nuestra filosofía</Eyebrow>
          </Reveal>
          <div className="lg:col-span-8">
            <Reveal>
              <h2 className="font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-[1.02] font-light tracking-[-0.02em]">
                Un equipo de expertos a tu servicio, dedicado a realzar tu belleza <em className="text-bronze">sin perder tu esencia.</em>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-10 max-w-xl text-[17px] leading-8 font-light text-taupe">
                Nos especializamos en resultados de embellecimiento y rejuvenecimiento natural, utilizando técnicas avaladas internacionalmente y un acompañamiento cercano antes, durante y después de cada procedimiento.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-24 grid border-t border-ink/12 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.value} delay={index * 120} className="border-b border-ink/12 py-10 md:border-b-0 md:px-10 md:first:pl-0 md:[&:not(:first-child)]:border-l">
              <p className="font-serif text-6xl font-light text-bronze">{pillar.value}</p>
              <p className="mt-4 max-w-[16rem] text-sm leading-6 text-taupe">{pillar.label}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
