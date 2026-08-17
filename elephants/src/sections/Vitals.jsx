import { useRef } from 'react'
import { useCountUp } from '../lib/motion'

function Stat({ value, decimals = 0, suffix = '', unit, label, note }) {
  const ref = useRef(null)
  useCountUp(ref, value, { decimals, suffix })

  return (
    <div className="border-t border-hairline pt-6">
      <p
        className="font-display text-bone"
        style={{ fontSize: 'clamp(2.75rem, 6vw, 4.75rem)', lineHeight: 1, letterSpacing: '-0.03em' }}
      >
        <span ref={ref}>0</span>
        {unit && <span className="text-[0.62em] text-ochre">{unit}</span>}
      </p>
      <p className="mt-3 text-base text-bone">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-ash">{note}</p>
    </div>
  )
}

export default function Vitals() {
  return (
    <section
      id="vitals"
      className="relative border-y border-hairline bg-soil px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[84rem]">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4" data-reveal="fade">
              02 — Vitals
            </p>
            <h2
              className="font-display text-bone"
              style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
              data-reveal="up"
            >
              The shape of the decline
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ash" data-reveal="up">
            Figures below follow the IUCN Red List assessment that split Africa&apos;s elephants into two
            species in 2021.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
          <Stat
            value={86}
            unit="%"
            label="Forest elephants lost"
            note="African forest elephant, over 31 years. Listed Critically Endangered."
          />
          <Stat
            value={60}
            unit="%"
            label="Savanna elephants lost"
            note="African savanna elephant, over 50 years. Listed Endangered."
          />
          <Stat
            value={415000}
            label="Left across Africa"
            note="Best available continental estimate for both African species combined."
          />
          <Stat
            value={22}
            unit=" mo"
            label="Gestation"
            note="The longest of any land mammal. A herd cannot replace losses quickly."
          />
        </div>
      </div>
    </section>
  )
}
