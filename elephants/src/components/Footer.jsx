export default function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-14 md:px-10">
      <div className="mx-auto flex max-w-[84rem] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl tracking-tight text-bone">MATRIARCH</p>
          <p className="mt-2 max-w-sm text-sm text-ash">
            Seven ranges. Two hundred and nine tracked animals. One very long memory.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {['Field reports', 'Financials', 'Press', 'Contact'].map((l) => (
              <li key={l}>
                <a
                  href="#top"
                  className="eyebrow transition-colors duration-200 hover:text-bone cursor-pointer"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-xs text-dust">
            Fictional organisation, built as a design demonstration. Population figures follow the IUCN
            Red List 2021 assessment.
          </p>
        </div>
      </div>
    </footer>
  )
}
