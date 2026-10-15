import { clinic, navigation } from '@/lib/content'
import { InstagramIcon, WhatsappIcon, YoutubeIcon } from './icons'

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-[1440px] px-6 pt-24 pb-10 lg:px-12">
        <div className="grid gap-16 border-b border-ivory/10 pb-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img src={clinic.logo} alt={clinic.name} className="h-11 w-auto brightness-0 invert" loading="lazy" />
            <p className="mt-8 max-w-sm font-serif text-2xl leading-snug font-light text-ivory/80 italic">Embellecimiento y rejuvenecimiento natural en el corazón del Eje Cafetero.</p>
          </div>
          <nav aria-label="Pie de página" className="lg:col-span-3">
            <p className="text-[10px] tracking-[0.3em] text-champagne uppercase">Explora</p>
            <ul className="mt-6 space-y-3 text-sm text-ivory/65">
              {navigation.map((item) => <li key={item.href}><a href={item.href} className="link-luxe hover:text-ivory">{item.label}</a></li>)}
              <li><a href="#agenda" className="link-luxe hover:text-ivory">Agenda tu valoración</a></li>
            </ul>
          </nav>
          <div className="lg:col-span-4">
            <p className="text-[10px] tracking-[0.3em] text-champagne uppercase">Contacto</p>
            <address className="mt-6 space-y-3 text-sm leading-6 text-ivory/65 not-italic">
              <p>{clinic.address}<br />{clinic.city}</p>
              {clinic.phones.map((phone) => <a key={phone.href} href={phone.href} className="link-luxe block w-fit hover:text-ivory">{phone.label}</a>)}
            </address>
            <div className="mt-8 flex gap-3">
              {[
                { href: clinic.instagram.href, label: 'Instagram', icon: <InstagramIcon /> },
                { href: clinic.youtube, label: 'YouTube', icon: <YoutubeIcon /> },
                { href: clinic.whatsapp, label: 'WhatsApp', icon: <WhatsappIcon /> },
              ].map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-all duration-500 hover:border-champagne hover:text-champagne">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-8 text-xs text-ivory/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {clinic.legalName}. Todos los derechos reservados.</p>
          <a href="#inicio" className="link-luxe w-fit hover:text-ivory">Volver arriba ↑</a>
        </div>
      </div>
    </footer>
  )
}
