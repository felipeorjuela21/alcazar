import { ApiError, GoogleGenAI, ThinkingLevel, type Content, type FunctionCall, type FunctionDeclaration, type GenerateContentConfig, type GenerateContentResponse, type Part } from '@google/genai'
import { NextResponse } from 'next/server'
import { BOOKING_CONFIRMATION, bookingWhatsapp, buildSystemPrompt, localAnswer, type AssistantEvent, type BookingRequest, type ChatTurn } from '@/lib/assistant'
import { doctors, procedureGroups } from '@/lib/content'

// Flash-Lite con razonamiento mínimo responde en ~1 s; Flash queda como alterno si Lite está saturado.
const MODELS = [...new Set([process.env.GEMINI_MODEL || 'gemini-flash-lite-latest', 'gemini-flash-latest'])]
const REQUEST_TIMEOUT_MS = 12_000 // la API exige al menos 10 s
const MAX_TURNS = 16
const MAX_CHARS = 1200

const bookingTool: FunctionDeclaration = {
  name: 'registrar_solicitud_cita',
  description: 'Registra la solicitud de una cita de valoración cuando el paciente ya dio su nombre, teléfono y procedimiento de interés.',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      nombre: { type: 'string', description: 'Nombre completo del paciente' },
      telefono: { type: 'string', description: 'Teléfono o WhatsApp, con indicativo si lo dio' },
      procedimiento: {
        type: 'string',
        description: `Procedimiento de interés. Opciones habituales: ${procedureGroups.flatMap((group) => group.items.map((item) => item.name)).join(', ')}, Valoración general`,
      },
      especialista: { type: 'string', description: `Especialista preferido, si lo eligió: ${doctors.map((doctor) => doctor.name).join(', ')}` },
      fecha_preferida: { type: 'string', description: 'Fecha y franja preferida en texto, por ejemplo "jueves 23 de octubre en la mañana"' },
      comentarios: { type: 'string', description: 'Notas adicionales del paciente' },
    },
    required: ['nombre', 'telefono', 'procedimiento'],
  },
}

// Límite simple por IP para proteger la cuota gratuita.
const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 30
}

function parseTurns(body: unknown): ChatTurn[] | null {
  const raw = (body as { messages?: unknown })?.messages
  if (!Array.isArray(raw)) return null
  const turns = raw
    .filter((turn): turn is ChatTurn => (turn?.role === 'user' || turn?.role === 'assistant') && typeof turn?.text === 'string')
    .map((turn) => ({ role: turn.role, text: turn.text.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS)
  // La conversación enviada al modelo debe empezar con el paciente.
  while (turns.length && turns[0].role !== 'user') turns.shift()
  return turns.length && turns[turns.length - 1].role === 'user' ? turns : null
}

// Solo se acepta un especialista real que el paciente haya nombrado; se guarda con su nombre oficial.
function matchDoctor(value: string, patientText: string) {
  const normalize = (input: string) => input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const wanted = normalize(value)
  const said = normalize(patientText)
  if (!wanted) return undefined
  return doctors.find((doctor) => {
    const surnames = normalize(doctor.name).replace(/^(dra?\.)\s*/, '').split(' ').slice(1)
    return surnames.some((surname) => surname.length > 3 && wanted.includes(surname) && said.includes(surname))
  })?.name
}

function validateBooking(args: Record<string, unknown> | undefined, patientText: string): BookingRequest | string {
  const text = (key: string, max = 160) => (typeof args?.[key] === 'string' ? (args[key] as string).trim().slice(0, max) : '')
  const booking: BookingRequest = {
    nombre: text('nombre', 80),
    telefono: text('telefono', 30),
    procedimiento: text('procedimiento', 80),
    especialista: matchDoctor(text('especialista', 80), patientText),
    fecha_preferida: text('fecha_preferida', 120) || undefined,
    comentarios: text('comentarios', 300) || undefined,
  }
  if (booking.nombre.length < 3) return 'Falta el nombre completo del paciente.'
  if (booking.telefono.replace(/\D/g, '').length < 7) return 'El teléfono no parece válido; pide que lo confirme.'
  if (!booking.procedimiento) return 'Falta el procedimiento de interés.'
  return booking
}

// Sin reintentos del SDK (esperan hasta un minuto): si un modelo falla por saturación, se pasa al siguiente.
async function openStream(ai: GoogleGenAI, contents: Content[], config: GenerateContentConfig, preferred?: string) {
  const order = preferred ? [preferred, ...MODELS.filter((model) => model !== preferred)] : MODELS
  let lastError: unknown
  for (const model of order) {
    try {
      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          ...config,
          ...(model.includes('lite') && { thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } }),
          httpOptions: { timeout: REQUEST_TIMEOUT_MS, retryOptions: { attempts: 1 } },
        },
      })
      return { stream, model }
    } catch (error) {
      lastError = error
      const retryable = !(error instanceof ApiError) || error.status === 429 || error.status >= 500
      console.warn('[asistente]', model, error instanceof ApiError ? error.status : (error as Error).message)
      if (!retryable) break
    }
  }
  throw lastError
}

