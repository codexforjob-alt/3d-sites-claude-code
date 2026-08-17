export default function Manifesto() {
  return (
    <section id="manifesto" className="relative px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[84rem]">
      <p className="eyebrow mb-10" data-reveal="fade">
        01 — Why we are here
      </p>

      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2
            className="font-display text-bone"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.6rem)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
            data-reveal="up"
          >
            A herd is not a group of elephants. It is one animal, distributed.
          </h2>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-ash md:text-xl">
            <p data-reveal="up">
              The oldest female holds the map. She knows which waterhole survived the last drought, which
              ridge the poachers work, which season the marula fruits. Nothing about that knowledge is
              written down. It moves from her to the calves at the speed of a slow walk.
            </p>
            <p data-reveal="up">
              Kill a matriarch and you do not remove one elephant. You delete forty years of directions
              from every animal that followed her. The herd stays alive and stops knowing where to go.
            </p>
            <p data-reveal="up">
              <span className="text-bone">That is the loss we work against.</span> Not extinction as a
              number, but the quiet unravelling of memory across a landscape that stopped being safe to
              cross.
            </p>
          </div>
        </div>

        <aside className="md:col-span-4 md:col-start-9" data-reveal="up">
          <div className="border-l border-hairline pl-6">
            <p className="eyebrow mb-4">Where we work</p>
            <ul className="space-y-3 font-mono text-sm text-ash">
              {[
                ['Tsavo', 'Kenya', 'savanna'],
                ['Selous', 'Tanzania', 'savanna'],
                ['Odzala', 'Rep. of Congo', 'forest'],
                ['Dzanga', 'Central African Rep.', 'forest'],
                ['Chobe', 'Botswana', 'savanna'],
                ['Nagarhole', 'India', 'asian'],
                ['Way Kambas', 'Indonesia', 'asian'],
              ].map(([site, country, kind]) => (
                <li key={site} className="flex items-baseline justify-between gap-3">
                  <span className="text-bone">{site}</span>
                  <span className="flex-1 border-b border-dotted border-hairline" aria-hidden="true" />
                  <span>{country}</span>
                  <span
                    className={
                      kind === 'forest' ? 'text-acacia' : kind === 'asian' ? 'text-ochre' : 'text-dust'
                    }
                    aria-label={`${kind} range`}
                  >
                    ●
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-dust">
              <span>
                <span className="text-dust">●</span> savanna
              </span>
              <span>
                <span className="text-acacia">●</span> forest
              </span>
              <span>
                <span className="text-ochre">●</span> asian
              </span>
            </p>
          </div>
        </aside>
      </div>
      </div>
    </section>
  )
}
