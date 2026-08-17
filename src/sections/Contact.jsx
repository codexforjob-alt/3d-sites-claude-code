const LINKS = [
  ['Mail', 'atelier@silt.parfum', 'mailto:atelier@silt.parfum'],
  ['Instagram', '@silt.parfum', 'https://instagram.com/silt.parfum'],
  ['Wholesale', 'wholesale@silt.parfum', 'mailto:wholesale@silt.parfum'],
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative flex min-h-svh w-full flex-col justify-between px-6 py-28 md:px-16 md:py-40"
    >
      <div>
        <p className="eyebrow mb-6" data-reveal>
          Contact
        </p>
        <h2 className="max-w-3xl text-4xl leading-[1.05] text-cream md:text-6xl" data-reveal>
          Atelier open{' '}
          <br />
          by appointment
        </h2>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5" data-reveal>
          <p className="text-[0.65rem] tracking-[0.28em] text-cream/55 uppercase">Address</p>
          <address className="mt-4 text-lg font-light not-italic leading-relaxed text-cream md:text-xl">
            12, rue des Fabriques
            <br />
            06130 Grasse
            <br />
            France
          </address>
          <p className="mt-6 text-xs font-light text-cream/60">
            Tuesday — Saturday, 11:00–18:00
          </p>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ul>
            {LINKS.map(([label, value, href]) => (
              <li key={label} className="border-b border-cream/12" data-reveal>
                <a
                  href={href}
                  {...(href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                  className="flex items-baseline justify-between gap-6 py-5 transition-colors duration-300 hover:text-sand focus-visible:text-sand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand"
                >
                  <span className="shrink-0 text-[0.65rem] tracking-[0.28em] text-cream/55 uppercase">
                    {label}
                  </span>
                  <span className="text-right text-base font-light md:text-lg">{value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="mt-24 flex flex-col gap-4 border-t border-cream/12 pt-8 text-[0.65rem] tracking-[0.25em] text-cream/50 uppercase md:flex-row md:items-center md:justify-between">
        <span>SILT — Parfum</span>
        <span>© 2026</span>
      </footer>
    </section>
  )
}
