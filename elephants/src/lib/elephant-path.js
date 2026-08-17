/**
 * One elephant, drawn once. Right-facing profile in a 0–108 × 0–80 box with
 * the feet on y = 76. Shared verbatim by the SVG component and the canvas
 * scene so the herd on the card and the herd in the cards are the same animal.
 *
 * Painted back-to-front as separate solid parts; they union into a single
 * silhouette under any one fill colour.
 */
export const PARTS = {
  legs: 'M19 36 L27 36 L28 76 L20 76 Z M57 36 L65 36 L66 76 L58 76 Z M30 36 L40 36 L40 76 L30 76 Z M68 36 L79 36 L78 76 L68 76 Z',
  tail: 'M13 28 C8 34 7 46 9 58 C11 50 12 36 15 30 Z',
  body: 'M13 32 C11 18 28 11 44 12 C52 12 56 13 60 16 C64 22 66 24 70 22 C72 12 80 7 88 9 C95 11 97 18 96 25 C95 30 92 33 89 34 C86 34 84 33 83 30 C79 35 73 38 66 39 C57 41 47 42 38 42 C26 42 17 39 14 36 Z',
  ear: 'M65 15 C76 9 88 14 88 26 C88 38 80 48 71 46 C64 44 61 34 62 26 C62 19 63 16 65 15 Z',
  tusk: 'M87 40 C95 41 102 47 104 55 C101 49 95 44 86 44 Z',
  trunk:
    'M92 30 C97 36 97 48 95 58 C93.5 66 91 72 88 74 C86 75 84.5 74 85 71.5 C87 69 88 64 88 57 C88.5 47 88 39 85 33 Z',
}

export const ORDER = ['legs', 'tail', 'body', 'ear', 'tusk', 'trunk']

/** Feet-centre of the shape, for translating into a scene. */
export const ANCHOR = { x: 54, y: 76 }
