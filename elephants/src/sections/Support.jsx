import { useState } from 'react'
import Elephant from '../components/Elephant'

const TIERS = [
  { amount: 25, label: 'A day of patrol fuel' },
  { amount: 80, label: 'A month of collar telemetry' },
  { amount: 240, label: "A ranger's field kit, resupplied" },
]

export default function Support() {
  const [selected, setSelected] = useState(80)
  const [custom, setCustom] = useState('')
  const [sent, setSent] = useState(false)

  const amount = custom ? Number(custom) : selected
  const valid = Number.isFinite(amount) && amount >= 5

  return (
    <section id="support" className="relative overflow-hidden px-6 py-28 md:px-10 md:py-40">
      <Elephant
        className="pointer-events-none absolute bottom-0 right-4 hidden h-56 w-[30rem] text-loam sm:block md:right-10 md:h-72 md:w-[40rem]"
        preserveAspectRatio="xMaxYMax meet"
      />

      <div className="relative mx-auto max-w-[84rem]">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow mb-4" data-reveal="fade">
              05 — Support
            </p>
            <h2
              className="font-display text-bone"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3.6rem)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
              data-reveal="up"
            >
              Fund a ranger, not a logo
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ash" data-reveal="up">
              Every contribution is assigned to one named unit in one named range, and you get their
              quarterly report — patrol hours, arrests, collar data, and the months where nothing much
              happened.
            </p>
            <p className="mt-4 max-w-md text-sm text-dust" data-reveal="up">
              Demonstration site. No payment is processed and nothing is collected.
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-8" data-reveal="up">
            <form
              className="rounded-lg border border-hairline bg-soil/80 p-8 backdrop-blur-sm"
              onSubmit={(e) => {
                e.preventDefault()
                if (valid) setSent(true)
              }}
            >
              <fieldset className="border-0 p-0">
                <legend className="eyebrow mb-5">Choose an amount</legend>
                <div className="flex flex-col gap-2">
                  {TIERS.map((t) => (
                    <label
                      key={t.amount}
                      className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-md border px-4 transition-colors duration-200 ${
                        !custom && selected === t.amount
                          ? 'border-ochre bg-ochre/10'
                          : 'border-hairline hover:border-ash'
                      }`}
                    >
                      <input
                        type="radio"
                        name="amount"
                        value={t.amount}
                        checked={!custom && selected === t.amount}
                        onChange={() => {
                          setSelected(t.amount)
                          setCustom('')
                        }}
                        className="h-4 w-4 accent-[#d0813f]"
                      />
                      <span className="font-mono text-base text-bone">${t.amount}</span>
                      <span className="text-sm text-ash">{t.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6">
                <label htmlFor="custom" className="mb-2 block text-sm text-bone">
                  Or another amount
                </label>
                <div className="flex items-center gap-2 rounded-md border border-hairline px-4 focus-within:border-ochre">
                  <span className="font-mono text-ash">$</span>
                  <input
                    id="custom"
                    type="number"
                    min="5"
                    step="1"
                    inputMode="numeric"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="120"
                    aria-describedby="custom-help"
                    className="min-h-12 w-full bg-transparent font-mono text-base text-bone outline-none placeholder:text-dust"
                  />
                </div>
                <p id="custom-help" className="mt-2 text-xs text-ash">
                  Minimum $5. Monthly or one-off — you choose on the next step.
                </p>
              </div>

              <button
                type="submit"
                disabled={!valid}
                className="mt-7 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-ochre px-6 text-sm font-medium text-night transition-colors duration-200 hover:bg-bone disabled:cursor-not-allowed disabled:bg-loam disabled:text-dust"
              >
                {sent ? 'Thank you — nothing was charged' : `Continue with $${valid ? amount : '—'}`}
              </button>

              <p role="status" aria-live="polite" className="sr-only">
                {sent ? 'Demonstration only. No payment was taken.' : ''}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
