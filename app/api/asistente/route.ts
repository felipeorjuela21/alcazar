import { ApiError, GoogleGenAI, type Content, type FunctionDeclaration } from '@google/genai'
import { NextResponse } from 'next/server'
import { bookingWhatsapp, buildSystemPrompt, localAnswer, type AssistantReply, type BookingRequest, type ChatTurn } from '@/lib/assistant'
import { doctors, procedureGroups } from '@/lib/content'

const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'
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

function validateBooking(args: Record<string, unknown> | undefined): BookingRequest | string {
  const text = (key: string, max = 160) => (typeof args?.[key] === 'string' ? (args[key] as string).trim().slice(0, max) : '')
  const booking: BookingRequest = {
    nombre: text('nombre', 80),
    telefono: text('telefono', 30),
    procedimiento: text('procedimiento', 80),
    especialista: text('especialista', 80) || undefined,
    fecha_preferida: text('fecha_preferida', 120) || undefined,
    comentarios: text('comentarios', 300) || undefined,
  }
  if (booking.nombre.length < 3) return 'Falta el nombre completo del paciente.'
  if (booking.telefono.replace(/\D/g, '').length < 7) return 'El teléfono no parece válido; pide que lo confirme.'
  if (!booking.procedimiento) return 'Falta el procedimiento de interés.'
  return booking
}

function today() {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'full', timeZone: 'America/Bogota' }).format(new Date())
}

export async function POST(request: Request) {
  const turns = parseTurns(await request.json().catch(() => null))
  if (!turns) return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })

  const lastQuestion = turns[turns.length - 1].text
  const apiKey = process.env.GEMINI_API_KEY
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'

  if (!apiKey || rateLimited(ip)) {
    return NextResponse.json<AssistantReply>({ reply: localAnswer(lastQuestion), fallback: true })
  }

  const ai = new GoogleGenAI({ apiKey })
  const contents: Content[] = turns.map((turn) => ({ role: turn.role === 'user' ? 'user' : 'model', parts: [{ text: turn.text }] }))
  const config = {
    systemInstruction: buildSystemPrompt(today()),
    tools: [{ functionDeclarations: [bookingTool] }],
    temperature: 0.4,
    maxOutputTokens: 1024,
  }

  try {
    let booking: AssistantReply['booking']

    // Como máximo dos rondas: la respuesta inicial y, si registra una cita, la confirmación.
    for (let round = 0; round < 2; round++) {
      const response = await ai.models.generateContent({ model: MODEL, contents, config })
      const call = response.functionCalls?.find((entry) => entry.name === bookingTool.name)

      if (!call || round === 1) {
        const reply = (response.text ?? '').replace(/\*\*/g, '').trim()
        return NextResponse.json<AssistantReply>({ reply: reply || localAnswer(lastQuestion), booking })
      }

      const result = validateBooking(call.args)
      if (typeof result !== 'string') booking = { ...result, whatsapp: bookingWhatsapp(result) }

      // Se devuelve el turno del modelo tal cual (incluye firmas de razonamiento) más el resultado de la función.
      const modelTurn = response.candidates?.[0]?.content
      if (modelTurn) contents.push(modelTurn)
      contents.push({
        role: 'user',
        parts: [{
          functionResponse: {
            id: call.id,
            name: bookingTool.name,
            response: typeof result === 'string'
              ? { ok: false, error: result }
              : { ok: true, mensaje: 'Solicitud lista. El paciente debe enviarla por WhatsApp con el botón que ve en pantalla; el equipo confirmará fecha y hora.' },
          },
        }],
      })
    }
  } catch (error) {
    console.error('[asistente]', error instanceof ApiError ? `${error.status} ${error.message}` : error)
  }

  return NextResponse.json<AssistantReply>({ reply: localAnswer(lastQuestion), fallback: true })
}
