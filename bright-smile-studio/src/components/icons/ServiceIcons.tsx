import type { ServiceId } from '@/lib/content'

/**
 * Flat 2D line icons drawn on a shared 24×24 grid, 1.5 stroke, round joins.
 * Everything inherits `currentColor` so the cards control the tint.
 */

const TOOTH =
  'M12 3.4c-1.4 0-2.1.7-3.5.7-1.6 0-3.3.5-3.3 3.4 0 2.3.8 3.5 1.3 5.4.5 1.7.6 3.8 1 5.4.3 1.3.9 2 1.7 2 .9 0 1.3-1 1.5-2.5l.4-2.5c.1-.7.4-1 .9-1s.8.3.9 1l.4 2.5c.2 1.5.6 2.5 1.5 2.5.8 0 1.4-.7 1.7-2 .4-1.6.5-3.7 1-5.4.5-1.9 1.3-3.1 1.3-5.4 0-2.9-1.7-3.4-3.3-3.4-1.4 0-2.1-.7-3.5-.7Z'

type IconProps = { className?: string }

function Frame({
  children,
  className = '',
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  )
}

/** Sparkle used by the whitening icon — a four-pointed star. */
function Sparkle({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x} ${y - r}Q${x + r * 0.22} ${y - r * 0.22} ${x + r} ${y}Q${
        x + r * 0.22
      } ${y + r * 0.22} ${x} ${y + r}Q${x - r * 0.22} ${y + r * 0.22} ${
        x - r
      } ${y}Q${x - r * 0.22} ${y - r * 0.22} ${x} ${y - r}Z`}
    />
  )
}

function Whitening({ className }: IconProps) {
  return (
    <Frame className={className}>
      <g transform="translate(-1.1 1.1) scale(0.84)">
        <path d={TOOTH} />
      </g>
      <Sparkle x={19} y={5} r={3.1} />
      <Sparkle x={20.4} y={12.6} r={1.7} />
    </Frame>
  )
}

function Implants({ className }: IconProps) {
  return (
    <Frame className={className}>
      <path d="M6.6 10.2V6.9c0-2.1 1.4-3.4 3.4-3.4 1 0 1.4.4 2 .4s1-.4 2-.4c2 0 3.4 1.3 3.4 3.4v3.3" />
      <path d="M5.8 10.2h12.4" />
      <path d="M12 10.6v10.2" />
      <path d="M9.4 13h5.2M9.9 16h4.2M10.6 19h2.8" />
    </Frame>
  )
}

function Braces({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="2.4" y="5.6" width="5.7" height="9.4" rx="2.2" />
      <rect x="9.2" y="4.8" width="5.7" height="10.2" rx="2.2" />
      <rect x="16" y="5.6" width="5.7" height="9.4" rx="2.2" />
      <path d="M2.4 10.2h19.3" />
      <rect x="3.8" y="8.7" width="2.9" height="2.9" rx="0.8" />
      <rect x="10.6" y="8.5" width="2.9" height="2.9" rx="0.8" />
      <rect x="17.4" y="8.7" width="2.9" height="2.9" rx="0.8" />
      <path d="M4 18.4c4.6 2.4 11.4 2.4 16 0" />
    </Frame>
  )
}

function Hygiene({ className }: IconProps) {
  return (
    <Frame className={className}>
      <rect x="9.3" y="5.4" width="5.4" height="5.9" rx="1.9" />
      <rect x="10.5" y="11.3" width="3" height="9.3" rx="1.4" />
      <path d="M11 7.2v2.3M12 6.8v2.7M13 7.2v2.3" />
      <Sparkle x={19.4} y={5.4} r={2.4} />
    </Frame>
  )
}

function Kids({ className }: IconProps) {
  return (
    <Frame className={className}>
      <path d={TOOTH} />
      <path d="M9.9 9.4h0M14.1 9.4h0" />
      <path d="M10.1 12.2c1.1 1.1 2.7 1.1 3.8 0" />
    </Frame>
  )
}

function Surgery({ className }: IconProps) {
  return (
    <Frame className={className}>
      <g transform="translate(-1.6 1.4) scale(0.82)">
        <path d={TOOTH} />
      </g>
      <path d="M19.4 13.6V5.4" />
      <path d="m16.7 8.1 2.7-2.7 2.7 2.7" />
    </Frame>
  )
}

export const serviceIcons: Record<
  ServiceId,
  (props: IconProps) => React.JSX.Element
> = {
  whitening: Whitening,
  implants: Implants,
  braces: Braces,
  hygiene: Hygiene,
  kids: Kids,
  surgery: Surgery,
}
