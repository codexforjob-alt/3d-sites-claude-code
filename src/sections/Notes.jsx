const COLUMNS = [
  {
    tier: 'Top',
    index: '01',
    items: ['Pink pepper', 'Bergamot', 'Wet slate'],
    note: 'First twenty minutes. Cold, sharp.',
  },
  {
    tier: 'Heart',
    index: '02',
    items: ['Cedar', 'Iris', 'Birch tar'],
    note: 'Opens after an hour. Holds four.',
  },
  {
    tier: 'Base',
    index: '03',
    items: ['Ambergris', 'Vetiver', 'Bourbon vanilla'],
    note: 'Stays on skin. Up to twelve hours.',
  },
]

export default function Notes() {
  return (
    <section id="notes" className="relative min-h-svh w-full px-6 py-28 md:px-16 md:py-40">
      <div className="mb-20 md:mb-32">
        <p className="eyebrow mb-6" data-reveal>
          Pyramid
        </p>
        <h2 className="max-w-2xl text-4xl leading-[1.05] text-cream md:text-6xl" data-reveal>
          Notes
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-10">
        {COLUMNS.map((col) => (
          <div key={col.tier} className="border-t border-cream/15 pt-6" data-reveal>
            <div className="mb-8 flex items-baseline justify-between">
              <h3 className="text-xl tracking-[0.2em] text-sand md:text-2xl">{col.tier}</h3>
              <span className="text-[0.65rem] tracking-[0.3em] text-cream/50">{col.index}</span>
            </div>

            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item} className="text-2xl font-light leading-tight text-cream md:text-3xl">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-[22ch] text-xs font-light leading-relaxed text-cream/60">
              {col.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
