import Reveals from './Reveals'
import Hero from './sections/Hero'
import Philosophy from './sections/Philosophy'
import Notes from './sections/Notes'
import Composition from './sections/Composition'
import Contact from './sections/Contact'

export default function App() {
  return (
    <div id="page" className="relative w-full bg-ink">
      <Reveals />

      <main className="relative z-10">
        <Hero />
        <Philosophy />
        <Notes />
        <Composition />
        <Contact />
      </main>
    </div>
  )
}
