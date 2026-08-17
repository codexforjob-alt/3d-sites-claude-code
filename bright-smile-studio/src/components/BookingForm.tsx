'use client'

import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { clinic, serviceOptions } from '@/lib/content'
import { VideoBackground } from './VideoBackground'
import { SmileArc } from './SmileArc'
import { useMotionPref } from './MotionProvider'

type Field = 'name' | 'phone' | 'service' | 'date'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

const LABELS: Record<Field, string> = {
  name: 'Имя',
  phone: 'Телефон',
  service: 'Услуга',
  date: 'Удобная дата',
}

function validate(values: Values, today: string): Errors {
  const errors: Errors = {}

  const name = values.name.trim()
  if (!name) errors.name = 'Напишите, как к вам обращаться'
  else if (name.length < 2) errors.name = 'Имя от 2 символов'

  const digits = values.phone.replace(/\D/g, '')
  if (!digits) errors.phone = 'Телефон нужен, чтобы перезвонить'
  else if (digits.length < 11) errors.phone = 'Похоже, номер неполный — 11 цифр'

  if (!values.service) errors.service = 'Выберите услугу или консультацию'

  if (!values.date) errors.date = 'Выберите дату визита'
  else if (values.date < today) errors.date = 'Дата уже прошла'

  return errors
}

