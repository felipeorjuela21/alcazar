import { Assistant } from '@/components/site/assistant'
import { Booking } from '@/components/site/booking'
import { Doctors } from '@/components/site/doctors'
import { Faq } from '@/components/site/faq'
import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { Hero } from '@/components/site/hero'
import { Location } from '@/components/site/location'
import { Philosophy } from '@/components/site/philosophy'
import { Procedures } from '@/components/site/procedures'
import { Recovery } from '@/components/site/recovery'
import { Testimonials } from '@/components/site/testimonials'

export default function Page() {
  return (
    <>
      <Header />
      <main className="overflow-x-clip">
        <Hero />
        <Philosophy />
        <Procedures />
        <Doctors />
        <Recovery />
        <Testimonials />
        <Faq />
        <Booking />
        <Location />
      </main>
      <Footer />
      <Assistant />
    </>
  )
}
