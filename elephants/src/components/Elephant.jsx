import { ORDER, PARTS } from '../lib/elephant-path'

/** The shared silhouette as SVG. Fills with `currentColor`. */
export default function Elephant({ className = '', flip = false, style, ...rest }) {
  return (
    <svg
      viewBox="4 4 104 74"
      role="presentation"
      aria-hidden="true"
      className={className}
      style={flip ? { ...style, transform: 'scaleX(-1)' } : style}
      {...rest}
    >
      <g fill="currentColor">
        {ORDER.map((k) => (
          <path key={k} d={PARTS[k]} />
        ))}
      </g>
    </svg>
  )
}
