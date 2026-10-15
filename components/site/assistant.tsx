'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, CalendarCheck, Sparkles, X } from 'lucide-react'
import type { AssistantReply, ChatTurn } from '@/lib/assistant'
import { cn } from '@/lib/utils'
import { WhatsappIcon } from './icons'

type Message = ChatTurn & { booking?: AssistantReply['booking'] }

const OPEN_EVENT = 'alcazar:open-assistant'

// Abre el asistente desde cualquier parte del sitio, opcionalmente con una pregunta.
export function openAssistant(question?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: question }))
}

const GREETING: Message = {
  role: 'assistant',
  text: 'Te damos la bienvenida a Clínica Alcázar. Soy tu asistente virtual: puedo resolver tus dudas sobre procedimientos, recuperación y nuestro equipo, o ayudarte a agendar tu valoración.',
}

const SUGGESTIONS = ['Quiero agendar una valoración', '¿Qué procedimientos realizan?', '¿Cuánto dura la recuperación?', '¿Quiénes son los especialistas?']

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLTextAreaElement>(null)
  const pending = useRef<string | null>(null)

  useEffect(() => {
    const onOpen = (event: Event) => {
      setOpen(true)
      const question = (event as CustomEvent<string | undefined>).detail
      if (question) pending.current = question
    }
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => field.current?.focus(), 400)
    if (pending.current) {
      send(pending.current)
      pending.current = null
    }
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const clean = text.trim()
    if (!clean || loading) return
    const history = [...messages, { role: 'user' as const, text: clean }]
    setMessages(history)
    setInput('')
    setLoading(true)
    try {
      const response = await fetch('/api/asistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(1).map(({ role, text }) => ({ role, text })) }),
      })
      if (!response.ok) throw new Error(String(response.status))
      const data = (await response.json()) as AssistantReply
      setMessages((current) => [...current, { role: 'assistant', text: data.reply, booking: data.booking }])
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: 'No pude conectarme en este momento. Puedes escribirnos por WhatsApp y te atendemos personalmente.' }])
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    send(input)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir asistente virtual"
        aria-expanded={open}
        className={cn(
          'group fixed right-5 bottom-5 z-40 flex items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-6 text-ivory shadow-[0_20px_40px_-15px_rgb(21_18_15/0.6)] transition-all duration-700 ease-(--ease-luxe) hover:-translate-y-0.5 lg:right-8 lg:bottom-8',
          open && 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        <span className="text-left">
          <span className="block text-[10px] tracking-[0.26em] text-champagne uppercase">Asistente</span>
          <span className="block font-serif text-lg leading-tight italic">¿Te ayudamos?</span>
        </span>
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-champagne/40 text-champagne">
          <Sparkles size={18} strokeWidth={1.25} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-champagne" />
        </span>
      </button>

      <div className={cn('fixed inset-0 z-[55] bg-ink/30 backdrop-blur-[2px] transition-opacity duration-700', open ? 'opacity-100' : 'pointer-events-none opacity-0')} onClick={() => setOpen(false)} aria-hidden="true" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Asistente virtual de Clínica Alcázar"
        inert={!open}
        className={cn(
          'fixed inset-0 z-[60] flex flex-col bg-ivory transition-transform duration-700 ease-(--ease-luxe) sm:inset-y-4 sm:right-4 sm:left-auto sm:w-[440px] sm:shadow-[0_40px_80px_-30px_rgb(21_18_15/0.5)]',
          open ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]',
        )}
      >
        <header className="flex items-center justify-between bg-ink px-6 py-5 text-ivory">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center border border-champagne/50 font-serif text-2xl text-champagne italic">A</span>
            <div>
              <p className="font-serif text-xl">Asistente Alcázar</p>
              <p className="flex items-center gap-2 text-[10px] tracking-[0.22em] text-ivory/55 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-champagne" /> En línea · Respuesta inmediata
              </p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Cerrar asistente" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 transition-colors duration-500 hover:border-champagne hover:text-champagne">
            <X size={16} strokeWidth={1.25} />
          </button>
        </header>

        <div ref={scroller} className="flex-1 space-y-5 overflow-y-auto px-6 py-7" aria-live="polite">
          {messages.map((message, index) => (
            <div key={index} className={cn('flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500', message.role === 'user' ? 'items-end' : 'items-start')}>
              <p className={cn('max-w-[88%] px-5 py-4 text-[14px] leading-6 whitespace-pre-line', message.role === 'user' ? 'bg-ink text-ivory' : 'border border-ink/10 bg-white/70 text-ink/85')}>
                {message.text}
              </p>
              {message.booking && (
                <div className="mt-3 w-[88%] border border-bronze/40 bg-sand p-5">
                  <p className="flex items-center gap-2 text-[10px] tracking-[0.24em] text-bronze uppercase"><CalendarCheck size={14} strokeWidth={1.25} /> Solicitud de valoración</p>
                  <dl className="mt-4 space-y-2 text-[13px]">
                    {[
                      ['Nombre', message.booking.nombre],
                      ['Teléfono', message.booking.telefono],
                      ['Procedimiento', message.booking.procedimiento],
                      ['Especialista', message.booking.especialista],
                      ['Fecha preferida', message.booking.fecha_preferida],
                    ].filter(([, value]) => value).map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-b border-ink/8 pb-2">
                        <dt className="text-taupe">{label}</dt>
                        <dd className="text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <a href={message.booking.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-2 bg-ink px-5 py-3.5 text-[11px] tracking-[0.22em] text-ivory uppercase transition-colors duration-500 hover:bg-bronze">
                    <WhatsappIcon size={16} /> Enviar y confirmar
                  </a>
                  <p className="mt-3 text-[11px] leading-5 text-taupe">Nuestro equipo te confirmará la fecha y hora disponibles.</p>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-1.5 border border-ink/10 bg-white/70 px-5 py-4 w-fit" aria-label="El asistente está escribiendo">
              {[0, 150, 300].map((delay) => <span key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-bronze/70" style={{ animationDelay: `${delay}ms` }} />)}
            </div>
          )}

          {messages.length === 1 && !loading && (
            <div className="space-y-2 pt-2">
              <p className="text-[10px] tracking-[0.24em] text-taupe uppercase">Sugerencias</p>
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} onClick={() => send(suggestion)} className="block w-full border border-ink/12 px-4 py-3 text-left text-[13px] transition-all duration-500 hover:border-bronze hover:bg-sand">
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="border-t border-ink/10 bg-ivory px-6 pt-4 pb-5">
          <div className="flex items-end gap-3 border-b border-ink/25 pb-2 transition-colors focus-within:border-bronze">
            <textarea
              ref={field}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  send(input)
                }
              }}
              rows={1}
              maxLength={1000}
              placeholder="Escribe tu pregunta…"
              aria-label="Escribe tu pregunta"
              className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-taupe/70"
            />
            <button type="submit" disabled={!input.trim() || loading} aria-label="Enviar" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-ivory transition-all duration-500 hover:bg-bronze disabled:opacity-30">
              <ArrowUp size={16} strokeWidth={1.5} />
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] leading-4 text-taupe/80">Orientación general con IA. No reemplaza una valoración médica.</p>
        </form>
      </aside>
    </>
  )
}
