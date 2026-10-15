'use client'

import { useCallback, useState } from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import { heroVideos, procedureGroups, whatsappLink } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Eyebrow, Reveal } from './reveal'
import { VideoModal } from './video-modal'

// Imagen de respaldo para los procedimientos que no tienen video propio.
const fallbackPoster: Record<string, string> = {
  facial: heroVideos[0].poster,
  corporal: heroVideos[2].poster,
  'no-quirurgico': heroVideos[1].poster,
}

export function Procedures() {
  const [groupIndex, setGroupIndex] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)
  const [modal, setModal] = useState<{ src: string; title: string } | null>(null)

  const closeModal = useCallback(() => setModal(null), [])

  const group = procedureGroups[groupIndex]
  const item = group.items[itemIndex]

  function selectGroup(index: number) {
    setGroupIndex(index)
    setItemIndex(0)
  }

  return (
    <section id="procedimientos" className="bg-sand py-28 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <Reveal>
            <Eyebrow>Procedimientos</Eyebrow>
            <h2 className="mt-8 font-serif text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.95] font-light tracking-[-0.02em]">
              Diseñados para <em className="text-bronze">ti.</em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div role="tablist" aria-label="Categorías de procedimientos" className="flex gap-8 border-b border-ink/15">
              {procedureGroups.map((entry, index) => (
                <button
                  key={entry.id}
                  role="tab"
                  aria-selected={index === groupIndex}
                  onClick={() => selectGroup(index)}
                  className={cn('relative pb-4 font-serif text-2xl transition-colors duration-500 lg:text-3xl', index === groupIndex ? 'text-ink' : 'text-ink/40 hover:text-ink/70')}
                >
                  {entry.title}
                  <span className={cn('absolute inset-x-0 -bottom-px h-px origin-left bg-bronze transition-transform duration-700 ease-(--ease-luxe)', index === groupIndex ? 'scale-x-100' : 'scale-x-0')} />
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p key={group.id} className="text-[11px] tracking-[0.3em] text-bronze uppercase animate-in fade-in duration-700">{group.eyebrow}</p>
            <p key={`${group.id}-d`} className="mt-4 max-w-sm text-[17px] leading-8 font-light text-taupe animate-in fade-in duration-700">{group.description}</p>

            <ul className="mt-12 border-t border-ink/12">
              {group.items.map((entry, index) => (
                <li key={entry.name} className="border-b border-ink/12">
                  <button
                    onClick={() => setItemIndex(index)}
                    onMouseEnter={() => setItemIndex(index)}
                    aria-pressed={index === itemIndex}
                    className="group flex w-full items-start gap-6 py-7 text-left"
                  >
                    <span className={cn('pt-2 text-[11px] tracking-[0.2em] transition-colors duration-500', index === itemIndex ? 'text-bronze' : 'text-ink/35')}>0{index + 1}</span>
                    <span className="flex-1">
                      <span className={cn('block font-serif text-3xl transition-all duration-700 ease-(--ease-luxe) lg:text-4xl', index === itemIndex ? 'translate-x-2 text-ink' : 'text-ink/55 group-hover:text-ink/80')}>{entry.name}</span>
                      <span className={cn('grid transition-all duration-700 ease-(--ease-luxe)', index === itemIndex ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                        <span className="overflow-hidden pl-2 text-sm leading-6 text-taupe">{entry.summary}</span>
                      </span>
                    </span>
                    <ArrowUpRight size={18} strokeWidth={1.25} className={cn('mt-2 transition-all duration-500', index === itemIndex ? 'text-bronze opacity-100' : 'opacity-0')} />
                  </button>
                </li>
              ))}
            </ul>

            <a href={whatsappLink(`Hola, quiero información sobre ${item.name}.`)} target="_blank" rel="noopener noreferrer" className="group mt-12 inline-flex items-center gap-3 bg-ink px-8 py-4 text-[11px] tracking-[0.26em] text-ivory uppercase transition-colors duration-500 hover:bg-bronze">
              Consultar por {item.name} <ArrowUpRight size={15} strokeWidth={1.25} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-linen sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/6]">
              {procedureGroups.flatMap((entry, gIndex) =>
                entry.items.map((media, iIndex) => {
                  const visible = gIndex === groupIndex && iIndex === itemIndex
                  return (
                    <div key={media.name} className={cn('absolute inset-0 transition-all duration-[1200ms] ease-(--ease-luxe)', visible ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0')} aria-hidden={!visible}>
                      {media.video ? (
                        visible && <video src={`${media.video}#t=0.1`} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
                      ) : (
                        <img src={fallbackPoster[entry.id]} alt="" className="h-full w-full object-cover" loading="lazy" />
                      )}
                    </div>
                  )
                }),
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 text-ivory lg:p-10">
                <div key={item.name} className="animate-in fade-in slide-in-from-bottom-3 duration-700">
                  <p className="text-[11px] tracking-[0.3em] text-champagne uppercase">{item.category}</p>
                  <p className="mt-2 font-serif text-4xl font-light italic lg:text-5xl">{item.name}</p>
                </div>
                {item.video && (
                  <button onClick={() => setModal({ src: item.video!, title: item.name })} className="group flex shrink-0 items-center gap-3 text-[11px] tracking-[0.24em] uppercase">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/40 transition-all duration-500 group-hover:border-champagne group-hover:bg-champagne group-hover:text-ink">
                      <Play size={15} strokeWidth={1.25} className="ml-0.5" />
                    </span>
                    <span className="hidden sm:inline">Ver video</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal src={modal?.src ?? null} title={modal?.title ?? ''} onClose={closeModal} />
    </section>
  )
}
