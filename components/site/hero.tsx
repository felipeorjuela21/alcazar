'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { clinic, heroVideos } from '@/lib/content'
import { cn } from '@/lib/utils'

const TITLE = ['El arte de', 'la belleza', 'natural.']

export function Hero() {
  const [active, setActive] = useState(0)
  const [quality, setQuality] = useState<'hd' | 'sd' | null>(null)
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const videos = useRef<(HTMLVideoElement | null)[]>([])

  // Elige la resolución según la pantalla; respeta "reducir movimiento".
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPlaying(false)
    }
    setQuality(window.matchMedia('(max-width: 768px)').matches ? 'sd' : 'hd')
  }, [])

  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (!video) return
      if (index === active && playing) {
        video.play().catch(() => setPlaying(false))
      } else if (index === active) {
        video.pause()
      }
    })
  }, [active, playing, quality])

  function handleEnded(index: number) {
    if (index !== active) return
    const next = (active + 1) % heroVideos.length
    const nextVideo = videos.current[next]
    if (nextVideo) nextVideo.currentTime = 0
    setProgress(0)
    setActive(next)
  }

  function goTo(index: number) {
    const video = videos.current[index]
    if (video) video.currentTime = 0
    setProgress(0)
    setActive(index)
  }

  return (
    <section id="inicio" className="relative flex min-h-[max(100svh,640px)] items-end overflow-hidden bg-ink text-ivory">
      <div className="grain absolute inset-0">
        {heroVideos.map((clip, index) => (
          <div key={clip.id} className={cn('absolute inset-0 transition-opacity duration-[1800ms] ease-(--ease-luxe)', index === active ? 'opacity-100' : 'opacity-0')} aria-hidden={index !== active}>
            <img src={clip.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {quality && (
              <video
                ref={(node) => { videos.current[index] = node }}
                className={cn('absolute inset-0 h-full w-full object-cover', index === active && 'animate-kenburns')}
                muted
                playsInline
                preload={index === active || index === (active + 1) % heroVideos.length ? 'auto' : 'metadata'}
                poster={clip.poster}
                onEnded={() => handleEnded(index)}
                onTimeUpdate={(event) => index === active && setProgress(event.currentTarget.currentTime / (event.currentTarget.duration || 1))}
              >
                <source src={quality === 'hd' ? clip.hd : clip.sd} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(21_18_15/0.82)_0%,rgb(21_18_15/0.55)_38%,rgb(21_18_15/0.08)_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-6 pt-40 pb-14 lg:px-12 lg:pb-20">
        <p className="mb-8 text-[11px] tracking-[0.36em] text-champagne uppercase animate-in fade-in duration-1000">
          Clínica estética · Armenia, Quindío
        </p>
        <h1 className="font-serif text-[clamp(3.4rem,9vw,8.75rem)] leading-[0.9] font-light tracking-[-0.025em]">
          {TITLE.map((line, index) => (
            <span key={line} className="line-mask">
              <span style={{ '--line-delay': `${200 + index * 140}ms` } as CSSProperties} className={cn(index === 2 && 'text-champagne italic')}>{line}</span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
            <p className="text-[15px] leading-7 font-light text-ivory/80">{clinic.tagline}</p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <a href="#agenda" className="group inline-flex items-center gap-3 bg-ivory px-8 py-4 text-[11px] tracking-[0.26em] text-ink uppercase transition-colors duration-500 hover:bg-champagne">
                Agenda tu valoración
                <ArrowUpRight size={15} strokeWidth={1.25} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="#procedimientos" className="link-luxe pb-1 text-[11px] tracking-[0.26em] uppercase">Ver procedimientos</a>
            </div>
          </div>

          <div className="flex items-center gap-6 animate-in fade-in duration-1000 delay-1000 fill-mode-both lg:pr-64">
            <button onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pausar video' : 'Reproducir video'} className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/30 transition-colors duration-500 hover:border-champagne hover:text-champagne">
              {playing ? <Pause size={14} strokeWidth={1.25} /> : <Play size={14} strokeWidth={1.25} />}
            </button>
            <div className="flex gap-3">
              {heroVideos.map((clip, index) => (
                <button key={clip.id} onClick={() => goTo(index)} aria-label={`Ver video ${index + 1}`} aria-current={index === active} className="group py-3">
                  <span className="block h-px w-14 overflow-hidden bg-ivory/25 lg:w-20">
                    <span className="block h-full origin-left bg-champagne transition-transform duration-300 ease-linear" style={{ transform: `scaleX(${index === active ? progress : index < active ? 1 : 0})` }} />
                  </span>
                  <span className={cn('mt-3 block text-left text-[10px] tracking-[0.2em] transition-colors', index === active ? 'text-ivory' : 'text-ivory/40 group-hover:text-ivory/70')}>0{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <a href="#filosofia" aria-label="Desplazarse hacia abajo" className="absolute bottom-0 left-1/2 hidden h-16 w-px -translate-x-1/2 overflow-hidden lg:block">
        <span className="block h-full w-full bg-champagne/80 animate-scroll-cue" />
      </a>
    </section>
  )
}