// Reenvía el texto al navegador a medida que llega y detecta si el modelo pidió registrar la cita.
async function relay(stream: AsyncGenerator<GenerateContentResponse>, emit: (event: AssistantEvent) => void) {
  const parts: Part[] = []
  let call: FunctionCall | undefined
  let wrote = false
  for await (const chunk of stream) {
    for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
      parts.push(part)
      if (part.functionCall?.name === bookingTool.name) call = part.functionCall
      const text = part.thought ? '' : (part.text ?? '').replace(/\*/g, '')
      if (text) {
        emit({ type: 'text', text })
        wrote = true
      }
    }
  }
  return { parts, call, wrote }
}

function today() {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'full', timeZone: 'America/Bogota' }).format(new Date())
}

const encoder = new TextEncoder()

function eventStream(run: (emit: (event: AssistantEvent) => void) => Promise<void>) {
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      await run((event) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`)))
      controller.close()
    },
  })
  return new Response(body, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-cache, no-transform' } })
}

export async function POST(request: Request) {
  const turns = parseTurns(await request.json().catch(() => null))
  if (!turns) return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })

  const lastQuestion = turns[turns.length - 1].text
  const apiKey = process.env.GEMINI_API_KEY
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'

  if (!apiKey || rateLimited(ip)) {
    return eventStream(async (emit) => emit({ type: 'text', text: localAnswer(lastQuestion) }))
  }

  const ai = new GoogleGenAI({ apiKey })
  const contents: Content[] = turns.map((turn) => ({ role: turn.role === 'user' ? 'user' : 'model', parts: [{ text: turn.text }] }))
  const config: GenerateContentConfig = {
    systemInstruction: buildSystemPrompt(today()),
    tools: [{ functionDeclarations: [bookingTool] }],
    temperature: 0.4,
    maxOutputTokens: 1024,
  }

  return eventStream(async (emit) => {
    let wrote = false
    try {
      const { stream, model } = await openStream(ai, contents, config)
      const round = await relay(stream, emit)
      wrote = round.wrote

      if (round.call) {
        const patientText = turns.filter((turn) => turn.role === 'user').map((turn) => turn.text).join(' ')
        const result = validateBooking(round.call.args, patientText)
        if (typeof result !== 'string') {
          // Cita válida: la confirmación es fija, así se evita una segunda llamada al modelo.
          emit({ type: 'booking', booking: { ...result, whatsapp: bookingWhatsapp(result) } })
          if (!wrote) emit({ type: 'text', text: BOOKING_CONFIRMATION })
          wrote = true
        } else {
          // Datos incompletos: el modelo recibe el error y pide lo que falta, con el mismo modelo
          // porque las firmas de razonamiento son propias de cada uno.
          contents.push(
            { role: 'model', parts: round.parts },
            { role: 'user', parts: [{ functionResponse: { id: round.call.id, name: bookingTool.name, response: { ok: false, error: result } } }] },
          )
          const retry = await openStream(ai, contents, config, model)
          wrote = (await relay(retry.stream, emit)).wrote || wrote
        }
      }
    } catch (error) {
      console.error('[asistente]', error instanceof ApiError ? `${error.status} ${error.message}` : error)
    }
    if (!wrote) emit({ type: 'text', text: localAnswer(lastQuestion) })
  })
}
