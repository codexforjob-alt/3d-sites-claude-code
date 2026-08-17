import BgVideo from '../components/BgVideo'
import { useIsMobile } from '../hooks/useMediaFlags'

export default function Hero() {
  // The hero clip is in view from the first paint, so on phones it would be a
  // ~9 MB download before anything else. They get the poster frame instead.
  const isMobile = useIsMobile()

  return (
    <section id="hero" className="relative flex h-svh w-full items-end overflow-hidden">
      <div data-parallax className="absolute inset-0 will-change-transform">
        {isMobile ? (
          <img
            src="/video/hero.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <BgVideo src="/video/hero.mp4" poster="/video/hero.jpg" fallbackColor="#0b0b0c" />
        )}
      </div>

      {/* Keeps the type legible and lets the frame fall away into the page. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(11,11,12,0.72) 0%, rgba(11,11,12,0.55) 35%, rgba(11,11,12,0.88) 78%, #0b0b0c 100%)',
        }}
      />

      <div className="relative z-10 w-full px-6 pb-16 md:px-16 md:pb-24">
        <p className="eyebrow mb-6">Perfume house — Grasse</p>
        <h1 className="text-[26vw] leading-[0.82] tracking-[0.06em] text-cream md:text-[15vw]">
          SILT
        </h1>
        <p className="mt-8 max-w-xs text-sm font-light leading-relaxed text-cream/60 md:text-base">
          Five compositions. One voice. Nothing added.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[0.6rem] tracking-[0.4em] text-cream/55 md:bottom-10">
        SCROLL
      </div>
    </section>
  )
}
