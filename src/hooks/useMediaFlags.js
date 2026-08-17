import { useEffect, useState } from 'react'

// Read synchronously on first render so we never mount WebGL on a phone,
// not even for a single frame before an effect corrects it.
function matches(query) {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(query).matches
}

function useMediaQuery(query) {
  const [value, setValue] = useState(() => matches(query))

  useEffect(() => {
    const mq = window.matchMedia(query)
    setValue(mq.matches)
    const handler = (e) => setValue(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return value
}

export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useIsMobile() {
  // 768px matches the `md:` breakpoint the layout is built on; the coarse
  // pointer test catches phones and tablets that report a wide viewport.
  return useMediaQuery('(max-width: 768px), (pointer: coarse)')
}

