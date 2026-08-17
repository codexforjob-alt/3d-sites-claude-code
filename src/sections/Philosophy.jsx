import BgVideo from '../components/BgVideo'

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative flex min-h-svh w-full items-center overflow-hidden"
    >
      <BgVideo src="/video/smoke.mp4" poster="/video/smoke.jpg" fallbackColor="#0b0b0c" />

      {/* Darkens left to right, clearing negative space on the right for text. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,11,12,0.55) 0%, rgba(11,11,12,0.75) 45%, rgba(11,11,12,0.95) 75%, #0b0b0c 100%)',
        }}
      />

      <div className="relative z-10 ml-auto w-full max-w-md px-6 py-24 md:mr-16 md:px-0 md:py-0">
        <p className="eyebrow mb-6" data-reveal>
          Philosophy
        </p>
        <h2 className="text-4xl leading-[1.05] text-cream md:text-5xl" data-reveal>
          Form follows silence
        </h2>
        <div className="mt-8 space-y-4 text-sm font-light leading-relaxed text-cream/70 md:text-base">
          <p data-reveal>We do not add a note unless it is needed.</p>
          <p data-reveal>
            Each composition is made by subtraction. Notes are removed until what remains
            holds on its own: mineral, wood, leather, smoke.
          </p>
          <p data-reveal>The rest is left out.</p>
        </div>
      </div>
    </section>
  )
}
