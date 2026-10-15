import { hyperbaric } from '@/lib/content'
import { Eyebrow, Reveal } from './reveal'

export function Recovery() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-28 lg:px-12 lg:py-44">
      <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-linen">
            <img src={hyperbaric.image} alt="Cámara hiperbárica de Clínica Alcázar" loading="lazy" className="h-full w-full object-cover sepia-[.12] transition-transform duration-[2000ms] ease-(--ease-luxe) hover:scale-105" />
            <div className="absolute inset-4 border border-ivory/40" />
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Recuperación de excelencia</Eyebrow>
            <h2 className="mt-8 font-serif text-[clamp(2.6rem,5vw,4.75rem)] leading-[0.98] font-light tracking-[-0.02em]">
              Cámara hiperbárica: <em className="text-bronze">oxígeno para sanar mejor.</em>
            </h2>
            <p className="mt-8 max-w-xl text-[17px] leading-8 font-light text-taupe">
              Una herramienta de vanguardia que acelera la recuperación, mejora la circulación y favorece la regeneración celular, tanto después de una cirugía como en tratamientos estéticos.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-2">
            {hyperbaric.benefits.map((benefit, index) => (
              <Reveal key={benefit} delay={index * 100} className="h-full">
                <p className="flex h-full gap-5 bg-ivory py-7 pr-6">
                  <span className="font-serif text-xl text-bronze italic">0{index + 1}</span>
                  <span className="text-[15px] leading-7 text-ink/80">{benefit}</span>
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Reveal className="mt-28 lg:mt-40">
        <div className="relative overflow-hidden bg-ink px-8 py-20 text-center text-ivory lg:px-24 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(205_179_138/0.18),transparent_60%)]" />
          <div className="relative">
            <p className="text-[11px] tracking-[0.32em] text-champagne uppercase">Turismo médico en el Quindío</p>
            <p className="mx-auto mt-8 max-w-4xl font-serif text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[1.15] font-light">
              Excelencia médica en el corazón del <em className="text-champagne">Eje Cafetero</em>, con acompañamiento personalizado antes, durante y después de tu procedimiento.
            </p>
            <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-ivory/60">
              Especialistas certificados, resultados seguros y naturales, y un entorno natural que acompaña tu recuperación.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
