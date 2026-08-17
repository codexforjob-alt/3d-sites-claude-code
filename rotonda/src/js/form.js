/**
 * Front-end validation only — there is no backend wired up. Errors sit next
 * to their field rather than in a summary at the top, and each field is
 * checked on blur instead of only on submit.
 */
export function initForm() {
  const form = document.getElementById('form');
  if (!form) return;

  const ok = document.getElementById('form-ok');
  const digits = (s) => s.replace(/\D/g, '');

  const rules = {
    name: (v) => (v.trim().length >= 2 ? '' : 'bad'),
    tel: (v) => (digits(v).length === 11 ? '' : 'bad'),
  };

  const fieldOf = (input) => input.closest('.field');
  const errOf = (input) => document.getElementById('e-' + input.id.slice(2));

  function check(input, show) {
    const rule = rules[input.name];
    if (!rule) return true;
    const bad = rule(input.value) === 'bad';
    const field = fieldOf(input);
    const err = errOf(input);
    if (show) {
      field.classList.toggle('is-bad', bad);
      if (err) err.hidden = !bad;
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (err) input.setAttribute('aria-describedby', bad ? err.id : '');
    }
    return !bad;
  }

  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('blur', () => check(input, true));
    input.addEventListener('input', () => {
      if (fieldOf(input).classList.contains('is-bad')) check(input, true);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = Array.from(form.querySelectorAll('input, textarea'));
    const bad = inputs.filter((i) => !check(i, true));

    if (bad.length) {
      bad[0].focus();
      return;
    }

    const name = form.querySelector('#f-name').value.trim().split(/\s+/)[0];
    ok.hidden = false;
    ok.textContent =
      `${name}, заявка отправлена. Администратор перезвонит в рабочие часы — ` +
      `сегодня до 20:00. Форма демонстрационная: письмо никуда не уходит.`;
    form.querySelectorAll('input, textarea').forEach((i) => { i.value = ''; });
    ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}
