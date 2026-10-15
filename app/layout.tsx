import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const jost = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-jost', display: 'swap' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500'], style: ['normal', 'italic'], variable: '--font-cormorant', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://clinicalcazar.com'),
  title: 'Clínica Alcázar | Cirugía plástica y medicina estética en Armenia, Quindío',
  description: 'Cirugía plástica facial y corporal, rejuvenecimiento no quirúrgico y cámara hiperbárica en Armenia, Quindío. Resultados naturales con técnicas avaladas internacionalmente.',
  openGraph: {
    title: 'Clínica Alcázar',
    description: 'Embellecimiento y rejuvenecimiento natural en Armenia, Quindío.',
    images: ['/media/modelo-glow-poster.jpg'],
    locale: 'es_CO',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#15120f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${jost.variable} ${cormorant.variable}`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