export function BookingForm() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [values, setValues] = useState<Values>({
    name: '',
    phone: '',
    service: '',
    date: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const { reduced } = useMotionPref()

  const set = (field: Field) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: value }, today))
    }
  }

  const blur = (field: Field) => () => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(values, today))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate(values, today)
    setErrors(found)
    setTouched({ name: true, phone: true, service: true, date: true })

    const firstBad = (Object.keys(LABELS) as Field[]).find((f) => found[f])
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`#field-${firstBad}`)?.focus()
      return
    }

    setState('sending')
    // Demo site: nothing is sent anywhere, the delay only mimics a request.
    await new Promise((r) => setTimeout(r, 900))
    setState('sent')
  }

  const inputBase =
    'w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand'

  function fieldClass(field: Field) {
    return `${inputBase} ${
      errors[field] && touched[field] ? 'border-red-500' : 'border-line'
    }`
  }

  function ErrorText({ field }: { field: Field }) {
    const message = touched[field] ? errors[field] : undefined
    return (
      <AnimatePresence initial={false}>
        {message && (
          <motion.p
            id={`error-${field}`}
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-2 text-sm text-red-600"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    )
  }

  const describedBy = (field: Field) =>
    touched[field] && errors[field] ? `error-${field}` : undefined

  return (
    <section id="booking" className="scroll-mt-24 bg-white py-24 sm:py-32">
      <div className="container-page">
        <div
          data-reveal
          className="grid overflow-hidden rounded-4xl border border-line lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]"
        >
          {/* Left: contact panel, brand-tinted video texture behind it. */}
          <div className="relative isolate overflow-hidden bg-brand-deep p-8 sm:p-12">
            <VideoBackground
              name="cta-smile"
              className="absolute inset-0 -z-10"
              mediaClassName="mix-blend-luminosity opacity-25 object-[26%_center]"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-deep/85 to-brand-deep/60"
            />

            <p className="eyebrow !text-mint">Запись на приём</p>
            <h2 className="h-section mt-4 !text-white">
              Оставьте заявку — перезвоним в тот же день
            </h2>
            <SmileArc className="mt-6 h-3 w-24 text-mint" strokeWidth={5} />

            <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-white/85">
              Администратор уточнит удобное время и напомнит, что взять с собой.
              Консультация ни к чему не обязывает.
            </p>

            <dl className="mt-10 space-y-5 text-sm text-white/85">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-mint">
                  Телефон
                </dt>
                <dd className="mt-1">
                  <a
                    href={clinic.phoneHref}
                    className="text-white underline-offset-4 hover:underline"
                  >
                    {clinic.phoneLabel}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-mint">
                  Адрес
                </dt>
                <dd className="mt-1">{clinic.address}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-mint">
                  Часы приёма
                </dt>
                <dd className="mt-1 space-y-1">
                  {clinic.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days} — {h.time}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: the form itself. */}
          <div className="relative bg-white p-8 sm:p-12">
            <AnimatePresence mode="wait" initial={false}>
              {state === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full flex-col items-start justify-center"
                  role="status"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-50 text-brand-deep">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-7 w-7"
                      aria-hidden
                    >
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-semibold">
                    Заявка принята
                  </h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                    {values.name.trim()}, это демонстрационный сайт — заявка никуда не
                    отправлена и нигде не сохранена. На реальном сайте здесь было бы
                    подтверждение звонка на {values.phone}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setValues({ name: '', phone: '', service: '', date: '' })
                      setTouched({})
                      setErrors({})
                      setState('idle')
                    }}
                    className="mt-8 cursor-pointer rounded-full border border-line px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:border-brand"
                  >
                    Заполнить ещё раз
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={onSubmit}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  aria-labelledby="booking-form-title"
                >
                  <h3 id="booking-form-title" className="font-display text-xl font-semibold">
                    Заявка на приём
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">
                    Все поля обязательны. Заявка не отправляется — это демонстрация.
                  </p>

                  <div className="mt-8 space-y-5">
                    <div>
                      <label
                        htmlFor="field-name"
                        className="block text-sm font-medium text-ink"
                      >
                        {LABELS.name}
                      </label>
                      <input
                        id="field-name"
                        name="name"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Как к вам обращаться"
                        value={values.name}
                        onChange={(e) => set('name')(e.target.value)}
                        onBlur={blur('name')}
                        aria-invalid={Boolean(touched.name && errors.name)}
                        aria-describedby={describedBy('name')}
                        className={`mt-2 ${fieldClass('name')}`}
                      />
                      <ErrorText field="name" />
                    </div>

                    <div>
                      <label
                        htmlFor="field-phone"
                        className="block text-sm font-medium text-ink"
                      >
                        {LABELS.phone}
                      </label>
                      <input
                        id="field-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+7 900 000-00-00"
                        value={values.phone}
                        onChange={(e) => set('phone')(e.target.value)}
                        onBlur={blur('phone')}
                        aria-invalid={Boolean(touched.phone && errors.phone)}
                        aria-describedby={describedBy('phone')}
                        className={`mt-2 ${fieldClass('phone')}`}
                      />
                      <ErrorText field="phone" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="field-service"
                          className="block text-sm font-medium text-ink"
                        >
                          {LABELS.service}
                        </label>
                        <select
                          id="field-service"
                          name="service"
                          value={values.service}
                          onChange={(e) => set('service')(e.target.value)}
                          onBlur={blur('service')}
                          aria-invalid={Boolean(touched.service && errors.service)}
                          aria-describedby={describedBy('service')}
                          className={`mt-2 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2345646c%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat pr-12 ${fieldClass('service')}`}
                        >
                          {serviceOptions.map((o) => (
                            <option key={o.value || 'empty'} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <ErrorText field="service" />
                      </div>

                      <div>
                        <label
                          htmlFor="field-date"
                          className="block text-sm font-medium text-ink"
                        >
                          {LABELS.date}
                        </label>
                        <input
                          id="field-date"
                          name="date"
                          type="date"
                          min={today}
                          value={values.date}
                          onChange={(e) => set('date')(e.target.value)}
                          onBlur={blur('date')}
                          aria-invalid={Boolean(touched.date && errors.date)}
                          aria-describedby={describedBy('date')}
                          className={`mt-2 cursor-pointer ${fieldClass('date')}`}
                        />
                        <ErrorText field="date" />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={state === 'sending'}
                    whileHover={state === 'sending' ? undefined : { scale: 1.02 }}
                    whileTap={state === 'sending' ? undefined : { scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                    className="mt-9 inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-brand-deep px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-brand disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                  >
                    {state === 'sending' && (
                      <span
                        aria-hidden
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                    )}
                    {state === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
                  </motion.button>

                  <p className="mt-4 text-xs leading-relaxed text-ink-soft">
                    Нажимая кнопку, вы соглашаетесь на обработку данных. На этом
                    демо-сайте данные не покидают вкладку браузера.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
