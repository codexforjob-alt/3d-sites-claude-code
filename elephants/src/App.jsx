import { useEffect, useRef } from 'react'
import { ScrollTrigger, usePrefersReducedMotion, useReveal, useSmoothScroll } from './lib/motion'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Vitals from './sections/Vitals'
import Herd from './sections/Herd'
import Notes from './sections/Notes'
import Support from './sections/Support'

export default function App() {
  const scope = useRef(null)
  const reduced = usePrefersReducedMotion()

  useSmoothScroll(reduced)
  useReveal(scope, reduced)

  // ScrollTrigger re-asserts scroll position on its own; clearScrollMemory is
  // the only reliable way to land at the top on reload.
  useEffect(() => {
    ScrollTrigger.clearScrollMemory('manual')
    window.scrollTo(0, 0)
  }, [])

  return (
    <div ref={scope} className="grain">
      <a
        href="#manifesto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-[70] focus:rounded-full focus:bg-ochre focus:px-5 focus:py-3 focus:text-sm focus:text-night"
      >
        Skip to content
      </a>

      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Vitals />
        <Herd />
        <Notes />
        <Support />
      </main>
      <Footer />
    </div>
  )
}
