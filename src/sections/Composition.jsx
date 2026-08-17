import BgVideo from '../components/BgVideo'

const SPECS = [
  ['Concentration', 'Extrait de parfum, 24%'],
  ['Volume', '50 ml'],
  ['Carrier', 'Grain alcohol, water'],
  ['Bottle', 'Glass, brass'],
  ['Batch', 'N° 04 — 900 units'],
  ['Made in', 'Grasse, France'],
]

export default function Composition() {
  return (
    <section
      id="composition"
      className="relative min-h-svh w-full bg-ink px-6 py-28 md:px-16 md:py-40"
    >
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <p className="eyebrow mb-6" data-reveal>
            Composition
          </p>
          <h2 className="text-4xl leading-[1.05] text-cream md:text-6xl" data-reveal>
            What is inside
          </h2>

          <div
            className="relative mt-12 aspect-4/5 w-full overflow-hidden md:mt-16"
            data-reveal
          >
            <BgVideo
              src="/video/ingredients.mp4"
              poster="/video/ingredients.jpg"
              fallbackColor="#4a5240"
            />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-24">
          <dl>
            {SPECS.map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-6 border-b border-cream/12 py-5"
                data-reveal
              >
                <dt className="shrink-0 text-[0.65rem] tracking-[0.28em] text-cream/55 uppercase">
                  {label}
                </dt>
                <dd className="text-right text-base font-light text-cream md:text-lg">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 max-w-[42ch] text-xs font-light leading-relaxed text-cream/60">
            Full ingredient list per EC Regulation 1223/2009 is printed on the carton. Store
            below 25 °C, away from light.
          </p>

          <div className="relative mt-16 aspect-video w-full overflow-hidden" data-reveal>
            <BgVideo
              src="/video/transition.mp4"
              poster="/video/transition.jpg"
              fallbackColor="#8a5a2b"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
