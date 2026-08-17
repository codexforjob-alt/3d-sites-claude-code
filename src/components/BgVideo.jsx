import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useMediaFlags'

// `autoplay` overrides `preload="metadata"` — the browser starts fetching every
// autoplaying clip on load, which for four 1080p files is tens of megabytes
// before the visitor has scrolled anywhere. So the src is withheld until the
// element is within one viewport of the fold, and playback is released when it
// scrolls away again.
export default function BgVideo({ src, poster, fallbackColor = '#0b0b0c', className = '' }) {
  const reducedMotion = useReducedMotion()
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true)
        const video = videoRef.current
        if (!video) return
        if (entry.isIntersecting) video.play?.().catch(() => {})
        else video.pause?.()
      },
      // A full viewport of lead-in on desktop; much less on phones, where a
      // clip that is merely "coming up" is still megabytes on a mobile plan.
      { rootMargin: window.matchMedia('(pointer: coarse)').matches ? '25% 0px' : '100% 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [reducedMotion])

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 ${className}`}
      style={{ backgroundColor: fallbackColor }}
    >
      {reducedMotion ? (
        poster && <img src={poster} alt="" className="h-full w-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          src={near ? src : undefined}
        />
      )}
    </div>
  )
}
