// Contenido oficial de Clínica Alcázar (fuente: https://clinicalcazar.com/).
// No agregar datos que no estén confirmados por la clínica.

const UPLOADS = 'https://clinicalcazar.com/wp-content/uploads'

export const clinic = {
  name: 'Clínica Alcázar',
  legalName: 'Clínica Estética Alcázar',
  logo: `${UPLOADS}/2024/10/logo-historias.png`,
  tagline: 'Nos especializamos en obtener resultados de embellecimiento y rejuvenecimiento natural, utilizando técnicas avaladas internacionalmente.',
  address: 'Calle 3N # 12-87',
  city: 'Armenia, Quindío · Colombia',
  phones: [
    { label: '+57 324 582 6224', href: 'tel:+573245826224' },
    { label: '+57 302 464 6461', href: 'tel:+573024646461' },
  ],
  whatsapp: 'https://wa.me/573042222143',
  instagram: { label: '@clinica.estetica.alcazar', href: 'https://www.instagram.com/clinica.estetica.alcazar/' },
  youtube: 'https://youtu.be/GmRN4Ap0Fms',
}

export function whatsappLink(message: string) {
  return `${clinic.whatsapp}?text=${encodeURIComponent(message)}`
}

// Ruta en Google Maps con Unicentro Armenia como punto de partida.
const ORIGIN = 'Unicentro Armenia, Quindío, Colombia'
const DESTINATION = 'Calle 3N #12-87, Armenia, Quindío, Colombia'
export const map = {
  origin: 'Unicentro Armenia',
  embed: `https://maps.google.com/maps?saddr=${encodeURIComponent(ORIGIN)}&daddr=${encodeURIComponent(DESTINATION)}&output=embed`,
  directions: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(ORIGIN)}&destination=${encodeURIComponent(DESTINATION)}&travelmode=driving`,
}

// Videos de modelos renderizados localmente (fuente: Pexels, licencia libre), con gradación cálida.
export const heroVideos = [
  { id: 'glow', poster: '/media/modelo-glow-poster.jpg', hd: '/media/modelo-glow-1080.mp4', sd: '/media/modelo-glow-720.mp4' },
  { id: 'piel', poster: '/media/modelo-piel-poster.jpg', hd: '/media/modelo-piel-1080.mp4', sd: '/media/modelo-piel-720.mp4' },
  { id: 'ritual', poster: '/media/modelo-ritual-poster.jpg', hd: '/media/modelo-ritual-1080.mp4', sd: '/media/modelo-ritual-720.mp4' },
]

export type Procedure = {
  name: string
  category: string
  summary: string
  video?: string
}

export const procedureGroups: { id: string; title: string; eyebrow: string; description: string; items: Procedure[] }[] = [
  {
    id: 'facial',
    eyebrow: 'Cirugía plástica facial',
    title: 'Rostro',
    description: 'Armonía y proporción para resaltar tus rasgos sin perder tu esencia.',
    items: [
      { name: 'Rinoplastia', category: 'Facial', summary: 'Perfilamos la nariz en equilibrio con el resto del rostro.', video: `${UPLOADS}/2024/11/Rinoplastia.mp4` },
      { name: 'Blefaroplastia', category: 'Facial', summary: 'Una mirada descansada y luminosa, con resultados naturales.', video: `${UPLOADS}/2024/11/Blefaro.mp4` },
      { name: 'Otoplastia', category: 'Facial', summary: 'Corrección de la forma y posición de las orejas.' },
    ],
  },
  {
    id: 'corporal',
    eyebrow: 'Cirugía corporal y reconstructiva',
    title: 'Cuerpo',
    description: 'Contorno, firmeza y proporción con técnicas avaladas internacionalmente.',
    items: [
      { name: 'Lipoabdominoplastia', category: 'Corporal', summary: 'Abdomen firme y definido, ideal después del embarazo.', video: `${UPLOADS}/2024/11/lipoabdominoplastia.mp4` },
      { name: 'Lipoescultura', category: 'Corporal', summary: 'Esculpimos la silueta resaltando tus curvas naturales.', video: `${UPLOADS}/2024/11/Lipoescultura.mp4` },
      { name: 'Mastopexia', category: 'Corporal', summary: 'Levantamiento y redefinición del busto.', video: `${UPLOADS}/2024/11/Mastopexia.mp4` },
    ],
  },
  {
    id: 'no-quirurgico',
    eyebrow: 'Rejuvenecimiento no quirúrgico',
    title: 'Piel',
    description: 'Tratamientos ambulatorios para devolverle vitalidad y calidad a tu piel.',
    items: [
      { name: 'Toxina botulínica', category: 'No quirúrgico', summary: 'Suaviza líneas de expresión conservando la naturalidad del gesto.' },
      { name: 'Rellenos dérmicos', category: 'No quirúrgico', summary: 'Ácido hialurónico, Radiesse y bioestimuladores de colágeno.' },
      { name: 'Peelings y láser', category: 'No quirúrgico', summary: 'Renovación de la piel con técnicas antiedad de última generación.' },
    ],
  },
]

export const transformationVideo = `${UPLOADS}/2024/12/cambio-1_3.mp4`

export type Doctor = {
  name: string
  role: string
  focus: string
  education: string[]
  highlight?: string
  image: string
}

export const doctors: Doctor[] = [
  {
    name: 'Dr. Daniel Correal',
    role: 'Cirujano plástico facial · Otorrinolaringólogo',
    focus: 'Cirugía plástica facial: rinoplastia, blefaroplastia y otoplastia.',
    education: ['Universidad CES', 'Fundación Universitaria San Martín'],
    image: `${UPLOADS}/2024/12/FOTOS-PACIENTES-JOHN-4.png`,
  },
  {
    name: 'Dr. Francisco Daza',
    role: 'Cirujano plástico, estético y reconstructivo',
    focus: 'Contorno corporal, cirugía mamaria y cirugía reconstructiva.',
    education: ['Universidad Militar Nueva Granada', 'Fundación Universitaria Juan N. Corpas'],
    highlight: 'Más de 2.000 procedimientos realizados',
    image: `${UPLOADS}/2024/11/Diseno-sin-titulo-1.jpg`,
  },
  {
    name: 'Dr. César Guardo',
    role: 'Cirujano plástico facial y reconstructivo',
    focus: 'Cirugía facial y reconstructiva, con formación en tratamiento de quemados.',
    education: ['Universidad de Cartagena', 'Universidad de Ciencias Médicas de La Habana'],
    image: `${UPLOADS}/2024/10/1-1.jpg`,
  },
  {
    name: 'Dra. Mayelli Gómez',
    role: 'Medicina antienvejecimiento e integrativa',
    focus: 'Rejuvenecimiento facial no quirúrgico con un enfoque integral.',
    education: ['Medicina antiaging e integrativa'],
    image: `${UPLOADS}/2024/11/1.jpg`,
  },
  {
    name: 'Dra. Luz María Cañavera',
    role: 'Medicina estética y antiaging',
    focus: 'Tratamientos estéticos y antienvejecimiento personalizados.',
    education: ['Corporación Universitaria Rafael Núñez'],
    image: `${UPLOADS}/2024/11/2-e1735607674734.jpg`,
  },
  {
    name: 'Diana Nossa',
    role: 'Nutricionista',
    focus: 'Nutrición clínica y deportiva para acompañar tu proceso y tu recuperación.',
    education: ['Pontificia Universidad Javeriana', 'Universidad del Valle de Guatemala'],
    image: `${UPLOADS}/2024/10/3.jpg`,
  },
]

export const testimonials = [
  {
    name: 'Betsy Buitrago',
    procedure: 'Mamoplastia de aumento',
    quote: 'Ha sido para mí una experiencia increíble. Me siento una mujer mucho más empoderada, mucho más segura.',
    image: `${UPLOADS}/2024/12/beige-elegante-collage-rebaja-publicacion-de-instagram.png`,
  },
  {
    name: 'Angie',
    procedure: 'Lipoabdominoplastia + lipoinyección en glúteos',
    quote: 'Mi nombre es Angie y soy madre, a raíz de mi embarazo mi cuerpo cambió, tenía mucha flacidez y no tenía forma.',
    image: `${UPLOADS}/2024/12/beige-elegante-collage-rebaja-publicacion-de-instagram-1.png`,
  },
  {
    name: 'Diego Ruiz',
    procedure: 'Lipoabdominoplastia + ginecomastia',
    quote: 'Me siento muy agradecido con la clínica, con la calidad humana que hay.',
    image: `${UPLOADS}/2024/12/beige-elegante-collage-rebaja-publicacion-de-instagram-2.png`,
  },
]

export const hyperbaric = {
  image: `${UPLOADS}/2023/08/Imagen-de-WhatsAppddd-2023-08-10-a-las-16.55.09.jpg`,
  benefits: [
    'Acelera la cicatrización después de la cirugía',
    'Reduce la inflamación y los hematomas',
    'Mejora la circulación y la regeneración celular',
    'Aporta oxigenación y vitalidad a la piel, aun sin cirugía',
  ],
}

export const faqs = [
  {
    question: '¿Es normal la inflamación después de la cirugía?',
    answer: 'Sí. Los primeros días puede haber inflamación leve y algo de molestia al respirar; normalmente mejora hacia el tercer día. Recomendamos cumplir todos los cuidados postoperatorios, en especial las sesiones de cámara hiperbárica.',
  },
  {
    question: '¿Cuándo puedo volver a trabajar?',
    answer: 'Por lo general desde el quinto día, si tu trabajo no implica exposición al sol ni esfuerzo físico. Si viajas desde el exterior, sugerimos permanecer unos 15 días para los controles con el especialista.',
  },
  {
    question: '¿Cuándo puedo retomar la actividad física?',
    answer: 'Normalmente alrededor de los 20 días, según la evolución de cada paciente.',
  },
  {
    question: '¿Cuánto dura la recuperación completa?',
    answer: 'Aproximadamente 20 días, según tu proceso de cicatrización y cumpliendo todas las sesiones de cámara hiperbárica.',
  },
  {
    question: '¿Soy candidata para implantes?',
    answer: 'Cada cuerpo es diferente, por eso es fundamental una valoración previa con el especialista para definir la mejor opción para ti. Recomendamos controles anuales de tus implantes.',
  },
  {
    question: '¿En qué consiste el rejuvenecimiento facial no quirúrgico?',
    answer: 'Utilizamos inyectables como toxina botulínica, ácido hialurónico, Radiesse y otros bioestimuladores de colágeno, según el diagnóstico del especialista y buscando la armonía de tu rostro.',
  },
  {
    question: '¿Cuánto duran los resultados de los inyectables?',
    answer: 'Entre 4 y 6 meses aproximadamente, dependiendo de tu actividad física y tipo de piel. Además, estos productos estimulan colágeno y elastina, mejorando la calidad de la piel.',
  },
  {
    question: '¿Los resultados se ven naturales?',
    answer: 'Ese es nuestro enfoque: un rejuvenecimiento y embellecimiento natural, diseñado por el especialista según tus rasgos.',
  },
]

export const navigation = [
  { href: '#filosofia', label: 'Filosofía' },
  { href: '#procedimientos', label: 'Procedimientos' },
  { href: '#especialistas', label: 'Especialistas' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#ubicacion', label: 'Ubicación' },
]
