import Elephant from '../components/Elephant'

const HERD = [
  {
    name: 'Nasira',
    role: 'Matriarch',
    range: 'Tsavo East',
    age: 47,
    tone: 'text-ochre',
    note: 'Leads 19 animals along a drought route she last walked as a calf in 1991.',
  },
  {
    name: 'Otieno',
    role: 'Bull',
    range: 'Chobe',
    age: 34,
    tone: 'text-bone',
    note: 'Collared in 2022. Crosses the Botswana–Namibia line roughly every eleven days.',
  },
  {
    name: 'Mbeli',
    role: 'Forest cow',
    range: 'Odzala',
    age: 29,
    tone: 'text-acacia',
    note: 'One of forty-one forest elephants we can still identify by ear notch alone.',
  },
  {
    name: 'Kavi',
    role: 'Matriarch',
    range: 'Nagarhole',
    age: 52,
    tone: 'text-ochre',
    note: 'Her herd taught itself to cross the highway at night. It halved their collisions.',
  },
  {
    name: 'Sefu',
    role: 'Calf',
    range: 'Selous',
    age: 3,
    tone: 'text-bone',
    note: 'Born after the 2023 rains. Will not be independent for another decade.',
  },
  {
    name: 'Amara',
    role: 'Allomother',
    range: 'Dzanga',
    age: 21,
    tone: 'text-acacia',
    note: 'Raises calves that are not hers. Most of the herd does, most of the time.',
  },
]

export default function Herd() {
  return (
    <section id="herd" className="relative px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[84rem]">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4" data-reveal="fade">
            03 — The herd
          </p>
          <h2
            className="font-display text-bone"
            style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
            data-reveal="up"
          >
            Individuals, not a population
          </h2>
        </div>
        <p className="max-w-sm text-sm text-ash" data-reveal="up">
          Every animal under our watch has a name, an ear print, and a file. Six of the two hundred and
          nine currently tracked.
        </p>
      </div>

      <ul className="grid gap-px overflow-hidden rounded-lg bg-hairline sm:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
        {HERD.map((e, i) => (
          <li key={e.name} className="group relative bg-night p-8 transition-colors duration-300 hover:bg-soil">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl text-bone">{e.name}</p>
                <p className="eyebrow mt-1">
                  {e.role} · {e.range}
                </p>
              </div>
              <p className="font-mono text-sm text-ash">
                {e.age}
                <span className="text-dust">y</span>
              </p>
            </div>

            {/* Fixed-height stage, animal drawn to age inside it — so the
                three-year-old calf reads as a calf without ragging the grid. */}
            <div className="mt-8 flex h-36 items-end">
              <Elephant
                className={`w-full opacity-40 transition-opacity duration-300 group-hover:opacity-75 ${e.tone}`}
                style={{ height: `${Math.round(58 + Math.min(e.age, 45) * 1.6)}px` }}
                flip={i % 2 === 1}
                preserveAspectRatio="xMidYMax meet"
              />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ash">{e.note}</p>
          </li>
        ))}
      </ul>
      </div>
    </section>
  )
}
