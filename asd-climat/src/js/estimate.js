/**
 * The estimator.
 *
 * Not a quote — a range. On a commercial job the real number depends on ceiling
 * heights, riser routes and whatever the previous tenant left behind, so this
 * gives the order of magnitude and says so. What it must not do is disagree
 * with the ledger tables above it: every figure here is the same one printed
 * in the VRF and ventilation tables, so change them together.
 *
 * The object-type question is not decorative. It moves the ventilation line
 * only — a restaurant needs far more air changes per hour than an office of
 * the same floor area, and that is the single biggest swing in the estimate.
 */

import { isDemo } from './demo.js';

const PHONE = '77788242222';

const PRICES = {
  // floor area (m²) → the VRF row it lands on
  vrf: {
    150:  { outdoor: '12 кВт',  units: 6,  sum: 4900000 },
    300:  { outdoor: '22 кВт',  units: 10, sum: 8600000 },
    600:  { outdoor: '45 кВт',  units: 20, sum: 16400000 },
    1000: { outdoor: '73 кВт',  units: 32, sum: 26800000 },
    1800: { outdoor: '130 кВт', units: 56, sum: 46500000 },
  },
  // surcharge per indoor unit; wall-mounted is what the table price includes
  unit: { wall: 0, cassette: 85000, duct: 110000, floor: 95000 },
  // air handling unit sized off the same area bands
  vent: {
    150:  { flow: '1 000 м³/ч', sum: 3200000 },
    300:  { flow: '2 000 м³/ч', sum: 5400000 },
    600:  { flow: '3 500 м³/ч', sum: 8900000 },
    1000: { flow: '5 000 м³/ч', sum: 12600000 },
    1800: { flow: '9 000 м³/ч', sum: 21400000 },
  },
  // air changes drive the ventilation line, and they are not the same per trade
  kind: {
    office: { label: 'офис',          vent: 1 },
    retail: { label: 'магазин',       vent: 1 },
    food:   { label: 'ресторан',      vent: 1.25 },
    med:    { label: 'медцентр',      vent: 1.15 },
  },
  designPerM2: 1200,
  designMin: 250000,
};

const UNIT_LABEL = {
  wall: 'настенные',
  cassette: 'кассетные',
  duct: 'канальные',
  floor: 'напольно-потолочные',
};

const tenge = (n) => `${n.toLocaleString('ru-RU')} ₸`;

// A seven-figure total is easier to hold in the head as millions.
const millions = (n) =>
  `${(n / 1e6).toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} млн ₸`;

function read(form) {
  const d = new FormData(form);
  return {
    kind: d.get('kind'),
    area: +d.get('area'),
    unit: d.get('unit'),
    vent: d.get('vent'),
    design: d.get('design'),
  };
}

function calculate(s) {
  const vrf = PRICES.vrf[s.area];
  const kind = PRICES.kind[s.kind];
  const lines = [
    { label: `VRF ${vrf.outdoor}, ${vrf.units} внутренних блоков`, sum: vrf.sum },
  ];

  const perUnit = PRICES.unit[s.unit];
  if (perUnit) {
    lines.push({
      label: `Блоки ${UNIT_LABEL[s.unit]}, ${vrf.units} × ${tenge(perUnit)}`,
      sum: vrf.units * perUnit,
    });
  }

  if (s.vent === 'full') {
    const vent = PRICES.vent[s.area];
    const label = kind.vent === 1
      ? `Приточно-вытяжная с рекуперацией, ${vent.flow}`
      : `Приточно-вытяжная с рекуперацией, ${vent.flow} · ${kind.label}, воздухообмен ×${String(kind.vent).replace('.', ',')}`;
    lines.push({ label, sum: Math.round(vent.sum * kind.vent) });
  }

  if (s.design === 'ours') {
    lines.push({
      label: `Проект, ${s.area} м² × ${tenge(PRICES.designPerM2)}/м²`,
      sum: Math.max(PRICES.designMin, s.area * PRICES.designPerM2),
    });
  }

  lines.push({ label: 'Обследование объекта', sum: 0, free: 'бесплатно' });

  return { vrf, lines, total: lines.reduce((a, l) => a + l.sum, 0) };
}

function message(s, r) {
  const kind = PRICES.kind[s.kind].label;
  return [
    'Здравствуйте! Посчитал на сайте:',
    `Объект — ${kind}, до ${s.area} м².`,
    `VRF ${r.vrf.outdoor}, ${r.vrf.units} блоков, ${UNIT_LABEL[s.unit]}.`,
    s.vent === 'full' ? 'Нужна приточно-вытяжная вентиляция с рекуперацией.' : 'Вентиляция уже есть на объекте.',
    s.design === 'ours' ? 'Проект нужен от вас.' : 'Проект есть свой.',
    `Вышло около ${millions(r.total)}. Когда можно на обследование?`,
  ].join('\n');
}

export function initEstimate() {
  const form = document.getElementById('calc');
  const body = document.getElementById('breakdown');
  const total = document.getElementById('total');
  const dock = document.getElementById('dock');
  const dockTotal = document.getElementById('dockTotal');
  const dockGo = document.getElementById('dockGo');
  if (!form || !body) return null;

  let touched = false;

  function render() {
    const state = read(form);
    const r = calculate(state);

    body.replaceChildren(...r.lines.map((l) => {
      const tr = document.createElement('tr');
      if (l.free) tr.className = 'is-free';
      const td = document.createElement('td');
      td.textContent = l.label;
      const val = document.createElement('td');
      val.textContent = l.free || tenge(l.sum);
      tr.append(td, val);
      return tr;
    }));

    total.textContent = millions(r.total);
    dockTotal.textContent = millions(r.total);

    // In demo mode the dock must not reach the real company with an invented
    // seven-figure total attached. initDemo() strips hrefs once at boot; this
    // one is rewritten on every recalculation, so it has to check for itself.
    if (!isDemo()) {
      dockGo.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message(state, r))}`;
    }
  }

  const api = { dock, isTouched: () => touched, onTouch: null };

  form.addEventListener('change', () => {
    render();
    if (!touched) {
      touched = true;
      dock.hidden = false;
    }
    // Whether the dock is actually shown is main.js's call — it stays down
    // while the calculator itself is on screen.
    requestAnimationFrame(() => api.onTouch?.());
  });

  render();
  return api;
}
