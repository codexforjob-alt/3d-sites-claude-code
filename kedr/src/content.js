/**
 * Configuration only. All prose lives in index.html so the page is readable
 * and indexable with JavaScript switched off — a marketing page that renders
 * blank without a bundle is not worth selling to anyone.
 *
 * `heat` drives the accent colour (0 = steel, 1 = ember). `reading` and
 * `measures` are the rail readout. Every number below is one a cook in this
 * kitchen would actually say, which is the only reason the rail is allowed on
 * the page: a visitor can derive all of it from the footage and the copy.
 *
 * All of it is invented. See README for the placeholder list.
 */

export const SECTIONS = [
  { id: 'porog', reading: '21°', measures: 'зал', heat: 0.72 },
  { id: 'pech', reading: '480°', measures: 'под печи', heat: 1 },
  { id: 'korka', reading: '4°', measures: 'тесто, 48 ч', heat: 0.78 },
  { id: 'stoika', reading: '2°', measures: 'витрина', heat: 0.34 },
  { id: 'nozh', reading: '−60°', measures: 'тунец', heat: 0 },
  { id: 'menu', reading: '36°', measures: 'шари', heat: 0.85 },
  { id: 'stol', reading: '21°', measures: 'зал', heat: 0.72 },
];

/** Plates that must never be lazy-loaded: they are on screen at first paint. */
export const EAGER_PLATES = ['hero-room'];

export const UI = {
  motionOn: 'Движение',
  motionOff: 'Движение выкл.',
  motionAria: 'Остановить или запустить видео на странице',
};
