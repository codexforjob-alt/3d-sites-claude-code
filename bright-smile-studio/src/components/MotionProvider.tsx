'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type MotionState = {
  /** True when the OS asks for reduced motion, or the visitor paused motion here. */
  reduced: boolean
  /** True only when the visitor pressed the pause control. */
  paused: boolean
  togglePaused: () => void
}

const MotionContext = createContext<MotionState>({
  reduced: false,
  paused: false,
  togglePaused: () => {},
})

export function useMotionPref() {
  return useContext(MotionContext)
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setSystemReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Reveal animations are opt-in: without JS the content is simply visible.
  useEffect(() => {
    document.documentElement.classList.add('js-motion')
  }, [])

  const togglePaused = useCallback(() => setPaused((p) => !p), [])

  const value = useMemo(
    () => ({ reduced: systemReduced || paused, paused, togglePaused }),
    [systemReduced, paused, togglePaused],
  )

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  )
}
