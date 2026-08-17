const NOTES = [
  {
    date: '14.04',
    title: 'Infrasound survey, Odzala',
    body: 'Rumbles below the range of human hearing carry for kilometres through forest. We logged 340 calls in six nights and matched 22 to known animals. Cheaper than collars and it never falls off.',
  },
  {
    date: '02.05',
    title: 'Fence line rebuilt, Nagarhole',
    body: 'Four kilometres of beehive fence with the village co-op. Elephants avoid the bees, farmers keep the honey, nobody has to shoot anything. Crop raids on that boundary are down to two this season.',
  },
  {
    date: '27.06',
    title: 'Nasira came back',
    body: 'Nineteen animals, all accounted for, on the old drought route. She had not used it in thirty-one years. The younger cows followed without hesitating, which means she had already told them about it.',
  },
  {
    date: '09.08',
    title: 'Two arrests, Tsavo',
    body: 'Ivory moves the way it always has, through the same three market towns. The ranger unit you fund made the stop. We are not going to pretend this part is elegant.',
  },
]

export default function Notes() {
  return (
    <section
      id="notes"
      className="relative border-y border-hairline bg-soil px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[84rem]">
        <p className="eyebrow mb-4" data-reveal="fade">
          04 — Field notes
        </p>
        <h2
          className="mb-16 font-display text-bone"
          style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
          data-reveal="up"
        >
          What the season actually looked like
        </h2>

        <ol className="grid gap-y-12 md:grid-cols-12">
          {NOTES.map((n) => (
            <li
              key={n.date}
              className="border-t border-hairline pt-6 md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3"
              data-reveal="up"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
                <p className="font-mono text-sm text-ochre sm:w-20 sm:shrink-0">{n.date}</p>
                <div>
                  <h3 className="font-display text-xl text-bone md:text-2xl">{n.title}</h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-ash">{n.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
