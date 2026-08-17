'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionPref } from './MotionProvider'

type Props = {
  /** Base file name shared by /videos/<name>.webm, /videos/<name>.mp4 and /posters/<name>.jpg */
  name: string
  className?: string
  /** Load immediately instead of waiting for the section to approach the viewport. */
  eager?: boolean
  /** Extra classes for the <video>/poster layer, e.g. object-position or filters. */
  mediaClassName?: string
}

/**
 * Decorative looping background video.
 *
 * - The poster is a plain <img>, so something is always painted (no CLS, no blank frame).
 * - The <source> elements are only mounted once the section is near the viewport,
 *   so off-screen videos cost zero bytes.
 * - When motion is reduced (OS setting or the pause control) the video never loads
 *   and the poster stands in for it.
 */
export function VideoBackground({
  name,
  className = '',
  eager = false,
  mediaClassName = '',
}: Props) {
  const { reduced } = useMotionPref()
  const holderRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(eager)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (near || !holderRef.current) return
    const el = holderRef.current
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  const active = near && !reduced

  // Pause/resume in step with the motion preference and with visibility.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (!active) {
      v.pause()
      return
    }
    const play = () => {
      void v.play().catch(() => {
        /* autoplay can be blocked — the poster remains visible */
      })
    }
    play()
    const onVisibility = () => (document.hidden ? v.pause() : play())
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [active, ready])

  return (
    <div ref={holderRef} className={`overflow-hidden ${className}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/posters/${name}.jpg`}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${mediaClassName}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          ready && active ? 'opacity-100' : 'opacity-0'
        } ${mediaClassName}`}
        poster={`/posters/${name}.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
      >
        {active && (
          <>
            <source src={`/videos/${name}.webm`} type="video/webm" />
            <source src={`/videos/${name}.mp4`} type="video/mp4" />
          </>
        )}
      </video>
    </div>
  )
}
