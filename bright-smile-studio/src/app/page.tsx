import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { WhyUs } from '@/components/WhyUs'
import { ClinicAmbience } from '@/components/ClinicAmbience'
import { Process } from '@/components/Process'
import { Testimonials } from '@/components/Testimonials'
import { BookingForm } from '@/components/BookingForm'
import { Footer } from '@/components/Footer'
import { ScrollReveal } from '@/components/ScrollReveal'

export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <WhyUs />
        <ClinicAmbience />
        <Process />
        <Testimonials />
        <BookingForm />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  )
}
