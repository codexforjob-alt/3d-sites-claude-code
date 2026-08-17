/**
 * The signature mark of the site: a single smile curve.
 * It reappears as a headline underline, a section divider and the
 * scroll-drawn path of the treatment timeline.
 */
export function SmileArc({
  className = '',
  strokeWidth = 6,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 240 28"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <path
        d="M3 5C58 26 182 26 237 5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SmileDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden>
      <SmileArc className="h-4 w-28 text-mint" strokeWidth={4} />
    </div>
  )
}
