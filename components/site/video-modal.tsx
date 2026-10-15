'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

type VideoModalProps = {
  src: string | null
  title: string
  onClose: () => void
}

// Reproductor a pantalla completa para los videos de procedimientos.
export function VideoModal({ src, title, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!src) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [src, onClose])

  if (!src) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}>
      <button onClick={onClose} aria-label="Cerrar video" className="absolute top-5 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-500 hover:border-champagne hover:text-champagne">
        <X size={18} strokeWidth={1.25} />
      </button>
      <div className="w-full max-w-5xl animate-in zoom-in-95 duration-700" onClick={(event) => event.stopPropagation()}>
        <video src={src} controls autoPlay playsInline className="max-h-[80vh] w-full bg-black object-contain" />
        <p className="mt-5 text-center font-serif text-2xl text-ivory italic">{title}</p>
      </div>
    </div>
  )
}
