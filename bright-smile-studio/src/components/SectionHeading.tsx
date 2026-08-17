export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  tone = 'ink',
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: string
  align?: 'left' | 'center'
  tone?: 'ink' | 'light'
}) {
  const light = tone === 'light'
  return (
    <div
      className={
        align === 'center'
          ? 'mx-auto max-w-2xl text-center'
          : 'max-w-2xl text-left'
      }
    >
      <p data-reveal className={`eyebrow ${light ? '!text-mint' : ''}`}>
        {eyebrow}
      </p>
      <h2
        data-reveal
        className={`h-section mt-4 ${light ? '!text-white' : ''}`}
      >
        {title}
      </h2>
      {lede && (
        <p
          data-reveal
          className={`lede mt-5 ${light ? 'text-white/80' : ''}`}
        >
          {lede}
        </p>
      )}
    </div>
  )
}
