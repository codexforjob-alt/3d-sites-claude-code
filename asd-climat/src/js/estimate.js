/**
 * The estimator.
 *
 * This is the one thing on the page that isn't decoration: it runs the same
 * arithmetic the crews price by, so the numbers here and the numbers in the
 * two ledger tables above cannot drift apart — both come from PRICES.
 *
 * The output ends as a pre-filled WhatsApp message, because that is where this
 * business actually takes orders.
 */

const PHONE = '77788242222';

const PRICES = {
  // area (m²) → indoor unit size
  power: { 20: '07', 25: '09', 35: '12', 50: '18', 70: '24' },
  equip: {
    '07': { base: 118000, inv: 198000 },
    '09': { base: 129000, inv: 215000 },
    '12': { base: 168000, inv: 289000 },
    '18': { base: 245000, inv: 366000 },
    '24': { base: 322000, inv: 474000 },
  },
  mount: { '07': 45000, '09': 45000, '12': 52000, '18': 68000, '24': 85000 },
  routeIncluded: 3,
  routePerM: 7000,
  wall: { none: 0, brick: 4500, concrete: 7000 },
  rope: 25000,
};

const CLASS_LABEL = { base: 'ALMACOM или OTEX', inv: 'инвертор GREE или LG' };
const WALL_LABEL = { brick: 'кирпич, газоблок', concrete: 'монолит' };

const tenge = (n) => `${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ₸`;

function read(form) {
  const d = new FormData(form);
  return {
    area: +d.get('area'),
    cls: d.get('class'),
    route: +d.get('route'),
    wall: d.get('wall'),
    access: d.get('access'),
  };
}

function calculate(s) {
  const power = PRICES.power[s.area];
  const lines = [
    { label: `Блок ${power}, ${CLASS_LABEL[s.cls]}`, sum: PRICES.equip[power][s.cls] },
    { label: `Монтаж, трасса до ${PRICES.routeIncluded} м`, sum: PRICES.mount[power] },
  ];

  const extra = Math.max(0, s.route - PRICES.routeIncluded);
  if (extra) lines.push({ label: `Трасса, ещё ${extra} м`, sum: extra * PRICES.routePerM });

  if (s.wall !== 'none') {
    lines.push({
      label: `Штробление ${s.route} м, ${WALL_LABEL[s.wall]}`,
      sum: s.route * PRICES.wall[s.wall],
    });
  }

  if (s.access === 'rope') lines.push({ label: 'Промышленный альпинизм', sum: PRICES.rope });

  lines.push({ label: 'Замер по Алматы', sum: 0, free: 'бесплатно' });

  return { power, lines, total: lines.reduce((a, l) => a + l.sum, 0) };
}

function message(s, r) {
  return [
    'Здравствуйте! Посчитал на сайте:',
    `Комната до ${s.area} м², блок ${r.power}, ${CLASS_LABEL[s.cls]}.`,
    `Трасса ${s.route} м${s.wall === 'none' ? ', без штробления' : `, штробление — ${WALL_LABEL[s.wall]}`}.`,
    s.access === 'rope' ? 'Наружный блок на глухом фасаде выше 3 этажа.' : 'Наружный блок на балконе или до 3 этажа.',
    `Вышло ${tenge(r.total)}. Когда можно на замер?`,
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

    total.textContent = tenge(r.total);
    dockTotal.textContent = tenge(r.total);
    dockGo.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message(state, r))}`;
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
